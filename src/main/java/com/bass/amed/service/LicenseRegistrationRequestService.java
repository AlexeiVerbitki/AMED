package com.bass.amed.service;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.EconomicAgentsRepository;
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

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

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

        rrE.getLicense().setDetail(rrE.getLicense().getDetails().stream().filter(det -> det.getRegistrationId().equals(rrE.getId())).findFirst().orElse(null));

        for (NmEconomicAgentsEntity ece : rrE.getLicense().getEconomicAgents())
        {
            if (rrE.getLicense().getCompanyName() == null)
            {
                rrE.getLicense().setCompanyName(ece.getLongName());
            }

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
            request.getLicense().setCurrentStatus("A");

            em.persist(request);

//            LicensesEntity l = em.find(LicensesEntity.class, request.getLicense().getId());

            LicenseDetailsEntity detail = request.getLicense().getDetail();
            detail.setRegistrationId(request.getId());
            request.getLicense().getDetails().add(detail);


            em.merge(request);


            List<NmEconomicAgentsEntity> agentsByIdno = economicAgentsRepository.findAllByIdno(request.getLicense().getIdno());

            for (NmEconomicAgentsEntity ag : agentsByIdno)
            {
                if (ag.getLicenseId() != null)
                {
                    NmEconomicAgentsEntity r = em.find(NmEconomicAgentsEntity.class, ag.getId());

                    r.setLicenseId(null);

                    em.merge(r);
                }
            }

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

                ec.setType(ecView.getType());

                //Cesionare
                if (request.getType().getCode().equals("LICC") && !ecView.getIdno().equals(request.getLicense().getIdno()))
                {
                    NmEconomicAgentsEntity originalEc = ecViewList.stream().filter(ss -> !ss.getIdno().equals(ecView.getIdno())).findFirst().get();

                    ec.setOldIdno(ecView.getIdno());
                    ec.setIdno(request.getLicense().getIdno());



                    ec.setName(originalEc.getName());
                    ec.setLongName(originalEc.getLongName());
                    ec.setLegalAddress(originalEc.getLegalAddress());
                }

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

            r.getLicense().setSerialNr(request.getLicense().getSerialNr());
            r.getLicense().setNr(request.getLicense().getNr());

            r.getLicense().setCurrentStatus(null);

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));

            r.setEndDate(request.getEndDate());

            if (request.getType().getCode().equals("LICEL") && request.getLicense().getStatus().equals("F"))
            {
                Date releaseDate = new Date();
                r.getLicense().setReleaseDate(releaseDate);

                Calendar c = Calendar.getInstance();
                c.setTime(releaseDate);
                c.add(Calendar.YEAR, 5);

                r.getLicense().setExpirationDate(c.getTime());
            }

            //Prelungire
            if (request.getType().getCode().equals("LICP"))
            {
                Date curExpirationDate = request.getLicense().getExpirationDate();

                Calendar c = Calendar.getInstance();
                c.setTime(curExpirationDate);
                c.add(Calendar.YEAR, 5);

                r.getLicense().setExpirationDate(c.getTime());
            }

            //Anulare
            if (request.getType().getCode().equals("LICA"))
            {
                request.getLicense().setStatus("R");
                r.getLicense().setClosedDate(new Date());


                for (NmEconomicAgentsEntity ecView : r.getLicense().getEconomicAgents())
                {
                    NmEconomicAgentsEntity ec = em.find(NmEconomicAgentsEntity.class, ecView.getId());

                    ec.setLicenseId(null);

                    em.merge(ec);
                }

            }


            //Suspendare
            if (request.getType().getCode().equals("LICS"))
            {
                request.getLicense().setStatus("S");
                r.getLicense().setSuspendDate(new Date());
            }

            //Reluare
            if (request.getType().getCode().equals("LICRL"))
            {
                request.getLicense().setStatus("F");
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

            r.getLicense().setCurrentStatus(null);
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
            le.setCurrentStatus("A");
            le.setReason(originalLicense.getReason());
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
