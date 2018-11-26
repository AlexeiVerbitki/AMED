package com.bass.amed.service;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.license.LicenseResolutionRepository;
import com.bass.amed.repository.NmStatesRepository;
import com.bass.amed.repository.RequestRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LicenseRegistrationRequestService
{
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private NmStatesRepository statesRepository;

    @Autowired
    private LocalityService localityService;

    @Autowired
    private LicenseResolutionRepository licenseResolutionRepository;

    @Transactional(readOnly = true)
    public RegistrationRequestsEntity findLicenseRegistrationById(Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> re = requestRepository.findById(id);

        if (!re.isPresent())
        {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }
        else if (re.get().getEndDate() != null)
        {
            throw new CustomException("Cererea a fost deja finisata!!!");
        }
        RegistrationRequestsEntity rrE = re.get();
        rrE.setLicense((LicensesEntity)Hibernate.unproxy(re.get().getLicense()));
//        rrE.getLicense().getAddresses().forEach(
//                addr -> addr.setState(statesRepository.findById(addr.getLocality().getStateId()).get())
//        );

        rrE.getLicense().setDetail(rrE.getLicense().getDetails().stream().filter(det -> det.getRegistrationId().equals(rrE.getId())).findFirst().get());

        for (NmEconomicAgentsEntity ece : rrE.getLicense().getEconomicAgents())
        {
            ece.setLocality(localityService.findLocalityById(ece.getLocality().getId()));
            ece.setSelectedPharmaceutist(ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
        }

        for (NmEconomicAgentsEntity ne : rrE.getLicense().getEconomicAgents())
        {
            ne.setCurrentResolution(ne.getResolutions().stream().filter(e -> e.getLicenseDetailId().equals(rrE.getLicense().getDetail().getId())).findFirst().orElse(null));
        }



//        if (rrE.getLicense().getAgentPharmaceutist() != null && !rrE.getLicense().getAgentPharmaceutist().isEmpty())
//        {
//            rrE.getLicense().setSelectedPharmaceutist(rrE.getLicense().getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
//        }
//
//
//        if (rrE.getLicense().getResolutions() != null && !rrE.getLicense().getResolutions().isEmpty())
//        {
//            Optional<LicenseResolutionEntity> first = rrE.getLicense().getResolutions().stream().filter(r -> r.getRegistrationId().equals(rrE.getId())).findFirst();
//            if (first.isPresent())
//            {
//                rrE.getLicense().setResolution(first.get());
//            }
//        }

        return rrE;
    }


    public void saveNewLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();



            em.persist(request);

//            LicensesEntity l = em.find(LicensesEntity.class, request.getLicense().getId());

            LicenseDetailsEntity detail = request.getLicense().getDetail();
            detail.setRegistrationId(request.getId());
            request.getLicense().getDetails().add(detail);

            em.merge(request);



            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }

    public void updateRegistrationLicense(RegistrationRequestsEntity request, boolean next) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            //License Details
            LicenseDetailsEntity lde = em.find(LicenseDetailsEntity.class, request.getLicense().getDetail().getId());
            boolean updateDetails = false;

            //Update documents
            Set<DocumentsEntity> dSet = request.getLicense().getDetail().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                lde.getDocuments().addAll(dSet);
                updateDetails = true;
            }


            //Update receipts
            Set<ReceiptsEntity> rSet = request.getLicense().getDetail().getReceipts().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!rSet.isEmpty()){
                lde.getReceipts().addAll(rSet);
                updateDetails = true;
            }

            //Update payments
            Set<PaymentOrdersEntity> pSet = request.getLicense().getDetail().getPaymentOrders().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!pSet.isEmpty()){
                lde.getPaymentOrders().addAll(pSet);
                updateDetails = true;
            }


            //Commision responses
            for (LicenseCommisionResponseEntity le : request.getLicense().getDetail().getCommisionResponses())
            {
                if (le.getId() != null){
                    LicenseCommisionResponseEntity lTmp = em.find(LicenseCommisionResponseEntity.class, le.getId());
                    lTmp.setDate(le.getDate());
                    lTmp.setAnnouncedMethods(le.getAnnouncedMethods());
                    lTmp.setEntryRspNumber(le.getEntryRspNumber());
                    lTmp.setOrganization(le.getOrganization());
                    lTmp.setExtraData(le.getExtraData());

                    em.merge(lTmp);
                }
            }

            Set<LicenseCommisionResponseEntity> newC = request.getLicense().getDetail().getCommisionResponses().stream().filter(co -> co.getId() == null).collect(Collectors.toSet());
            if (!newC.isEmpty())
            {
                lde.setCommisionResponses(newC);
            }

            //Merge data
            if (updateDetails)
            {
                em.merge(lde);
            }


            //Economic agents
            //From view
            Set<NmEconomicAgentsEntity> ecViewList =  request.getLicense().getEconomicAgents();
            //Existing
            Set<NmEconomicAgentsEntity> ecExistingList =  r.getLicense().getEconomicAgents();

            Set<Integer> ecViewIds = ecViewList.stream().map(x -> x.getId()).collect(Collectors.toSet());
            Set<Integer> ecExistingIds = ecExistingList.stream().map(x -> x.getId()).collect(Collectors.toSet());

            ecExistingIds.removeAll(ecViewIds);

            for (Integer rmv : ecExistingIds)
            {
                NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, rmv);

                ec.setLicenseId(null);

                em.merge(ec);
            }

            for (NmEconomicAgentsEntity ecView : ecViewList)
            {
                NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, ecView.getId());

