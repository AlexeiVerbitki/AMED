package com.bass.amed.controller.rest.clinicaltrails;

import com.bass.amed.dto.clinicaltrial.ClinicalTrailFilterDTO;
import com.bass.amed.dto.clinicaltrial.ClinicalTrialDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.ClinicalTrailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/clinical-trails")
public class ClinicalTrailsController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ClinicalTrailsController.class);
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private ClinicalTrailsService clinicalTrailsService;
    @Autowired
    ClinicalTrialsRepository clinicalTrialsRepository;
    @Autowired
    ClinicTrialAmendRepository clinicTrialAmendRepository;
    @Autowired
    CtAmendMedInstInvestigatorRepository ctAmendMedInstInvestigatorRepository;
    @Autowired
    ClinicalTrailNotificationTypeRepository clinicalTrailNotificationTypeRepository;

    @PostMapping(value = "/save-request")
    public ResponseEntity<Integer> saveClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {

        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }
        clinicalTrailsService.handeMedicalInstitutions(requests);

        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @PostMapping(value = "/add-request")
    public ResponseEntity<Integer> saveNextClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }
//        clinicalTrailsService.addDDClinicalTrailsDocument(requests);
        clinicalTrailsService.handeMedicalInstitutions(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/load-request")
    public ResponseEntity<RegistrationRequestsEntity> getRegistrationRequestsById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findClinicalTrailstRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }

        RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
        clinicalTrailsService.getCtMedInstInvestigator(registrationRequestsEntity);

        return new ResponseEntity<>(registrationRequestsEntity, HttpStatus.OK);
    }

    @PostMapping(value = "/add-amendment-request")
    public ResponseEntity<Integer> seveNetxtClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        clinicalTrailsService.registerNewClinicalTrailAmendment(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/load-amendment-request")
    public ResponseEntity<RegistrationRequestsEntity> getClinicalTrailAmendmentById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findClinicalTrailstRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }

        RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();

        ClinicTrialAmendEntity clinicTrialAmendEntity = registrationRequestsEntity.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(entity ->
                entity.getRegistrationRequestId().equals(registrationRequestsEntity.getId())
        ).findFirst().orElse(null);

        if (clinicTrialAmendEntity != null) {
            Set<CtAmendMedInstInvestigatorEntity> requestTypesStepEntityList = ctAmendMedInstInvestigatorRepository.findCtMedInstInvestigatorById(clinicTrialAmendEntity.getId());

            requestTypesStepEntityList.forEach(medInstInvestigator -> {
                if ('U' == medInstInvestigator.getEmbededId().getStatus() || 'N' == medInstInvestigator.getEmbededId().getStatus()) {
                    CtMedicalInstitutionEntity medInst = medInstInvestigator.getMedicalInstitutionsEntity();
                    CtInvestigatorEntity ctInvestigatorEntity = new CtInvestigatorEntity();
                    ctInvestigatorEntity.asign(medInstInvestigator.getInvestigatorsEntity());
                    ctInvestigatorEntity.setMain(medInstInvestigator.getMainInvestigator());
                    medInst.getInvestigators().add(ctInvestigatorEntity);

                    clinicTrialAmendEntity.getMedicalInstitutionsTo().add(medInst);
                }
            });

            boolean isMedInstModified = requestTypesStepEntityList.stream().filter(medInst -> 'N' == medInst.getEmbededId().getStatus() || 'R' == medInst.getEmbededId().getStatus()).findAny().isPresent();
            List<CtMedicalInstitutionEntity> medicalInstitutionEntitiesList = new ArrayList<>();
            Map<CtMedicalInstitutionEntity, CtMedicalInstitutionEntity> medicalInstitutionEntitiesMap = new HashMap();
            if (isMedInstModified) {
                requestTypesStepEntityList.forEach(entity -> {
                    if (!medicalInstitutionEntitiesMap.containsKey(entity.getMedicalInstitutionsEntity()) && ('U' == entity.getEmbededId().getStatus() || 'R' == entity.getEmbededId().getStatus())) {
                        CtMedicalInstitutionEntity newMedInst = new CtMedicalInstitutionEntity();
                        newMedInst.asign(entity.getMedicalInstitutionsEntity());
                        medicalInstitutionEntitiesMap.put(entity.getMedicalInstitutionsEntity(), newMedInst);
                    }

                    if ('U' == entity.getEmbededId().getStatus() || 'R' == entity.getEmbededId().getStatus()) {
                        entity.getInvestigatorsEntity().setMain(entity.getMainInvestigator());
                        medicalInstitutionEntitiesMap.get(entity.getMedicalInstitutionsEntity()).getInvestigators().add(entity.getInvestigatorsEntity());
                    }
                });
                clinicTrialAmendEntity.getMedicalInstitutionsFrom().addAll(medicalInstitutionEntitiesMap.values());
            }

            System.out.println();
        }

        return new ResponseEntity<>(registrationRequestsEntity, HttpStatus.OK);
    }

    @PostMapping(value = "/finish-amendment-request")
    public ResponseEntity<Integer> finishClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        clinicalTrailsService.finishNewClinicalTrailAmendment(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.OK);
    }


    @Transactional
    @PostMapping(value = "/save-amendment-request")
    public ResponseEntity<Integer> saveClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }

