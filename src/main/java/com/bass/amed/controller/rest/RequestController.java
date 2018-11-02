package com.bass.amed.controller.rest;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.GenerateDocNumberService;
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
import java.util.Calendar;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class RequestController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestController.class);

    @Autowired
    private GenerateDocNumberService generateDocNumberService;
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

    @RequestMapping(value = "/add-medicament-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> saveMedicamentRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());
        if (request.getMedicament().getGroup() != null && request.getMedicament().getGroup().getCode() != null && !request.getMedicament().getGroup().getCode().isEmpty())
        {
            NmMedicamentGroupEntity nmMedicamentGroupEntity = medicamentGroupRepository.findByCode(request.getMedicament().getGroup().getCode());
            request.getMedicament().setGroup(nmMedicamentGroupEntity);
        }
        else
        {
            request.getMedicament().setGroup(null);
        }
        addDDDocument(request);
        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    private void addDDDocument(@RequestBody RegistrationRequestsEntity request)
    {
        if (request.getMedicament() != null && request.getMedicament().getOutputDocuments() == null)
        {
            request.getMedicament().setOutputDocuments(new HashSet<>());
            Optional<NmDocumentTypesEntity> nmMedicamentTypeEntity = documentTypeRepository.findByCategory("DD");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmMedicamentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Dispozitie de distribuire");
            outputDocumentsEntity.setNumber(String.valueOf(generateDocNumberService.getDocumentNumber()));
            request.getMedicament().getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    private void addInterruptionOrder(RegistrationRequestsEntity request)
    {
        if (request.getMedicament() != null && request.getMedicament().getOutputDocuments() != null && !request.getMedicament().getOutputDocuments().stream().anyMatch(d -> d.getDocType().getCategory().equals("OI")))
        {
            Optional<NmDocumentTypesEntity> nmMedicamentTypeEntity = documentTypeRepository.findByCategory("OI");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmMedicamentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Ordin de intrerupere");
            outputDocumentsEntity.setNumber(String.valueOf(generateDocNumberService.getDocumentNumber()));
            request.getMedicament().getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    @RequestMapping(value = "/add-medicament-history", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentHistory(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament history");

        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(request.getId());
        if (regOptional.isPresent())
        {
            RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
            registrationRequestsEntity.setCurrentStep(request.getCurrentStep());
            if (request.getMedicament() != null && request.getMedicament().getExperts() != null)
            {
                registrationRequestsEntity.getMedicament().setExperts(request.getMedicament().getExperts());
            }
            registrationRequestsEntity.getRequestHistories().add((RegistrationRequestHistoryEntity) request.getRequestHistories().toArray()[0]);
            addInterruptionOrder(registrationRequestsEntity);
            requestRepository.save(registrationRequestsEntity);
            return new ResponseEntity<>(request.getId(), HttpStatus.OK);
        }

        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/add-medicament-payments", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentPayments(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament payments");

        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(request.getId());
        if (regOptional.isPresent())
        {
            RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
            registrationRequestsEntity.setCurrentStep(request.getCurrentStep());
            registrationRequestsEntity.getRequestHistories().addAll(request.getRequestHistories());
            registrationRequestsEntity.getMedicament().getReceipts().clear();
            registrationRequestsEntity.getMedicament().getReceipts().addAll(request.getMedicament().getReceipts());
            registrationRequestsEntity.getMedicament().getPaymentOrders().clear();
            registrationRequestsEntity.getMedicament().getPaymentOrders().addAll(request.getMedicament().getPaymentOrders());
            requestRepository.save(registrationRequestsEntity);
            return new ResponseEntity<>(request.getId(), HttpStatus.OK);
        }

        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/load-medicament-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getMedicamentRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @PostMapping(value = "/add-clinical-trail-request")
    public ResponseEntity<Integer> saveClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        addDDClinicalTrailsDocument(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    private void addDDClinicalTrailsDocument(@RequestBody RegistrationRequestsEntity request)
    {
        if (request.getClinicalTrails() != null && request.getClinicalTrails().getOutputDocuments() == null)
        {
            request.getClinicalTrails().setOutputDocuments(new HashSet<>());
            Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory("DD");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmDocumentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Dispozitie de distribuire");
            outputDocumentsEntity.setNumber(String.valueOf(generateDocNumberService.getDocumentNumber()));
            request.getClinicalTrails().getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    @GetMapping(value = "/load-clinical-trail-request")
    public ResponseEntity<RegistrationRequestsEntity> getClinicalTrailById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (!regOptional.isPresent())
        {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }
        RegistrationRequestsEntity rrE = regOptional.get();
        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }


    @Transactional(propagation = Propagation.REQUIRED)
    @RequestMapping(value = "/add-prices-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> savePricesRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("add new prices request");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.setType(type.get());

        Set<PricesEntity> prices = request.getMedicament().getPrices();
        Set<ReferencePricesEntity> referencePrices = request.getMedicament().getReferencePrices();

        request.setMedicament(medicamentRepository.findById(request.getMedicament().getId()).get());

        requestRepository.save(request);
        priceRepository.saveAll(prices);
        referencePriceRepository.saveAll(referencePrices);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }

    @PostMapping(value = "/add-import-request")
    public ResponseEntity<Integer> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        LOGGER.debug("add new Import request");
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/load-import-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getImportById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Import request was not found");
    }

}