//                ec = ecView;

                //Farmacisti
                ec.getAgentPharmaceutist().clear();
                ec.getAgentPharmaceutist().addAll(ecView.getAgentPharmaceutist());


                //Activitati
                ec.getActivities().clear();
                ec.getActivities().addAll(ecView.getActivities());

                //Resolution
                if (ecView.getCurrentResolution() != null)
                {
                    ecView.getCurrentResolution().setLicenseDetailId(request.getLicense().getDetail().getId());
                    ec.getResolutions().clear();
                    ec.getResolutions().add(ecView.getCurrentResolution());
                }


                ec.setLicenseId(request.getLicense().getId());

                em.merge(ec);
            }

//            //License
//            LicensesEntity lEntity = em.find(LicensesEntity.class, request.getLicense().getId());
//
//            r.getLicense().getEconomicAgents().clear();
//            r.getLicense().getEconomicAgents().addAll(request.getLicense().getEconomicAgents());


            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            r.setCurrentStep(request.getCurrentStep());
            r.setAssignedUser(request.getAssignedUser());

            em.merge(r);

            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }


    public void finishLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            //Update documents
//            Set<DocumentsEntity> dSet = request.getLicense().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());
//
//            if (!dSet.isEmpty()){
//                r.getLicense().getDocuments().addAll(dSet);
//            }


            //Update mandated contact
//            LicenseMandatedContactEntity lme = new ArrayList<>(request.getLicense().getLicenseMandatedContacts()).get(0);
//            if (lme.getNewMandatedLastname() != null)
//            {
//                LicenseMandatedContactEntity lm = em.find(LicenseMandatedContactEntity.class, lme.getId());
//                lm.setNewPhoneNumber(lme.getNewPhoneNumber());
//                lm.setNewEmail(lme.getNewEmail());
//                lm.setNewMandatedFirstname(lme.getNewMandatedFirstname());
//                lm.setNewMandatedLastname(lme.getNewMandatedLastname());
//                lm.setNewMandatedNr(lme.getNewMandatedNr());
//                lm.setNewMandatedDate(lme.getNewMandatedDate());
//
//                em.merge(lm);
//            }

            r.getLicense().setSerialNr(request.getLicense().getSerialNr());
            r.getLicense().setNr(request.getLicense().getNr());

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            r.setEndDate(request.getEndDate());

            if (request.getLicense().getStatus().equals("F"))
            {
                Date releaseDate = new Date();
                r.getLicense().setReleaseDate(releaseDate);

                Calendar c = Calendar.getInstance();
                c.setTime(releaseDate);
                c.add(Calendar.YEAR, 5);

                r.getLicense().setExpirationDate(c.getTime());
            }

            r.getLicense().setStatus(request.getLicense().getStatus());
            r.setCurrentStep(request.getCurrentStep());
            r.setAssignedUser(request.getAssignedUser());

            r.getLicense().setStatus(request.getLicense().getStatus());

            em.merge(r);

            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage());
        }
        finally
        {
            em.close();
        }
    }



    public void stopLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            RegistrationRequestsEntity r = em.find(RegistrationRequestsEntity.class, request.getId());

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));
            r.setEndDate(new Timestamp(new Date().getTime()));
            if (r.getType().getCode().equals("LICEL"))
            {
                r.getLicense().setStatus("C");
            }

            r.setCurrentStep("C");

            em.merge(r);

            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }



    public void updateModifyLicense(RegistrationRequestsEntity request) throws CustomException
    {
        EntityManager em = null;
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            LicensesEntity originalLicense = request.getLicense();
            LicensesEntity le = em.find(LicensesEntity.class, originalLicense.getId());
            request.setLicense(le);

            //New request
            em.persist(request);


            LicenseDetailsEntity detail = originalLicense.getDetail();
            detail.setRegistrationId(request.getId());
            request.getLicense().getDetails().add(detail);

            em.merge(request);

//            //Update license
//            //Mandated contact
//            LicenseMandatedContactEntity mandatedContact = new ArrayList<>(originalLicense.getDetail().getLicenseMandatedContacts()).get(0);
//            mandatedContact.set setRegistrationRequestId(request.getId());
//            le.getLicenseMandatedContacts().add(mandatedContact);
//
//            em.merge(le);
            em.getTransaction().commit();

        }
        catch (Exception e){
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        }
        finally
        {
            em.close();
        }
    }
}
