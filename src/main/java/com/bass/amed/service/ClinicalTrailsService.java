package com.bass.amed.service;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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

    public void registerNewClinicalTrailAmendment(RegistrationRequestsEntity requests) throws CustomException {

        EntityManager em = null;
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            ClinicalTrialsEntity clinicalTrialsEntity = em.find(ClinicalTrialsEntity.class, requests.getClinicalTrails().getId()); /*requests.getClinicalTrails()*/;
            requests.setClinicalTrails(clinicalTrialsEntity);
            em.persist(requests);

            ClinicTrialAmendEntity clinicTrialAmendEntity = new ClinicTrialAmendEntity();
            clinicTrialAmendEntity.setRegistrationRequestId(requests.getId());
            clinicTrialAmendEntity.assign(clinicalTrialsEntity);
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
            clinicTrialAmendEntity.setPlacebo(referenceProd);
            em.persist(placebo);

            //active substances
            persistActiveSubstances(em,clinicalTrialsEntity.getMedicament().getActiveSubstances(),medcament);
            persistActiveSubstances(em,clinicalTrialsEntity.getReferenceProduct().getActiveSubstances(),referenceProd);



            //populate ct amendments list
            clinicalTrialsEntity.getClinicTrialAmendEntities().add(clinicTrialAmendEntity);

            //medInstitutions && investigators
            Set<CtMedInstInvestigatorEntity> requestTypesStepEntityList2 = medINstInvestigatorRepository.findCtMedInstInvestigatorById(clinicalTrialsEntity.getId());
            Set<CtAmendMedInstInvestigatorEntity> ctAmendMedInstInvestigatorRepositories = new HashSet<>();
            for(CtMedInstInvestigatorEntity ctMedInstInvestigatorEntity :  requestTypesStepEntityList2){
                //Integer ctAmendId = clinicTrialAmendEntity.getId();
                CtMedicalInstitutionEntity ctMedInst = ctMedInstInvestigatorEntity.getMedicalInstitutionsEntity();
                CtInvestigatorEntity ctInvestigator = ctMedInstInvestigatorEntity.getInvestigatorsEntity();
                Boolean mainInverstig = ctMedInstInvestigatorEntity.getMainInvestigator();
                CtAmendMedInstInvestigatorEntity medInstInvestigator = new CtAmendMedInstInvestigatorEntity(clinicTrialAmendEntity, ctMedInst, ctInvestigator,  mainInverstig);
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

    private void persistActiveSubstances(EntityManager em, Set<NotRegMedActiveSubstEntity> activeSubst, CtMedAmendEntity med){
        for(NotRegMedActiveSubstEntity entity : activeSubst){
            CtMedAmendActiveSubstEntity ctMedAmendActiveSubstEntity = new CtMedAmendActiveSubstEntity();
            ctMedAmendActiveSubstEntity.asign(entity);
            ctMedAmendActiveSubstEntity.setCtAmendmentId(med.getId());
            med.getActiveSubstances().add(ctMedAmendActiveSubstEntity);
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

//    public void handeMedicalInstitutionsForAmendments(RegistrationRequestsEntity requests) throws CustomException {
//        Set<CtAmendMedInstInvestigatorEntity> requestTypesStepEntityList2 = ctAmendMedInstInvestigatorRepository.findCtMedInstInvestigatorById(requests.getClinicalTrails().getId());
//
//        Set<CtAmendMedInstInvestigatorEntity> ctMedInstInvestigatorEntities = new HashSet<>();
//        requests.getClinicalTrails().getMedicalInstitutions().forEach(medInst ->{
//            medInst.getInvestigators().forEach(investig -> {
//                CtMedInstInvestigatorEntity entity = new CtMedInstInvestigatorEntity(requests.getClinicalTrails().getId(), medInst.getId(), investig.getId(), Boolean.TRUE);
//                entity.setInvestigatorsEntity(investig);
//                entity.setMedicalInstitutionsEntity(medInst);
//                entity.setClinicalTrialsEntity(requests.getClinicalTrails());
//                entity.setMainInvestigator(investig.getMain());
//                ctMedInstInvestigatorEntities.add(entity);
//            });
//        });
//
//        medINstInvestigatorRepository.deleteAll(requestTypesStepEntityList2);
//        medINstInvestigatorRepository.saveAll(ctMedInstInvestigatorEntities);
//    }

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
}
