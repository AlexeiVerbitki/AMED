package com.bass.amed.controller.rest.clinicaltrails;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.CtMedINstInvestigatorRepository;
import com.bass.amed.repository.DocumentTypeRepository;
import com.bass.amed.repository.RegistrationRequestStepRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.service.ClinicalTrailsService;
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
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    RegistrationRequestStepRepository registrationRequestStepRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private ClinicalTrailsService clinicalTrailsService;
    @Autowired
    private CtMedINstInvestigatorRepository medINstInvestigatorRepository;


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
        addDDClinicalTrailsDocument(requests);
        clinicalTrailsService.handeMedicalInstitutions(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    private void addDDClinicalTrailsDocument(@RequestBody RegistrationRequestsEntity request) {
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

    @GetMapping(value = "/load-request")
    public ResponseEntity<RegistrationRequestsEntity> getClinicalTrailById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findClinicalTrailstRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }

        ClinicalTrialsEntity ct = regOptional.get().getClinicalTrails();
        Set<CtMedicalInstitutionEntity> medInstitutions = ct.getMedicalInstitutions();

        Set<CtMedInstInvestigatorEntity> ctMedInstInvestigatorEntitiesOld = medINstInvestigatorRepository.findCtMedInstInvestigatorById(ct.getId());

        Set<CtMedicalInstitutionEntity> ctMedicalInstitutionEntities = new HashSet<>();

        ctMedInstInvestigatorEntitiesOld.forEach(ctMedInstInvestigatorEntity -> {
            CtMedicalInstitutionEntity medInst = ctMedInstInvestigatorEntity.getMedicalInstitutionsEntity();
            CtInvestigatorEntity ctInvestigatorEntity = ctMedInstInvestigatorEntity.getInvestigatorsEntity();
            ctInvestigatorEntity.setMain(ctMedInstInvestigatorEntity.getMainInvestigator());

            medInst.getInvestigators().add(ctMedInstInvestigatorEntity.getInvestigatorsEntity());
            ctMedicalInstitutionEntities.add(medInst);

        });
        ct.setMedicalInstitutions(ctMedicalInstitutionEntities);

        return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
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
        List<ClinicTrialAmendEntity> clinicTrialAmendEntities = registrationRequestsEntity.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(clinicTrialAmendEntity -> {
            return clinicTrialAmendEntity.getRegistrationRequestId().equals(registrationRequestsEntity.getId());
        }).collect(Collectors.toList());

        registrationRequestsEntity.getClinicalTrails().setClinicTrialAmendEntities(clinicTrialAmendEntities);

        return new ResponseEntity<>(registrationRequestsEntity, HttpStatus.OK);
    }


}
