package com.bass.amed.service;

import com.bass.amed.common.Constants;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.LicenseResolutionRepository;
import com.bass.amed.repository.NmStatesRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.utils.SecurityUtils;
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
        rrE.getLicense().getAddresses().forEach(
                addr -> addr.setState(statesRepository.findById(addr.getLocality().getStateId()).get())
        );
        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(re.get().getCompany()));

        if (rrE.getLicense().getAgentPharmaceutist() != null && !rrE.getLicense().getAgentPharmaceutist().isEmpty())
        {
            rrE.getLicense().setSelectedPharmaceutist(rrE.getLicense().getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate)).get());
        }


        if (rrE.getLicense().getResolutions() != null && !rrE.getLicense().getResolutions().isEmpty())
        {
            Optional<LicenseResolutionEntity> first = rrE.getLicense().getResolutions().stream().filter(r -> r.getRegistrationId().equals(rrE.getId())).findFirst();
            if (first.isPresent())
            {
                rrE.getLicense().setResolution(first.get());
            }
        }

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

            for (LicenseMandatedContactEntity lmce : request.getLicense().getLicenseMandatedContacts())
            {
                lmce.setRegistrationRequestId(request.getId());
                em.merge(lmce);
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

            //Update object addresses
            r.getLicense().setAddresses(request.getLicense().getAddresses());

            //Update resolution
            if (r.getLicense().getResolution() == null)
            {
                LicenseResolutionEntity resolutionAng = request.getLicense().getResolution();
                resolutionAng.setRegistrationId(r.getId());
                r.getLicense().getResolutions().add(resolutionAng);
            }
            else {
                LicenseResolutionEntity lre = em.find(LicenseResolutionEntity.class, r.getLicense().getResolution().getId());
                lre.setDate(request.getLicense().getResolution().getDate());
                lre.setReason(request.getLicense().getResolution().getReason());
                lre.setResolution(request.getLicense().getResolution().getResolution());

                em.merge(lre);
            }


            r.getLicense().setSerialNr(request.getLicense().getSerialNr());
            r.getLicense().setNr(request.getLicense().getNr());

            //Update documents
            Set<DocumentsEntity> dSet = request.getLicense().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                r.getLicense().getDocuments().addAll(dSet);
            }


            //Update receipts
            Set<ReceiptsEntity> rSet = request.getLicense().getReceipts().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!rSet.isEmpty()){
                r.getLicense().getReceipts().addAll(rSet);
            }

            //Update payments
            Set<PaymentOrdersEntity> pSet = request.getLicense().getPaymentOrders().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!pSet.isEmpty()){
                r.getLicense().getPaymentOrders().addAll(pSet);
            }

            //Update farmacisti
            Set<LicenseAgentPharmaceutistEntity> fSet = request.getLicense().getAgentPharmaceutist().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!fSet.isEmpty()){
                r.getLicense().getAgentPharmaceutist().addAll(fSet);
            }

            for (LicenseAgentPharmaceutistEntity lap : request.getLicense().getAgentPharmaceutist())
            {
                if (lap.getId() != null)
                {
                    LicenseAgentPharmaceutistEntity lTmp = em.find(LicenseAgentPharmaceutistEntity.class, lap.getId());
                    lTmp.setSelectionDate(lap.getSelectionDate());

                    em.merge(lTmp);
                }
            }

            //Update commision response
            for (LicenseCommisionResponseEntity le : request.getLicense().getCommisionResponses())
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

            Set<LicenseCommisionResponseEntity> newC = request.getLicense().getCommisionResponses().stream().filter(co -> co.getId() == null).collect(Collectors.toSet());
            if (!newC.isEmpty())
            {
                r.getLicense().setCommisionResponses(newC);
            }

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));


            //Update activities
            r.getLicense().getActivities().clear();
            r.getLicense().getActivities().addAll(request.getLicense().getActivities());

            if (next)
            {
                r.setCurrentStep("I");

            }

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
            Set<DocumentsEntity> dSet = request.getLicense().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                r.getLicense().getDocuments().addAll(dSet);
            }


            //Update mandated contact
            LicenseMandatedContactEntity lme = new ArrayList<>(request.getLicense().getLicenseMandatedContacts()).get(0);
            if (lme.getNewMandatedLastname() != null)
            {
                LicenseMandatedContactEntity lm = em.find(LicenseMandatedContactEntity.class, lme.getId());
                lm.setNewPhoneNumber(lme.getNewPhoneNumber());
                lm.setNewEmail(lme.getNewEmail());
                lm.setNewMandatedFirstname(lme.getNewMandatedFirstname());
                lm.setNewMandatedLastname(lme.getNewMandatedLastname());
                lm.setNewMandatedNr(lme.getNewMandatedNr());
                lm.setNewMandatedDate(lme.getNewMandatedDate());

                em.merge(lm);
            }

            r.getRequestHistories().add(new ArrayList<>(request.getRequestHistories()).get(0));
            r.setEndDate(request.getEndDate());
            r.getLicense().setStatus(request.getLicense().getStatus());
            Date releaseDate = new Date();
            r.getLicense().setReleaseDate(releaseDate);

            Calendar c = Calendar.getInstance();
            c.setTime(releaseDate);
            c.add(Calendar.YEAR, 5);

            r.getLicense().setExpirationDate(c.getTime());
            r.setCurrentStep(request.getCurrentStep());

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

            //Update license
            Set<DocumentsEntity> dSet = originalLicense.getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                le.getDocuments().addAll(dSet);
            }


            //Mandated contact
            LicenseMandatedContactEntity mandatedContact = new ArrayList<>(originalLicense.getLicenseMandatedContacts()).get(0);
            mandatedContact.setRegistrationRequestId(request.getId());
            le.getLicenseMandatedContacts().add(mandatedContact);

            em.merge(le);
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
