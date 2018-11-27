package com.bass.amed.service;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.CtMedINstInvestigatorRepository;
import com.bass.amed.repository.RequestRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EmbeddedId;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.*;

@Service
@Transactional
public class ClinicalTrailsService {
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private CtMedINstInvestigatorRepository medINstInvestigatorRepository;

    public void registerNewClinicalTrailAmendment(RegistrationRequestsEntity requests) throws CustomException {

        EntityManager em = null;
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            ClinicalTrialsEntity clinicalTrialsEntity = requests.getClinicalTrails();
            requests.setClinicalTrails(null);

            em.persist(requests);

            List<ClinicTrialAmendEntity> clinicTrialAmendEntities = clinicalTrialsEntity.getClinicTrialAmendEntities();
            ClinicTrialAmendEntity clinicTrialAmendEntity = new ClinicTrialAmendEntity();
            if (clinicTrialAmendEntities == null) {
                clinicTrialAmendEntities = new ArrayList<>();
            }
            clinicTrialAmendEntity.setClinicalTrialsEntityId(clinicalTrialsEntity.getId());
            clinicTrialAmendEntity.setRegistrationRequestId(requests.getId());
            clinicTrialAmendEntity.setTreatment(clinicalTrialsEntity.getTreatment());
            clinicTrialAmendEntity.setProvenance(clinicalTrialsEntity.getProvenance());
            clinicTrialAmendEntity.setPhase(clinicalTrialsEntity.getPhase());
            clinicTrialAmendEntity.setEudraCtNr(clinicalTrialsEntity.getEudraCtNr());
            clinicTrialAmendEntity.setCode(clinicalTrialsEntity.getCode());
            clinicTrialAmendEntity.setTitle(clinicalTrialsEntity.getTitle());
            clinicTrialAmendEntity.setSponsor(clinicalTrialsEntity.getSponsor());
            clinicTrialAmendEntity.setMedicament(clinicalTrialsEntity.getMedicament());
            clinicTrialAmendEntity.setReferenceProduct(clinicalTrialsEntity.getReferenceProduct());
            clinicTrialAmendEntity.setPlacebo(clinicalTrialsEntity.getPlacebo());
            clinicTrialAmendEntity.setTrialPopNat(clinicalTrialsEntity.getTrialPopNat());
            clinicTrialAmendEntity.setTrialPopInternat(clinicalTrialsEntity.getTrialPopInternat());
            clinicTrialAmendEntity.setStatus("P");
//            clinicTrialAmendEntity.setMedicalInstitutions(clinicalTrialsEntity.getMedicalInstitutions());
            em.persist(clinicTrialAmendEntity);

            clinicTrialAmendEntities.add(clinicTrialAmendEntity);

            clinicalTrialsEntity.setClinicTrialAmendEntities(clinicTrialAmendEntities);


            requests.setClinicalTrails(clinicalTrialsEntity);
            em.merge(requests);

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally {
            em.close();
        }
    }

//    public void loadClinicalTrialsAmendmentEntity(RegistrationRequestsEntity requests) throws CustomException {
//        EntityManager em = null;
//        try {
//            em = entityManagerFactory.createEntityManager();
//            em.getTransaction().begin();
//
//
//        } catch (Exception e) {
//            if (em != null) {
//                em.getTransaction().rollback();
//            }
//            throw new CustomException(e.getMessage(), e);
//        } finally {
//            em.close();
//        }
//
//    }

    public void handeMedicalInstitutions(RegistrationRequestsEntity requests) throws CustomException {
        Set<CtMedInstInvestigatorEntity> requestTypesStepEntityList2 = medINstInvestigatorRepository.findCtMedInstInvestigatorById(requests.getClinicalTrails().getId());

        Set<CtMedInstInvestigatorEntity> ctMedInstInvestigatorEntities = new HashSet<>();
        requests.getClinicalTrails().getMedicalInstitutions().forEach(medInst ->{
            medInst.getInvestigators().forEach(investig -> {
                CtMedInstInvestigatorEntity entity = new CtMedInstInvestigatorEntity(requests.getClinicalTrails().getId(), medInst.getId(), investig.getId(), Boolean.TRUE);
                entity.setInvestigatorsEntity(investig);
                entity.setMedicalInstitutionsEntity(medInst);
                entity.setClinicalTrialsEntity(requests.getClinicalTrails());
                entity.setMainInvestigator(investig.getMain());
                ctMedInstInvestigatorEntities.add(entity);
            });
        });

        medINstInvestigatorRepository.deleteAll(requestTypesStepEntityList2);
        medINstInvestigatorRepository.saveAll(ctMedInstInvestigatorEntities);
    }
}
