package com.bass.amed.service;

import com.bass.amed.common.Constants;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
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
                r.getLicense().setResolution(request.getLicense().getResolution());
            }
            else {
                LicenseResolutionEntity lre = em.find(LicenseResolutionEntity.class, r.getLicense().getResolution().getId());
                lre.setDate(request.getLicense().getResolution().getDate());
                lre.setPharmacyMaster(request.getLicense().getResolution().getPharmacyMaster());
                lre.setReason(request.getLicense().getResolution().getReason());
                lre.setResolution(request.getLicense().getResolution().getResolution());

                em.merge(lre);
            }


            r.getLicense().setSerialNr(request.getLicense().getSerialNr());
            r.getLicense().setNr(request.getLicense().getNr());
            r.getLicense().setTax(request.getLicense().getTax());
            r.getLicense().setTaxPaid(request.getLicense().getTaxPaid());

            //Update documents
            Set<DocumentsEntity> dSet = request.getLicense().getDocuments().stream().filter(d -> d.getId() == null).collect(Collectors.toSet());

            if (!dSet.isEmpty()){
                r.getLicense().getDocuments().addAll(dSet);
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
            r.getLicense().setStatus("C");

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
