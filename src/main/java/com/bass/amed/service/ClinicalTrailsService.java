package com.bass.amed.service;

import com.bass.amed.JobSchedulerComponent;
import com.bass.amed.common.Constants;
import com.bass.amed.dto.ScheduledModuleResponse;
import com.bass.amed.dto.clinicaltrial.ClinicalTrailFilterDTO;
import com.bass.amed.dto.clinicaltrial.ClinicalTrialDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.utils.AuditUtils;
import com.bass.amed.utils.SecurityUtils;
import com.bass.amed.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    RegistrationRequestStepRepository registrationRequestStepRepository;
    @Autowired
    ClinicalTrialsRepository clinicalTrialsRepository;
    @Autowired
    ClinicTrialAmendRepository clinicTrialAmendRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private SrcUserRepository srcUserRepository;
    @Autowired
    private AuditCategoryRepository auditCategoryRepository;
    @Autowired
    private AuditSubcategoryRepository auditSubcategoryRepository;
    @Autowired
    CtSeqRegistrationRequestNumberRepository ctSeqNumberRepository;

    @Autowired
    private JobSchedulerComponent jobSchedulerComponent;

    public void schedulePayOrderCT(int reqId, String reqNumber) {
        String mailBody = "Evaluarea primara pentru cerere nr: " + reqNumber + " este depasita.";
        ResponseEntity<ScheduledModuleResponse> result = jobSchedulerComponent.jobSchedule(5, "/wait-payment-order-issue-ct", "/wait-payment-order-issue-ct", reqId, reqNumber, null, mailBody);
    }

    public void unschedulePayOrderCT(int reqId) {
        jobSchedulerComponent.jobUnschedule("/wait-payment-order-issue-ct", reqId);
    }

    public void scheduleClientDetailsDataCT(int reqId, String reqNumber) {
        String mailBody = "Astepatrea dosarului pentru cerere nr: " + reqNumber + " este depasita.";
        ResponseEntity<ScheduledModuleResponse> result = jobSchedulerComponent.jobSchedule(60, "/wait-client-details-data-ct", "/wait-client-details-data-ct", reqId, reqNumber, null, mailBody);
    }

    public void unscheduleClientDetailsDataCT(int reqId) {
        jobSchedulerComponent.jobUnschedule("/wait-client-details-data-ct", reqId);
    }

    public void scheduleFinisLimitCT(int reqId, String reqNumber) {
        String mailBody = "Termen limita pentru inregistrare studiului clinic cu cerere nr: " + reqNumber + " este depasita.";
        ResponseEntity<ScheduledModuleResponse> result = jobSchedulerComponent.jobSchedule(30, "/limit-finish-ct", "/limit-finish-ct", reqId, reqNumber, null, mailBody);
    }

    public void unscheduleFinisLimitCT(int reqId) {
        jobSchedulerComponent.jobUnschedule("/limit-finish-ct", reqId);
    }

    public void schedulePayOrderAmendCT(int reqId, String reqNumber) {
        String mailBody = "Evaluarea primara pentru cerere nr: " + reqNumber + " este depasita.";
        ResponseEntity<ScheduledModuleResponse> result = jobSchedulerComponent.jobSchedule(10, "/wait-payment-order-issue-amend-ct", "/wait-payment-order-issue-amend-ct", reqId, reqNumber, null, mailBody);
    }

    public void unschedulePayOrderAmendCT(int reqId) {
        jobSchedulerComponent.jobUnschedule("/wait-payment-order-issue-amend-ct", reqId);
    }

    public void scheduleClientDetailsDataAmendCT(int reqId, String reqNumber) {
        String mailBody = "Astepatrea dosarului pentru cerere nr: " + reqNumber + " este depasita.";
        ResponseEntity<ScheduledModuleResponse> result = jobSchedulerComponent.jobSchedule(60, "/wait-client-details-data-amend-ct", "/wait-client-details-data-amend-ct", reqId, reqNumber, null, mailBody);
    }

    public void unscheduleClientDetailsDataAmendCT(int reqId) {
        jobSchedulerComponent.jobUnschedule("/wait-client-details-data-amend-ct", reqId);
    }

    public void scheduleFinisLimitAmendmentCT(int reqId, String reqNumber) {
        String mailBody = "Termen limita pentru inregistrare amendamentului la studiului clinic cu cerere nr: " + reqNumber + " este depasita.";
        ResponseEntity<ScheduledModuleResponse> result = jobSchedulerComponent.jobSchedule(30, "/limit-finish-amendment-ct", "/limit-finish-amendment-ct", reqId, reqNumber, null, mailBody);
    }

    public void unscheduleFinisLimitAmendmentCT(int reqId) {
        jobSchedulerComponent.jobUnschedule("/limit-finish-amendment-ct", reqId);
    }

    public List<ClinicalTrialDTO> retrieveClinicalTrailsByFilter(ClinicalTrailFilterDTO filter) throws CustomException {
        StringBuilder queryString = new StringBuilder(
                "select ct.id, ct.code, ct.EudraCT_nr, ctt1.description as treatment, ctt2.description as provenance, ct.sponsor, ct.med_comission_nr as cometee,  ct.med_comission_date as cometeeDate "
                        .concat("FROM amed.clinical_trials ct, amed.clinical_trials_types ctt1, amed.clinical_trials_types ctt2 ")
                        .concat("where ct.status='F' and ct.treatment_id=ctt1.id and ct.provenance_id=ctt2.id")
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
            if (filter.getTreatmentId() != null) {
                queryString.append(" and ctt1.id = :treatmentId");
            }
            if (filter.getProvenanceId() != null) {
                queryString.append(" and ctt2.id = :provenanceId");
            }

            Query query = em.createNativeQuery(queryString.toString(), ClinicalTrialDTO.class);

            if (filter.getCode() != null && !filter.getCode().isEmpty()) {
                query.setParameter("code", filter.getCode());
            }
            if (filter.getEudraCtNr() != null && !filter.getEudraCtNr().isEmpty()) {
                query.setParameter("eudraCt", filter.getEudraCtNr());
            }
            if (filter.getTreatmentId() != null) {
                query.setParameter("treatmentId", filter.getTreatmentId());
            }
            if (filter.getProvenanceId() != null) {
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
            clinicalTrialsEntity.getMedicalInstitutions().forEach(medInst -> {
                CtAmendMedicalInstitutionEntity amendMedicalInstitutionEntity = new CtAmendMedicalInstitutionEntity();
                amendMedicalInstitutionEntity.asign(medInst, false);
                clinicTrialAmendEntity.getMedicalInstitutions().add(amendMedicalInstitutionEntity);
            });

            clinicalTrialsEntity.getMedicalInstitutions().clear();
            clinicTrialAmendEntity.getMedicalInstitutions().forEach(amdmMedInst -> {
                if (amdmMedInst.getIsNew()) {
                    CtMedicalInstitutionEntity ctMedicalInstitutionEntity = new CtMedicalInstitutionEntity();
                    ctMedicalInstitutionEntity.asign(amdmMedInst);
                    clinicalTrialsEntity.getMedicalInstitutions().add(ctMedicalInstitutionEntity);
                }
            });

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

            List<AuditLogEntity> dummyEntities = AuditUtils.auditClinicatTrialAmendmentRegistration(requests);
            for (AuditLogEntity persistEntity : dummyEntities) {
                persistEntity.setDateTime(new Timestamp(new Date().getTime()));
                ScrUserEntity userEntity = srcUserRepository.findOneWithAuthoritiesByUsername(SecurityUtils.getCurrentUser().orElse(null)).orElse(null);
                persistEntity.setUser(userEntity);
                if (persistEntity.getCategoryName() != null) {
                    persistEntity.setCategory(auditCategoryRepository.findByName(persistEntity.getCategoryName()).orElse(null));
                }

                if (persistEntity.getSubCategoryName() != null) {
                    persistEntity.setSubcategory(auditSubcategoryRepository.findByName(persistEntity.getSubCategoryName()).orElse(null));
                }
                em.persist(persistEntity);
            }

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
            //If active substance modified cleare from Clinical trail med.
            if (entity.getStatus().equals('N') || entity.getStatus().equals('R')) {
                importMed.getActiveSubstances().clear();
                break;
            }
        }
        //Fill Clinical trail med with 'N' - New instances
        medAmentdActSubst.forEach(amendEntity -> {
            if (amendEntity.getStatus().equals('N') /*|| amendEntity.getStatus().equals('U')*/) {
                NotRegMedActiveSubstEntity medActiveSubst = new NotRegMedActiveSubstEntity();
                medActiveSubst.setActiveSubstance(amendEntity.getActiveSubstance());
                medActiveSubst.setQuantity(amendEntity.getQuantity());
                medActiveSubst.setUnitsOfMeasurement(amendEntity.getUnitsOfMeasurement());
                medActiveSubst.setManufacture(amendEntity.getManufacture());
                importMed.getActiveSubstances().add(medActiveSubst);
            }
        });
    }

    private Set<CtMedAmendActiveSubstEntity> handleActiveSubstances(Set<CtMedAmendActiveSubstEntity> amendMedActSubst, Set<NotRegMedActiveSubstEntity> cteMedActSubst, Integer amendmentMedId) {
        if (!activeSubstSetsEquals(amendMedActSubst, cteMedActSubst)) {
            List<CtMedAmendActiveSubstEntity> transformedActiveSubstances = new ArrayList<>();

            cteMedActSubst.forEach(cteMedEntity -> {
                CtMedAmendActiveSubstEntity amendEntity = new CtMedAmendActiveSubstEntity();
                amendEntity.asign(cteMedEntity);
                amendEntity.setCtMedAmendId(amendmentMedId);
                transformedActiveSubstances.add(amendEntity);
            });

            List<CtMedAmendActiveSubstEntity> unmodifiedSubstances = new ArrayList<>(amendMedActSubst);
            unmodifiedSubstances.retainAll(transformedActiveSubstances);
            unmodifiedSubstances.forEach(entity -> {
                entity.setStatus('U');
            });

            List<CtMedAmendActiveSubstEntity> newSubstances = new ArrayList<>(amendMedActSubst);
            newSubstances.removeAll(transformedActiveSubstances);
            newSubstances.forEach(entity -> {
                entity.setStatus('N');
            });

            List<CtMedAmendActiveSubstEntity> removedSubstances = new ArrayList<>(transformedActiveSubstances);
            removedSubstances.removeAll(amendMedActSubst);
            removedSubstances.forEach(entity -> {
                entity.setStatus('R');
            });

            //consolidating actSubstances per medicament
            unmodifiedSubstances.addAll(newSubstances);
            unmodifiedSubstances.addAll(removedSubstances);
//            return new HashSet<>();
            return new HashSet<>(unmodifiedSubstances);
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

            //medInstitutions
            clinicalTrialsEntity.getMedicalInstitutions().forEach(medInst -> {
                CtAmendMedicalInstitutionEntity amendMedicalInstitutionEntity = new CtAmendMedicalInstitutionEntity();
                amendMedicalInstitutionEntity.asign(medInst, true);
                clinicTrialAmendEntity.getMedicalInstitutions().add(amendMedicalInstitutionEntity);
            });

            //populate ct amendments list
            clinicalTrialsEntity.getClinicTrialAmendEntities().add(clinicTrialAmendEntity);

            //set scheduler
            if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.EVALUATE)) {
                schedulePayOrderAmendCT(requests.getId(), requests.getRequestNumber());
            } else if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.ANALIZE)) {
                unschedulePayOrderAmendCT(requests.getId());
                scheduleClientDetailsDataAmendCT(requests.getId(), requests.getRequestNumber());
            } else if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.FINISH)) {
                unscheduleFinisLimitAmendmentCT(requests.getId());
            } else if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.CANCEL)) {
                unscheduleFinisLimitAmendmentCT(requests.getId());
            }

            em.getTransaction().commit();