//        ClinicTrialAmendEntity clinicTrialAmendEntity = requests.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(entity ->
//                entity.getRegistrationRequestId().equals(requests.getId())
//        ).findFirst().orElse(null);
        clinicalTrailsService.handeMedicalInstitutionsForAmendments(requests);

        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @PostMapping(value = "/add-amendment-next-reques")
    public ResponseEntity<Integer> saveNextClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }

//        clinicalTrailsService.addDDClinicalTrailsDocument(requests);
        clinicalTrailsService.handeMedicalInstitutionsForAmendments(requests);

//        ClinicTrialAmendEntity clinicTrialAmendEntity = requests.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(entity ->
//                entity.getRegistrationRequestId().equals(requests.getId())
//        ).findFirst().orElse(null);

        //clinicalTrailsService.handeMedicalInstitutions(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.OK);
    }

    @PostMapping(value = "/add-notification-request")
    public ResponseEntity<Integer> addNotificationRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }

        clinicalTrailsService.registerNewClinicalTrailNotification(requests);

        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @PostMapping(value = "/finish-notification-request")
    public ResponseEntity<Integer> finishClinicalTrailNotificationRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {

        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @RequestMapping("/all-clinical-trails-by-cod-or-eudra")
    public ResponseEntity<List<ClinicalTrialsEntity>> getClinicalTrailByCodeAndEudra(String partialCode) {
        LOGGER.debug("Retrieve clinical trails by code or eudra" + partialCode);
        List<ClinicalTrialsEntity> clinicalTrialsEntities = clinicalTrialsRepository.getClinicalTrailByCodeOrEudra(partialCode, partialCode);
        return new ResponseEntity<>(clinicalTrialsEntities, HttpStatus.OK);
    }

    @RequestMapping("/all-clinical-trail-notification-types")
    public ResponseEntity<List<ClinicTrailNotificationTypeEntity>> getAllNotificationTypes() {
        LOGGER.debug("Retrieve clinical trail notification types");
        List<ClinicTrailNotificationTypeEntity> clinicTrailNotificationTypeEntities = clinicalTrailNotificationTypeRepository.findAll();
        return new ResponseEntity<>(clinicTrailNotificationTypeEntities, HttpStatus.OK);
    }

    @RequestMapping("/get-filtered-clinical-trials")
    public ResponseEntity<List<ClinicalTrialDTO>> getClinicalTrailsByFilter(@RequestBody ClinicalTrailFilterDTO filter) throws CustomException {
        LOGGER.debug("Get clinical trails by filter: ", filter.toString());

        List<ClinicalTrialDTO> clinicalTrialsEntities = clinicalTrailsService.retrieveClinicalTrailsByFilter(filter);
        return new ResponseEntity<>(clinicalTrialsEntities, HttpStatus.OK);
    }

    @RequestMapping("/get-clinical-trial-id")
    public ResponseEntity<RegistrationRequestsEntity> getRegReqByClinicTrialId(@RequestParam("id") Integer id) throws CustomException {
        LOGGER.debug("Get registration request by clinical trial id: ", id.toString());

        Optional<RegistrationRequestsEntity> registrationRequestsEntity2 = requestRepository.findRegRequestByCtId(id);
        clinicalTrailsService.getCtMedInstInvestigator(registrationRequestsEntity2.get());

        return new ResponseEntity<>(registrationRequestsEntity2.get(), HttpStatus.OK);
    }


}
