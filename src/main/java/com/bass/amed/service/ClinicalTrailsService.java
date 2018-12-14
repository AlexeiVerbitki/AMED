package com.bass.amed.service;

import com.bass.amed.dto.MedicamentDetailsDTO;
import com.bass.amed.dto.clinicaltrial.ClinicalTrailFilterDTO;
import com.bass.amed.dto.clinicaltrial.ClinicalTrialDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.utils.MedicamentQueryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.sql.Timestamp;
import java.util.*;

@Service
@Transactional
public class ClinicalTrailsService {
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    private CtMedINstInvestigatorRepository medINstInvestigatorRepository;
    @Autowired
    private CtAmendMedInstInvestigatorRepository ctAmendMedInstInvestigatorRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    RegistrationRequestStepRepository registrationRequestStepRepository;
    @Autowired
    ClinicTrialAmendRepository clinicTrialAmendRepository;

    public List<ClinicalTrialDTO> retrieveClinicalTrailsByFilter(ClinicalTrailFilterDTO filter) throws CustomException {
        StringBuilder queryString = new StringBuilder(
                "select ct.id, ct.code, ct.EudraCT_nr, ctt1.description as treatment, ctt2.description as provenance, ct.sponsor, ct.med_comission_nr as cometee,  ct.med_comission_date as cometeeDate "
                        .concat("FROM amed.clinical_trials ct, amed.clinical_trials_types ctt1, amed.clinical_trials_types ctt2 ")
                        .concat("where ct.status='F' and ct.treatment_id=ctt1.id and ct.provenance_id=ctt2.id")
                //.concat(";")
        );

        EntityManager em = null;
        List<ClinicalTrialDTO> result = new ArrayList<>();
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();

            if (filter.getCode() != null && !filter.getCode().isEmpty()) {
                queryString.append(" and ct.code = :code");
            }
            if (filter.getEudraCtNr() != null && !filter.getEudraCtNr().isEmpty()) {
                queryString.append(" and ct.EudraCT_nr = :eudraCt");
            }
            if (filter.getTreatmentId() != null ) {
                queryString.append(" and ctt1.id = :treatmentId");
            }
            if (filter.getProvenanceId() != null ) {
                queryString.append(" and ctt2.id = :provenanceId");
            }

            Query query = em.createNativeQuery(queryString.toString(), ClinicalTrialDTO.class);

            if (filter.getCode() != null && !filter.getCode().isEmpty()) {
                query.setParameter("code", filter.getCode());
            }
            if (filter.getEudraCtNr() != null && !filter.getEudraCtNr().isEmpty()) {
                query.setParameter("eudraCt", filter.getEudraCtNr());
            }
            if (filter.getTreatmentId() != null ) {
                query.setParameter("treatmentId", filter.getTreatmentId());
            }
            if (filter.getProvenanceId() != null ) {
                query.setParameter("provenanceId", filter.getProvenanceId());
            }

            result = query.getResultList();
            System.out.println(result);

            em.getTransaction().commit();

        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage());
        } finally {
            em.close();
        }

        return result;
    }

    public void finishNewClinicalTrailAmendment(RegistrationRequestsEntity requests) throws CustomException {
        EntityManager em = null;
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            // ClinicalTrialsEntity clinicalTrialsEntity = em.find(ClinicalTrialsEntity.class, requests.getClinicalTrails().getId());

            ClinicalTrialsEntity clinicalTrialsEntity = requests.getClinicalTrails();
            ClinicTrialAmendEntity clinicTrialAmendEntity = clinicalTrialsEntity.getClinicTrialAmendEntities().stream().filter(entity ->
                    entity.getRegistrationRequestId().equals(requests.getId())
            ).findFirst().orElse(null);

            //Handle ClinicTrialAmendEntity
            clinicTrialAmendEntity.setPhaseFrom(clinicalTrialsEntity.getPhase());
            clinicTrialAmendEntity.setTreatmentFrom(clinicalTrialsEntity.getTreatment());
            clinicTrialAmendEntity.setProvenanceFrom(clinicalTrialsEntity.getProvenance());
            clinicTrialAmendEntity.setEudraCtNrFrom(clinicalTrialsEntity.getEudraCtNr());
            clinicTrialAmendEntity.setCodeFrom(clinicalTrialsEntity.getCode());
            clinicTrialAmendEntity.setTitleFrom(clinicalTrialsEntity.getTitle());
            clinicTrialAmendEntity.setSponsorFrom(clinicalTrialsEntity.getSponsor());
            clinicTrialAmendEntity.setTrialPopNatFrom(clinicalTrialsEntity.getTrialPopNat());
            clinicTrialAmendEntity.setTrialPopInternatFrom(clinicalTrialsEntity.getTrialPopInternat());

            //Handle medicaments
            handelMedicamentsFromAmendment(clinicTrialAmendEntity.getMedicament(), clinicalTrialsEntity.getMedicament());
            handelMedicamentsFromAmendment(clinicTrialAmendEntity.getReferenceProduct(), clinicalTrialsEntity.getReferenceProduct());
            handelMedicamentsFromAmendment(clinicTrialAmendEntity.getPlacebo(), clinicalTrialsEntity.getPlacebo());

            Set<NotRegMedActiveSubstEntity> cteMedActSubst = clinicalTrialsEntity.getMedicament().getActiveSubstances();
            Set<CtMedAmendActiveSubstEntity> amendMedActSubst = clinicTrialAmendEntity.getMedicament().getActiveSubstances();
            Set<CtMedAmendActiveSubstEntity> actMedSubstSet = handleActiveSubstances(amendMedActSubst, cteMedActSubst, clinicTrialAmendEntity.getMedicament().getId());
            clinicTrialAmendEntity.getMedicament().setActiveSubstances(actMedSubstSet);

            Set<NotRegMedActiveSubstEntity> cteRefProdActSubst = clinicalTrialsEntity.getReferenceProduct().getActiveSubstances();
            Set<CtMedAmendActiveSubstEntity> amendRefProdActSubst = clinicTrialAmendEntity.getReferenceProduct().getActiveSubstances();
            Set<CtMedAmendActiveSubstEntity> actRefProdSubstSet = handleActiveSubstances(amendRefProdActSubst, cteRefProdActSubst, clinicTrialAmendEntity.getReferenceProduct().getId());
            clinicTrialAmendEntity.getReferenceProduct().setActiveSubstances(actRefProdSubstSet);

            //medInstitutions && investigators
            List<CtMedInstInvestigatorEntity> ctMedInstInvestigatorsList = em.createQuery("select mi from CtMedInstInvestigatorEntity mi where mi.clinicalTrialsEntity = :ctEtntity", CtMedInstInvestigatorEntity.class)
                    .setParameter("ctEtntity", clinicalTrialsEntity).getResultList();
            Set<CtMedInstInvestigatorEntity> ctMedInstInvestigatorsSet = new HashSet(ctMedInstInvestigatorsList);
            List<CtAmendMedInstInvestigatorEntity> ctAmendMedInstInvestigatorsList = em.createQuery("select mi from CtAmendMedInstInvestigatorEntity mi where mi.clinicalTrialsAmendEntity = :ctAmendEtntity", CtAmendMedInstInvestigatorEntity.class)
                    .setParameter("ctAmendEtntity", clinicTrialAmendEntity).getResultList();
            Set<CtAmendMedInstInvestigatorEntity> ctAmendMedInstInvestigatorsSet = new HashSet<>(ctAmendMedInstInvestigatorsList);
            ClinicTrialAmendEntity persistedEntity = em.createQuery("select ctAm from ClinicTrialAmendEntity ctAm where ctAm.id = :id", ClinicTrialAmendEntity.class).setParameter("id", clinicTrialAmendEntity.getId()).getSingleResult();
            List<CtAmendMedInstInvestigatorEntity> amendmentMedInstInvestResult = handelMediclInstitutions(ctAmendMedInstInvestigatorsSet, ctMedInstInvestigatorsSet, persistedEntity);

            Optional<CtAmendMedInstInvestigatorEntity> dasgsgas = amendmentMedInstInvestResult.stream().filter(medInst -> 'N' == medInst.getEmbededId().getStatus() || 'R' == medInst.getEmbededId().getStatus()).findAny();
            boolean isMedInstModified = amendmentMedInstInvestResult.stream().filter(medInst -> 'N' == medInst.getEmbededId().getStatus() || 'R' == medInst.getEmbededId().getStatus()).findAny().isPresent();
            if (!isMedInstModified) {
                for (CtAmendMedInstInvestigatorEntity entity : amendmentMedInstInvestResult) {
                    entity.getEmbededId().setStatus('U');
                    em.merge(entity);
                }
            } else {
                ClinicalTrialsEntity persistentClinicalTrialsEntity =
                        em.createQuery("select ct from ClinicalTrialsEntity ct where ct.id = :id", ClinicalTrialsEntity.class).setParameter("id", clinicalTrialsEntity.getId()).getSingleResult();
                for (CtAmendMedInstInvestigatorEntity entity : ctAmendMedInstInvestigatorsSet) {
                    em.remove(entity);
                }
                for (CtMedInstInvestigatorEntity entity : ctMedInstInvestigatorsList) {
                    em.remove(entity);
                }

                for (CtAmendMedInstInvestigatorEntity entity : amendmentMedInstInvestResult) {
                    if (entity.getEmbededId().getStatus() == 'N') {
                        CtMedInstInvestigatorEntity newMedInstInvestigator = new CtMedInstInvestigatorEntity(clinicalTrialsEntity.getId(), entity.getMedicalInstitutionsEntity().getId(), entity.getInvestigatorsEntity().getId(), entity.getMainInvestigator());
                        newMedInstInvestigator.setClinicalTrialsEntity(persistentClinicalTrialsEntity);
                        newMedInstInvestigator.setMedicalInstitutionsEntity(entity.getMedicalInstitutionsEntity());
                        newMedInstInvestigator.setInvestigatorsEntity(entity.getInvestigatorsEntity());
                        em.persist(newMedInstInvestigator);
                    }
                    em.persist(entity);
                }
            }

            //Modify clinicalTrialEntity
            clinicalTrialsEntity.setPhase(clinicTrialAmendEntity.getPhaseTo());
            clinicalTrialsEntity.setTreatment(clinicTrialAmendEntity.getTreatmentTo());
            clinicalTrialsEntity.setProvenance(clinicTrialAmendEntity.getProvenanceTo());
            clinicalTrialsEntity.setEudraCtNr(clinicTrialAmendEntity.getEudraCtNrTo());
            clinicalTrialsEntity.setCode(clinicTrialAmendEntity.getCodeTo());
            clinicalTrialsEntity.setTitle(clinicTrialAmendEntity.getTitleTo());
            clinicalTrialsEntity.setSponsor(clinicTrialAmendEntity.getSponsorTo());
            clinicalTrialsEntity.setTrialPopNat(clinicTrialAmendEntity.getTrialPopNatTo());
            clinicalTrialsEntity.setTrialPopInternat(clinicTrialAmendEntity.getTrialPopInternatTo());

            populateMediacaments(clinicalTrialsEntity.getMedicament(), clinicTrialAmendEntity.getMedicament());
            populateMediacaments(clinicalTrialsEntity.getReferenceProduct(), clinicTrialAmendEntity.getReferenceProduct());
            populateMediacaments(clinicalTrialsEntity.getPlacebo(), clinicTrialAmendEntity.getPlacebo());


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

    private void populateMediacaments(ImportMedNotRegisteredEntity importMed, CtMedAmendEntity amendmentMed) {
        importMed.setName(amendmentMed.getNameTo());
        importMed.setManufacture(amendmentMed.getManufactureTo());
        importMed.setDose(amendmentMed.getDoseTo());
        importMed.setVolumeQuantityMeasurement(amendmentMed.getVolumeQuantityMeasurementTo());
        importMed.setPharmaceuticalForm(amendmentMed.getPharmFormTo());
        importMed.setAtcCode(amendmentMed.getAtcCodeTo());
        importMed.setAdministratingMode(amendmentMed.getAdministModeTo());
        populateMedActiveSubstances(importMed, amendmentMed.getActiveSubstances());
    }

    private void populateMedActiveSubstances(ImportMedNotRegisteredEntity importMed, Set<CtMedAmendActiveSubstEntity> medAmentdActSubst) {
        for (CtMedAmendActiveSubstEntity entity : medAmentdActSubst) {
            if (entity.getStatus().equals('N') || entity.getStatus().equals('R')) {
                importMed.getActiveSubstances().clear();
                break;
            }
        }

        medAmentdActSubst.forEach(amendEntity -> {
            if (amendEntity.getStatus().equals('N') || amendEntity.getStatus().equals('U')) {
                NotRegMedActiveSubstEntity medActiveSubst = new NotRegMedActiveSubstEntity();
                medActiveSubst.setActiveSubstance(amendEntity.getActiveSubstance());
                medActiveSubst.setQuantity(amendEntity.getQuantity());
                medActiveSubst.setUnitsOfMeasurement(amendEntity.getUnitsOfMeasurement());
                medActiveSubst.setManufacture(amendEntity.getManufacture());
                importMed.getActiveSubstances().add(medActiveSubst);
            }
        });
    }

    private List<CtAmendMedInstInvestigatorEntity> handelMediclInstitutions(Set<CtAmendMedInstInvestigatorEntity> set1, Set<CtMedInstInvestigatorEntity> set2, ClinicTrialAmendEntity ctAmendment) {
        List<CtAmendMedInstInvestigatorEntity> transformedMedInst = new ArrayList<>();
        if (!medicalInstitutionsSetsEquals(set1, set2)) {
            set2.forEach(cteMedInst -> {
                CtAmendMedInstInvestigatorEntity amendEntity = new CtAmendMedInstInvestigatorEntity(ctAmendment, cteMedInst.getMedicalInstitutionsEntity(), cteMedInst.getInvestigatorsEntity(), 'R', cteMedInst.getMainInvestigator());
                transformedMedInst.add(amendEntity);
            });

            set1.forEach(cteMedInst -> {
                CtAmendMedInstInvestigatorEntity amendEntity = new CtAmendMedInstInvestigatorEntity(ctAmendment, cteMedInst.getMedicalInstitutionsEntity(), cteMedInst.getInvestigatorsEntity(), 'N', cteMedInst.getMainInvestigator());
                transformedMedInst.add(amendEntity);
            });

            return transformedMedInst;
        }

        set1.forEach(cteMedInst -> {
            cteMedInst.getEmbededId().setStatus('U');
            transformedMedInst.add(cteMedInst);
        });

        return transformedMedInst;
    }

    private static boolean medicalInstitutionsSetsEquals(Set<CtAmendMedInstInvestigatorEntity> set1, Set<CtMedInstInvestigatorEntity> set2) {
        if (set1 == null || set2 == null) {
            return false;
        }
        if (set1.size() != set2.size()) {
            return false;
        }


        int equalEntity = 0;
        for (CtAmendMedInstInvestigatorEntity item1 : set1) {
            for (CtMedInstInvestigatorEntity item2 : set2) {
                if (item1.meaningfulyEquals(item2)) {
                    equalEntity++;
                }
            }
        }

        return set1.size() == equalEntity;
    }

    private Set<CtMedAmendActiveSubstEntity> handleActiveSubstances(Set<CtMedAmendActiveSubstEntity> amendMedActSubst, Set<NotRegMedActiveSubstEntity> cteMedActSubst, Integer amendmentMedId) {
        if (!activeSubstSetsEquals(amendMedActSubst, cteMedActSubst)) {
            Set<CtMedAmendActiveSubstEntity> transformedActiveSubstances = new HashSet<>();

            cteMedActSubst.forEach(cteMedEntity -> {
                CtMedAmendActiveSubstEntity amendEntity = new CtMedAmendActiveSubstEntity();
                amendEntity.asign(cteMedEntity);
                amendEntity.setCtMedAmendId(amendmentMedId);
                transformedActiveSubstances.add(amendEntity);
            });

            Set<CtMedAmendActiveSubstEntity> unmodifiedSubstances = new HashSet<>(amendMedActSubst);
            unmodifiedSubstances.retainAll(transformedActiveSubstances);
            unmodifiedSubstances.forEach(entity -> {
                entity.setStatus('U');
            });

            Set<CtMedAmendActiveSubstEntity> newSubstances = new HashSet<>(amendMedActSubst);
            newSubstances.removeAll(transformedActiveSubstances);
            newSubstances.forEach(entity -> {
                entity.setStatus('N');
            });

            Set<CtMedAmendActiveSubstEntity> removedSubstances = new HashSet<>(transformedActiveSubstances);
            removedSubstances.removeAll(amendMedActSubst);
            removedSubstances.forEach(entity -> {
                entity.setStatus('R');
            });

            //consolidating actSubstances per medicament
            unmodifiedSubstances.addAll(newSubstances);
            unmodifiedSubstances.addAll(removedSubstances);
            return unmodifiedSubstances;
        }

        return amendMedActSubst;
    }

    private static boolean activeSubstSetsEquals(Set<CtMedAmendActiveSubstEntity> set1, Set<NotRegMedActiveSubstEntity> set2) {
        if (set1 == null || set2 == null) {
            return false;
        }
        if (set1.size() != set2.size()) {
            return false;
        }

        for (CtMedAmendActiveSubstEntity item1 : set1) {
            for (NotRegMedActiveSubstEntity item2 : set2) {
                if (!item1.meaningfulyEquals(item2)) {
                    return false;
                }
            }
        }

        return true;
    }

    private void handelMedicamentsFromAmendment(CtMedAmendEntity medcamentAmend, ImportMedNotRegisteredEntity importMed) {
        medcamentAmend.setNameFrom(importMed.getName());
        medcamentAmend.setManufactureFrom(importMed.getManufacture());
        medcamentAmend.setAdministModeFrom(importMed.getAdministratingMode());
        medcamentAmend.setAtcCodeFrom(importMed.getAtcCode());
        medcamentAmend.setPharmFormFrom(importMed.getPharmaceuticalForm());
        medcamentAmend.setDoseFrom(importMed.getDose());
    }

    public void registerNewClinicalTrailAmendment(RegistrationRequestsEntity requests) throws CustomException {

        EntityManager em = null;
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            ClinicalTrialsEntity clinicalTrialsEntity = em.find(ClinicalTrialsEntity.class, requests.getClinicalTrails().getId()); /*requests.getClinicalTrails()*/
            requests.setClinicalTrails(clinicalTrialsEntity);
            em.persist(requests);

            ClinicTrialAmendEntity clinicTrialAmendEntity = new ClinicTrialAmendEntity();
            clinicTrialAmendEntity.setRegistrationRequestId(requests.getId());
            clinicTrialAmendEntity.assignTo(clinicalTrialsEntity);
            clinicTrialAmendEntity.setStatus("P");
            em.persist(clinicTrialAmendEntity);

            //medicaments
            CtMedAmendEntity medcament = new CtMedAmendEntity();
            medcament.asign(clinicalTrialsEntity.getMedicament());
            clinicTrialAmendEntity.setMedicament(medcament);
            em.persist(medcament);

            CtMedAmendEntity referenceProd = new CtMedAmendEntity();
            referenceProd.asign(clinicalTrialsEntity.getReferenceProduct());
            clinicTrialAmendEntity.setReferenceProduct(referenceProd);
            em.persist(referenceProd);

            CtMedAmendEntity placebo = new CtMedAmendEntity();
            placebo.asign(clinicalTrialsEntity.getPlacebo());
            clinicTrialAmendEntity.setPlacebo(placebo);
            em.persist(placebo);

            //active substances
            persistActiveSubstances(em, clinicalTrialsEntity.getMedicament().getActiveSubstances(), medcament);
            persistActiveSubstances(em, clinicalTrialsEntity.getReferenceProduct().getActiveSubstances(), referenceProd);


            //populate ct amendments list
            clinicalTrialsEntity.getClinicTrialAmendEntities().add(clinicTrialAmendEntity);

            //medInstitutions && investigators
            Set<CtMedInstInvestigatorEntity> requestTypesStepEntityList2 = medINstInvestigatorRepository.findCtMedInstInvestigatorById(clinicalTrialsEntity.getId());
            Set<CtAmendMedInstInvestigatorEntity> ctAmendMedInstInvestigatorRepositories = new HashSet<>();
            for (CtMedInstInvestigatorEntity ctMedInstInvestigatorEntity : requestTypesStepEntityList2) {
                //Integer ctAmendId = clinicTrialAmendEntity.getId();
                CtMedicalInstitutionEntity ctMedInst = ctMedInstInvestigatorEntity.getMedicalInstitutionsEntity();
                CtInvestigatorEntity ctInvestigator = ctMedInstInvestigatorEntity.getInvestigatorsEntity();
                Boolean mainInverstig = ctMedInstInvestigatorEntity.getMainInvestigator();
                CtAmendMedInstInvestigatorEntity medInstInvestigator = new CtAmendMedInstInvestigatorEntity(clinicTrialAmendEntity, ctMedInst, ctInvestigator, 'U', mainInverstig);
                em.merge(medInstInvestigator);
                ctAmendMedInstInvestigatorRepositories.add(medInstInvestigator);
            }


            em.getTransaction().commit();


            ClinicTrialAmendEntity entity = clinicTrialAmendRepository.findByRegistrationRequestId(requests.getId());
            System.out.println();


//            clinicalTrialsEntity.getClinicTrialAmendEntities().add(clinicTrialAmendEntity);

//            em.getTransaction().commit();
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally {
            em.close();
        }
    }

    private void persistActiveSubstances(EntityManager em, Set<NotRegMedActiveSubstEntity> activeSubst, CtMedAmendEntity med) {
        for (NotRegMedActiveSubstEntity entity : activeSubst) {
            CtMedAmendActiveSubstEntity ctMedAmendActiveSubstEntity = new CtMedAmendActiveSubstEntity();
            ctMedAmendActiveSubstEntity.asign(entity);
            ctMedAmendActiveSubstEntity.setCtMedAmendId(med.getId());
            ctMedAmendActiveSubstEntity.setStatus('U');
            em.persist(ctMedAmendActiveSubstEntity);
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
        requests.getClinicalTrails().getMedicalInstitutions().forEach(medInst -> {
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

    public void handeMedicalInstitutionsForAmendments(RegistrationRequestsEntity requests) throws CustomException {
        ClinicTrialAmendEntity clinicTrialAmendEntity = requests.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(entity ->
                entity.getRegistrationRequestId().equals(requests.getId())
        ).findFirst().orElse(null);

        Set<CtAmendMedInstInvestigatorEntity> requestTypesStepEntityList2 = ctAmendMedInstInvestigatorRepository.findCtMedInstInvestigatorById(clinicTrialAmendEntity.getId());

        Set<CtAmendMedInstInvestigatorEntity> ctMedInstInvestigatorEntities = new HashSet<>();
        clinicTrialAmendEntity.getMedicalInstitutions().forEach(medInst -> {
            medInst.getInvestigators().forEach(investig -> {
                CtAmendMedInstInvestigatorEntity entity = new CtAmendMedInstInvestigatorEntity(requests.getClinicalTrails().getId(), medInst.getId(), investig.getId(), Boolean.TRUE, 'U');
                entity.setInvestigatorsEntity(investig);
                entity.setMedicalInstitutionsEntity(medInst);
                entity.setClinicalTrialsAmendEntity(clinicTrialAmendEntity);
                entity.setMainInvestigator(investig.getMain());
                ctMedInstInvestigatorEntities.add(entity);
            });
        });

        ctAmendMedInstInvestigatorRepository.deleteAll(requestTypesStepEntityList2);
        ctAmendMedInstInvestigatorRepository.saveAll(ctMedInstInvestigatorEntities);
    }

    public void getCtMedInstInvestigator(RegistrationRequestsEntity requests) {
        ClinicalTrialsEntity ct = requests.getClinicalTrails();
        Set<CtMedicalInstitutionEntity> medInstitutions = ct.getMedicalInstitutions();

        Set<CtMedInstInvestigatorEntity> ctMedInstInvestigatorEntitiesOld = medINstInvestigatorRepository.findCtMedInstInvestigatorById(ct.getId());

        Set<CtMedicalInstitutionEntity> ctMedicalInstitutionEntities = new HashSet<>();

        ctMedInstInvestigatorEntitiesOld.forEach(ctMedInstInvestigatorEntity -> {
            CtMedicalInstitutionEntity medInst = ctMedInstInvestigatorEntity.getMedicalInstitutionsEntity();
            CtInvestigatorEntity ctInvestigatorEntity = ctMedInstInvestigatorEntity.getInvestigatorsEntity();
            ctInvestigatorEntity.setMain(ctMedInstInvestigatorEntity.getMainInvestigator());

            medInst.getInvestigators().add(ctInvestigatorEntity);
            ctMedicalInstitutionEntities.add(medInst);

        });
        ct.setMedicalInstitutions(ctMedicalInstitutionEntities);
    }

    public void addDDClinicalTrailsDocument(@RequestBody RegistrationRequestsEntity request) {
        Optional<RegistrationRequestStepsEntity> requestTypesStepEntityList = registrationRequestStepRepository.findOneByRequestTypeIdAndCode(request.getType().getId(), request.getCurrentStep());
        if (requestTypesStepEntityList.isPresent()) {
            RegistrationRequestStepsEntity entity = requestTypesStepEntityList.get();
            request.setOutputDocuments(new HashSet<>());

            String[] docTypes = entity.getOutputDocTypes() == null ? new String[0] : entity.getOutputDocTypes().split(",");

            for (String docType : docTypes) {
                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(docType);
                if (nmDocumentTypeEntity.isPresent()) {
                    OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
                    outputDocumentsEntity.setDocType(nmDocumentTypeEntity.get());
                    outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
                    outputDocumentsEntity.setName(nmDocumentTypeEntity.get().getDescription());
                    outputDocumentsEntity.setNumber(docType + "-" + request.getRequestNumber());
                    request.getOutputDocuments().add(outputDocumentsEntity);
                }
            }
        }
    }

    public void registerNewClinicalTrailNotification(RegistrationRequestsEntity requests) throws CustomException {

        EntityManager em = null;
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            ClinicalTrialsEntity clinicalTrialsEntity = em.find(ClinicalTrialsEntity.class, requests.getClinicalTrails().getId()); /*requests.getClinicalTrails()*/
            requests.setClinicalTrails(clinicalTrialsEntity);
            em.persist(requests);

            ClinicTrailNotificationEntity clinicTrailNotificationEntity = new ClinicTrailNotificationEntity();
            clinicTrailNotificationEntity.setClinicalTrialsEntityId(clinicalTrialsEntity.getId());
            clinicTrailNotificationEntity.setRegistrationRequestId(requests.getId());
            clinicTrailNotificationEntity.setStatus("P");

            clinicalTrialsEntity.getClinicTrialNotificationEntities().add(clinicTrailNotificationEntity);

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

}