//            ClinicTrialAmendEntity entity = clinicTrialAmendRepository.findByRegistrationRequestId(requests.getId());
//            System.out.println();
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

    public void addDDClinicalTrailsDocument(@RequestBody RegistrationRequestsEntity request) {
        Optional<RegistrationRequestStepsEntity> requestTypesStepEntityList = registrationRequestStepRepository.findOneByRequestTypeIdAndCode(request.getType().getId(), request.getCurrentStep());
        if (requestTypesStepEntityList.isPresent()) {
            RegistrationRequestStepsEntity entity = requestTypesStepEntityList.get();
            request.setOutputDocuments(new HashSet<>());

            String[] docTypes = entity.getOutputDocTypes() == null ? new String[0] : entity.getOutputDocTypes().split(",");

            for (String docType : docTypes) {
                if (docType.equals("SL")) {
                    continue;
                }
                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(docType);
                if (nmDocumentTypeEntity.isPresent()) {
                    OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
                    outputDocumentsEntity.setDocType(nmDocumentTypeEntity.get());
                    outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
                    outputDocumentsEntity.setName(nmDocumentTypeEntity.get().getDescription());
                    outputDocumentsEntity.setNumber(docType + "-" + request.getRequestNumber());
                    request.getOutputDocuments().add(outputDocumentsEntity);
                    System.out.println();
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

    public String getDocumentNumber() {
        ClinicalTrialCodeSequenceEntity ctSeqNr = new ClinicalTrialCodeSequenceEntity();
        ctSeqNumberRepository.save(ctSeqNr);
        return "Rg13-" + Utils.intToString(6, ctSeqNr.getId());
    }
}
