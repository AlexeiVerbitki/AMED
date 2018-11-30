package com.bass.amed.controller.rest.clinicaltrails;

import com.bass.amed.controller.rest.AdministrationController;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.ClinicalTrailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;


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
        clinicalTrailsService.addDDClinicalTrailsDocument(requests);
        clinicalTrailsService.handeMedicalInstitutions(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/load-request")
    public ResponseEntity<RegistrationRequestsEntity> getClinicalTrailById(@RequestParam(value = "id") Integer id) throws CustomException {
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

        Set<ClinicTrialAmendEntity> clinicTrialAmendEntities = new HashSet<>();
        clinicTrialAmendEntities.add(clinicTrialAmendEntity);
        registrationRequestsEntity.getClinicalTrails().setClinicTrialAmendEntities(clinicTrialAmendEntities);

        if(clinicTrialAmendEntities!=null){
            Set<CtAmendMedInstInvestigatorEntity> requestTypesStepEntityList = ctAmendMedInstInvestigatorRepository.findCtMedInstInvestigatorById(clinicTrialAmendEntity.getId());

            requestTypesStepEntityList.forEach(medInstInvestigator -> {
                CtMedicalInstitutionEntity medInst = medInstInvestigator.getMedicalInstitutionsEntity();
                CtInvestigatorEntity ctInvestigatorEntity = medInstInvestigator.getInvestigatorsEntity();
                ctInvestigatorEntity.setMain(medInstInvestigator.getMainInvestigator());
                medInst.getInvestigators().add(ctInvestigatorEntity);

                clinicTrialAmendEntity.getMedicalInstitutions().add(medInst);
            });
        }

        return new ResponseEntity<>(registrationRequestsEntity, HttpStatus.OK);
    }

    @RequestMapping("/all-clinical-trails-by-cod-or-eudra")
    public ResponseEntity<List<ClinicalTrialsEntity>> getClinicalTrailByCodeAndEudra(String partialCode) {
        LOGGER.debug("Retrieve clinical trails by code or eudra" + partialCode);
        List<ClinicalTrialsEntity> clinicalTrialsEntities = clinicalTrialsRepository.getClinicalTrailByCodeOrEudra(partialCode, partialCode);
        return new ResponseEntity<>(clinicalTrialsEntities, HttpStatus.OK);
    }


}
