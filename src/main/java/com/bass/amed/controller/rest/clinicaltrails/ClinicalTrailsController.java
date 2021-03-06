package com.bass.amed.controller.rest.clinicaltrails;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.clinicaltrial.ClinicalTrailFilterDTO;
import com.bass.amed.dto.clinicaltrial.ClinicalTrialDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.AuditLogService;
import com.bass.amed.service.ClinicalTrailsService;
import com.bass.amed.utils.AuditUtils;
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
    ClinicalTrailNotificationTypeRepository clinicalTrailNotificationTypeRepository;
    @Autowired
    DocumentsRepository documentsRepository;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    ClinicalTrialsTypesRepository clinicalTrialsTypesRepository;

    @PostMapping(value = "/save-request")
    public ResponseEntity<RegistrationRequestsEntity> saveClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {

        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found ");
        }
        requestRepository.save(requests);
        List<DocumentsEntity> docs = documentsRepository.findAllByRegistrationRequestId(requests.getId());
        requests.setDocuments(new HashSet<>(docs));
        return new ResponseEntity<>(requests, HttpStatus.CREATED);
    }

    @PostMapping(value = "/add-request")
    @Transactional
    public ResponseEntity<Integer> saveNextClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }
        clinicalTrailsService.addDDClinicalTrailsDocument(requests);
        requestRepository.save(requests);
        if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.EVALUATE)) {
            clinicalTrailsService.schedulePayOrderCT(requests.getId(), requests.getRequestNumber());
        } else if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.ANALIZE)) {
            clinicalTrailsService.unschedulePayOrderCT(requests.getId());
            clinicalTrailsService.scheduleClientDetailsDataCT(requests.getId(), requests.getRequestNumber());
        } else if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.FINISH)) {
            clinicalTrailsService.unscheduleFinisLimitCT(requests.getId());
            AuditUtils.auditClinicatTrinalRegistration(auditLogService, requests);
        } else if (requests.getCurrentStep().equals(Constants.ClinicTrailStep.CANCEL)) {
            clinicalTrailsService.unscheduleFinisLimitCT(requests.getId());
            AuditUtils.auditClinicatTrinalInterrupt(auditLogService, requests);
        }
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/load-request")
    public ResponseEntity<RegistrationRequestsEntity> getRegistrationRequestsById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findClinicalTrailstRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }

        RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();

        return new ResponseEntity<>(registrationRequestsEntity, HttpStatus.OK);
    }

    @PostMapping(value = "/add-amendment-request")
    @Transactional
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

        return new ResponseEntity<>(registrationRequestsEntity, HttpStatus.OK);
    }

    @PostMapping(value = "/finish-amendment-request")
    public ResponseEntity<Integer> finishClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        clinicalTrailsService.finishNewClinicalTrailAmendment(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.OK);
    }

    @Transactional
    @PostMapping(value = "/save-amendment-request")
    public ResponseEntity<RegistrationRequestsEntity> saveClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }

        requestRepository.save(requests);
        List<DocumentsEntity> docs = documentsRepository.findAllByRegistrationRequestId(requests.getId());
        requests.setDocuments(new HashSet<>(docs));
        return new ResponseEntity<>(requests, HttpStatus.CREATED);
    }

    @PostMapping(value = "/add-amendment-next-reques")
    public ResponseEntity<Integer> saveNextClinicalTrailAmendmentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }

        clinicalTrailsService.addDDClinicalTrailsDocument(requests);
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
        AuditUtils.auditClinicatTrinalNotifiicationRegistration(auditLogService, requests);
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

        return new ResponseEntity<>(registrationRequestsEntity2.get(), HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-ct-sequence-nr")
    public ResponseEntity<List<String>> generateCtSequenceNr()
    {
        return new ResponseEntity<>(Arrays.asList(clinicalTrailsService.getDocumentNumber()), HttpStatus.OK);
    }

    @RequestMapping("/all-clinical-trail-types")
    public ResponseEntity<List<ClinicalTrialsTypesEntity>> getAllCtTypes() {
        LOGGER.debug("Retrieve clinical trail types");
        List<ClinicalTrialsTypesEntity> clinicTrailNotificationTypeEntities = clinicalTrialsTypesRepository.findAll();
        return new ResponseEntity<>(clinicTrailNotificationTypeEntities, HttpStatus.OK);
    }

}
