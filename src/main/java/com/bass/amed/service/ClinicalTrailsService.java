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

    private static final String EXCEEDED = " este depasita.";
    private static final String METHOD_NAME_WAIT_PAYMENT = "/wait-payment-order-issue-ct";
    private static final String METHOD_NAME_WAIT_CLIENT_DETAILS = "/wait-client-details-data-ct";
    private static final String METHOD_NAME_LIMIET_FINISH_CT = "/limit-finish-ct";
    private static final String METHOD_NAME_WAIT_PAYMENT_AMEND = "/wait-payment-order-issue-amend-ct";
    private static final String METHOD_NAME_WAIT_CLIENT_DETAILS_AMEND = "/wait-client-details-data-amend-ct";
    private static final String METHOD_NAME_LIMIET_FINISH_CT_AMEND = "/limit-finish-amendment-ct";

    public void schedulePayOrderCT(int reqId, String reqNumber) {
        String mailBody = "Evaluarea primara pentru cerere nr: " + reqNumber + EXCEEDED;
        /*ResponseEntity<ScheduledModuleResponse> result =*/ jobSchedulerComponent.jobSchedule(5, METHOD_NAME_WAIT_PAYMENT, METHOD_NAME_WAIT_PAYMENT, reqId, reqNumber, null, mailBody);
    }

    public void unschedulePayOrderCT(int reqId) {
        jobSchedulerComponent.jobUnschedule(METHOD_NAME_WAIT_PAYMENT, reqId);
    }

    public void scheduleClientDetailsDataCT(int reqId, String reqNumber) {
        String mailBody = "Astepatrea dosarului pentru cerere nr: " + reqNumber + EXCEEDED;
        /*ResponseEntity<ScheduledModuleResponse> result =*/ jobSchedulerComponent.jobSchedule(60, METHOD_NAME_WAIT_CLIENT_DETAILS, METHOD_NAME_WAIT_CLIENT_DETAILS, reqId, reqNumber, null, mailBody);
    }

    public void unscheduleClientDetailsDataCT(int reqId) {
        jobSchedulerComponent.jobUnschedule(METHOD_NAME_WAIT_CLIENT_DETAILS, reqId);
    }

    public void scheduleFinisLimitCT(int reqId, String reqNumber) {
        String mailBody = "Termen limita pentru inregistrare studiului clinic cu cerere nr: " + reqNumber + EXCEEDED;
        /*ResponseEntity<ScheduledModuleResponse> result = */ jobSchedulerComponent.jobSchedule(30, METHOD_NAME_LIMIET_FINISH_CT, METHOD_NAME_LIMIET_FINISH_CT, reqId, reqNumber, null, mailBody);
    }

    public void unscheduleFinisLimitCT(int reqId) {
        jobSchedulerComponent.jobUnschedule(METHOD_NAME_LIMIET_FINISH_CT, reqId);
    }

    public void schedulePayOrderAmendCT(int reqId, String reqNumber) {
        String mailBody = "Evaluarea primara pentru cerere nr: " + reqNumber + EXCEEDED;
        /*ResponseEntity<ScheduledModuleResponse> result = */jobSchedulerComponent.jobSchedule(10, METHOD_NAME_WAIT_PAYMENT_AMEND, METHOD_NAME_WAIT_PAYMENT_AMEND, reqId, reqNumber, null, mailBody);
    }

    public void unschedulePayOrderAmendCT(int reqId) {
        jobSchedulerComponent.jobUnschedule(METHOD_NAME_WAIT_PAYMENT_AMEND, reqId);
    }

    public void scheduleClientDetailsDataAmendCT(int reqId, String reqNumber) {
        String mailBody = "Astepatrea dosarului pentru cerere nr: " + reqNumber + EXCEEDED;
        /*ResponseEntity<ScheduledModuleResponse> result =*/ jobSchedulerComponent.jobSchedule(60, METHOD_NAME_WAIT_CLIENT_DETAILS_AMEND, METHOD_NAME_WAIT_CLIENT_DETAILS_AMEND, reqId, reqNumber, null, mailBody);
    }

    public void unscheduleClientDetailsDataAmendCT(int reqId) {
        jobSchedulerComponent.jobUnschedule(METHOD_NAME_WAIT_CLIENT_DETAILS_AMEND, reqId);
    }

    public void scheduleFinisLimitAmendmentCT(int reqId, String reqNumber) {
        String mailBody = "Termen limita pentru inregistrare amendamentului la studiului clinic cu cerere nr: " + reqNumber + EXCEEDED;
        /*ResponseEntity<ScheduledModuleResponse> result =*/ jobSchedulerComponent.jobSchedule(30, METHOD_NAME_LIMIET_FINISH_CT_AMEND, METHOD_NAME_LIMIET_FINISH_CT_AMEND, reqId, reqNumber, null, mailBody);
    }

    public void unscheduleFinisLimitAmendmentCT(int reqId) {
        jobSchedulerComponent.jobUnschedule(METHOD_NAME_LIMIET_FINISH_CT_AMEND, reqId);
    }

    public List<ClinicalTrialDTO> retrieveClinicalTrailsByFilter(ClinicalTrailFilterDTO filter) throws CustomException {
        StringBuilder queryString = new StringBuilder(
                "select ct.id, ct.code, ct.EudraCT_nr, ctt1.description as treatment, ctt2.description as provenance, ct.sponsor, ct.med_comission_nr as cometee,  ct.med_comission_date as cometeeDate "
                        .concat("FROM clinical_trials ct, clinical_trials_types ctt1, clinical_trials_types ctt2 ")
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

            ClinicalTrialsEntity clinicalTrialsEntity = requests.getClinicalTrails();
            ClinicTrialAmendEntity clinicTrialAmendEntity = clinicalTrialsEntity.getClinicTrialAmendEntities().stream().filter(entity ->
                    entity.getRegistrationRequestId().equals(requests.getId())
            ).findFirst().orElseThrow(() -> new CustomException("Clinical trial amendment was not found"));

            //Handle ClinicTrialAmendEntity
            clinicTrialAmendEntity.assignFrom(clinicalTrialsEntity);
            clinicTrialAmendEntity.setStatus("F");

            clinicalTrialsEntity.getMedicalInstitutions().clear();
            clinicalTrialsEntity.getMedicaments().clear();
            clinicalTrialsEntity.getReferenceProducts().clear();
            clinicalTrialsEntity.getPlacebos().clear();
            clinicalTrialsEntity.assign(clinicTrialAmendEntity);

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
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage(), e);
        } finally {
            if (em != null)
                em.close();
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
            if (em != null)
                em.close();
        }
    }

    public String getDocumentNumber() {
        ClinicalTrialCodeSequenceEntity ctSeqNr = new ClinicalTrialCodeSequenceEntity();
        ctSeqNumberRepository.save(ctSeqNr);
        return "Rg13-" + Utils.intToString(6, ctSeqNr.getId());
    }
}
