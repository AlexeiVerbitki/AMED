package com.bass.amed.controller.rest;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.utils.Utils;
import com.ibm.icu.util.Output;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RestController
@RequestMapping("/api")
public class RequestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestController.class);

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private RequestTypeRepository requestTypeRepository;
    @Autowired
    private MedicamentGroupRepository medicamentGroupRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private PriceRepository priceRepository;
    @Autowired
    private ReferencePriceRepository referencePriceRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private GenerateMedicamentRegistrationNumberRepository generateMedicamentRegistrationNumberRepository;
    @Autowired
    RegistrationRequestStepRepository registrationRequestStepRepository;

    @RequestMapping(value = "/add-medicament-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> saveMedicamentRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException {
        LOGGER.debug("Add medicament");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());
        for (MedicamentEntity medicament : request.getMedicaments()) {
            if (medicament.getGroup() != null && medicament.getGroup().getCode() != null && !medicament.getGroup().getCode().isEmpty()) {
                NmMedicamentGroupEntity nmMedicamentGroupEntity = medicamentGroupRepository.findByCode(medicament.getGroup().getCode());
                medicament.setGroup(nmMedicamentGroupEntity);
            } else {
                medicament.setGroup(null);
            }
            if (medicament.getStatus().equals("F")) {
                setCodeAndRegistrationNr(medicament);

            }
        }
        addDDDocument(request);
        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    private void setCodeAndRegistrationNr(@RequestBody MedicamentEntity medicament) {
        MedicamentRegistrationNumberSequence medicamentRegistrationNumberSequence = new MedicamentRegistrationNumberSequence();
        generateMedicamentRegistrationNumberRepository.save(medicamentRegistrationNumberSequence);
        medicament.setRegistrationNumber(medicamentRegistrationNumberSequence.getId());
        medicament.setRegistrationDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        MedicamentEntity medicamentEntity;
        String generatedCode = "";
        do {
            generatedCode = Utils.generateMedicamentCode();
            medicamentEntity = medicamentRepository.findByCode(generatedCode);
        }
        while (medicamentEntity != null);
        medicament.setCode(generatedCode);
    }

    private void addDDDocument(@RequestBody RegistrationRequestsEntity request) {
        if (request.getOutputDocuments() == null) {
            request.setOutputDocuments(new HashSet<>());
            Optional<NmDocumentTypesEntity> nmMedicamentTypeEntity = documentTypeRepository.findByCategory("DD");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmMedicamentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Dispozitie de distribuire");
            outputDocumentsEntity.setNumber("DD-" + request.getRequestNumber());
            request.getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    private void addInterruptionOrder(RegistrationRequestsEntity request) {
        if (request.getOutputDocuments() != null && !request.getOutputDocuments().stream().anyMatch(d -> d.getDocType().getCategory().equals("OI"))) {
            Optional<NmDocumentTypesEntity> nmMedicamentTypeEntity = documentTypeRepository.findByCategory("OI");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmMedicamentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Ordin de intrerupere");
            outputDocumentsEntity.setNumber("OI-" + request.getRequestNumber());
            request.getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    @RequestMapping(value = "/add-medicament-history", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentHistory(@RequestBody RegistrationRequestsEntity request) throws CustomException {
        LOGGER.debug("Add medicament history");

        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(request.getId());
        if (regOptional.isPresent()) {
            RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
            registrationRequestsEntity.setCurrentStep(request.getCurrentStep());
            for (MedicamentEntity medicament : request.getMedicaments()) {
                if (medicament.getExperts() != null) {
                    medicament.setExperts(medicament.getExperts());
                }
            }
            registrationRequestsEntity.getRequestHistories().add((RegistrationRequestHistoryEntity) request.getRequestHistories().toArray()[0]);
            addInterruptionOrder(registrationRequestsEntity);
            requestRepository.save(registrationRequestsEntity);
            return new ResponseEntity<>(request.getId(), HttpStatus.OK);
        }

        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/add-medicament-payments", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentPayments(@RequestBody RegistrationRequestsEntity request) throws CustomException {
        LOGGER.debug("Add medicament payments");

        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(request.getId());
        if (regOptional.isPresent()) {
            RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
            registrationRequestsEntity.setCurrentStep(request.getCurrentStep());
            registrationRequestsEntity.getRequestHistories().addAll(request.getRequestHistories());
//            for(MedicamentEntity medicamentEntity : registrationRequestsEntity.getMedicaments())
//            {
//                medicamentEntity.getReceipts().clear();
//                medicamentEntity.getReceipts().addAll(medicamentEntity.getReceipts());
//                medicamentEntity.getPaymentOrders().clear();
//                medicamentEntity.getPaymentOrders().addAll(medicamentEntity.getPaymentOrders());
//            }
            requestRepository.save(registrationRequestsEntity);
            return new ResponseEntity<>(request.getId(), HttpStatus.OK);
        }

        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/load-medicament-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getMedicamentRequestById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (regOptional.isPresent()) {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @PostMapping(value = "/add-clinical-trail-request")
    public ResponseEntity<Integer> saveClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getClinicalTrails() == null) {
            throw new CustomException("Request was not found");
        }
        addDDClinicalTrailsDocument(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    private void addDDClinicalTrailsDocument(@RequestBody RegistrationRequestsEntity request) {
        Optional<RegistrationRequestStepsEntity> requestTypesStepEntityList = registrationRequestStepRepository.findOneByRequestTypeIdAndCode(3, request.getCurrentStep());
        if(requestTypesStepEntityList.isPresent()){
            RegistrationRequestStepsEntity entity = requestTypesStepEntityList.get();
            if(request.getClinicalTrails().getOutputDocuments()==null){
                request.getClinicalTrails().setOutputDocuments(new HashSet<>());
            }

            String[] docTypes = entity.getOutputDocTypes() == null ? new String[0] : entity.getOutputDocTypes().split(",");

            for (String docType : docTypes) {
                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(docType);
                if(nmDocumentTypeEntity.isPresent()){
                    OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
                    outputDocumentsEntity.setDocType(nmDocumentTypeEntity.get());
                    outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
                    outputDocumentsEntity.setName(nmDocumentTypeEntity.get().getDescription());
                    outputDocumentsEntity.setNumber(docType+"-" + request.getRequestNumber());
                    request.getClinicalTrails().getOutputDocuments().add(outputDocumentsEntity);
                }
            }
        }
    }

    @PostMapping(value = "/add-output-document-request")
    public ResponseEntity<Integer> saveOutputDocumentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        requests.getClinicalTrails().getOutputDocuments().forEach(doc -> {
            if (doc.getId() == null) {
                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(doc.getDocType().getCategory());
                doc.setDocType(nmDocumentTypeEntity.get());
            }
        });

        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/load-clinical-trail-request")
    public ResponseEntity<RegistrationRequestsEntity> getClinicalTrailById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }
        RegistrationRequestsEntity rrE = regOptional.get();
        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }


    @Transactional(propagation = Propagation.REQUIRED)
    @RequestMapping(value = "/add-prices-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> savePricesRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException {
        LOGGER.debug("add new prices request");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.setType(type.get());

        //  Set<PricesEntity> prices = request.getPrices();//getPricesMedicament().getPrices();
        //   Set<ReferencePricesEntity> referencePrices = request.getPricesMedicament().getReferencePrices();

        //    request.setPricesMedicament(medicamentRepository.findById(request.getPricesMedicament().getId()).get());

        requestRepository.save(request);

//        for (PricesEntity p: request.getPrices()) {
//            p.setRequestId(request.getId());
//        }
//
//        priceRepository.saveAll(request.getPrices());

//        if(referencePrices != null) {
//            referencePriceRepository.saveAll(referencePrices);
//        }

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/load-prices-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getPricesRequestById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (regOptional.isPresent()) {
            List<String> docTypes = Arrays.asList("OP", "A1", "A2", "DP", "CP", "RF", "RC", "NL");
            List<NmDocumentTypesEntity> outputDocTypes = documentTypeRepository.findAll();
            outputDocTypes.removeIf(docType -> !docTypes.contains(docType.getCategory()));

            RegistrationRequestsEntity request = regOptional.get();
            Set<OutputDocumentsEntity> outputDocs = new HashSet<OutputDocumentsEntity>(docTypes.size());

            final Set<DocumentsEntity> docs = request.getPricesRequest().getDocuments();

            outputDocTypes.forEach(docType -> {
                OutputDocumentsEntity outDoc = new OutputDocumentsEntity();
                outDoc.setDocType(docType);

                Optional<DocumentsEntity> foundDoc = docs.stream().filter(doc -> doc.getDocType().equals(docType)).findFirst();
                if (foundDoc.isPresent()) {
                    outDoc.setName(foundDoc.get().getName());
                }

                outputDocs.add(outDoc);
            });

            request.setOutputDocuments(outputDocs);
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @PostMapping(value = "/add-import-request")
    public ResponseEntity<Integer> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        if (requests.getImportAuthorizationEntity() == null) {
            throw new CustomException("Request was not found");
        }
//        addDDImportTrailsDocument(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

//    private void addDDImportTrailsDocument(@RequestBody RegistrationRequestsEntity request) {
//        Optional<RegistrationRequestStepsEntity> requestTypesStepEntityList = registrationRequestStepRepository.findOneByRequestTypeIdAndCode(3, request.getCurrentStep());
//        if(requestTypesStepEntityList.isPresent()){
//            RegistrationRequestStepsEntity entity = requestTypesStepEntityList.get();
//            if(request.getClinicalTrails().getOutputDocuments()==null){
//                request.getClinicalTrails().setOutputDocuments(new HashSet<>());
//            }
//
//            String[] docTypes = entity.getOutputDocTypes() == null ? new String[0] : entity.getOutputDocTypes().split(",");
//
//            for (String docType : docTypes) {
//                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(docType);
//                if(nmDocumentTypeEntity.isPresent()){
//                    OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
//                    outputDocumentsEntity.setDocType(nmDocumentTypeEntity.get());
//                    outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
//                    outputDocumentsEntity.setName(nmDocumentTypeEntity.get().getDescription());
//                    outputDocumentsEntity.setNumber(docType+"-" + request.getRequestNumber());
//                    request.getClinicalTrails().getOutputDocuments().add(outputDocumentsEntity);
//                }
//            }
//        }
//    }

}
