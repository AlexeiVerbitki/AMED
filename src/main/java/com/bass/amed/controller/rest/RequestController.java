package com.bass.amed.controller.rest;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.utils.Utils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
public class RequestController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestController.class);
    @Autowired
    RegistrationRequestStepRepository registrationRequestStepRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private RequestTypeRepository requestTypeRepository;
    @Autowired
    private MedicamentGroupRepository medicamentGroupRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private GenerateMedicamentRegistrationNumberRepository generateMedicamentRegistrationNumberRepository;
    @Autowired
    private PriceRepository priceRepository;

    @RequestMapping(value = "/add-medicament-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> saveMedicamentRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());
        if (request.getMedicaments() != null)
        {
            MedicamentRegistrationNumberSequence medicamentRegistrationNumberSequence = new MedicamentRegistrationNumberSequence();
            generateMedicamentRegistrationNumberRepository.save(medicamentRegistrationNumberSequence);
            for (MedicamentEntity medicament : request.getMedicaments())
            {
                if (medicament.getGroup() != null && medicament.getGroup().getCode() != null && !medicament.getGroup().getCode().isEmpty())
                {
                    NmMedicamentGroupEntity nmMedicamentGroupEntity = medicamentGroupRepository.findByCode(medicament.getGroup().getCode());
                    medicament.setGroup(nmMedicamentGroupEntity);
                }
                else
                {
                    medicament.setGroup(null);
                }
                if (medicament.getStatus().equals("F"))
                {
                    setCodeAndRegistrationNr(medicament, medicamentRegistrationNumberSequence.getId());
                    medicament.setExpirationDate(java.sql.Date.valueOf(LocalDate.now().plusYears(5)));
                }
            }
        }
        addDDDocument(request);
        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/add-medicament-history-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> saveMedicamentHistoryRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament history");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());
        if (request.getMedicamentHistory().isEmpty())
        {
            List<MedicamentEntity> medicamentEntities = medicamentRepository.findByRegistrationNumber(request.getMedicamentPostauthorizationRegisterNr());
            MedicamentHistoryEntity medicamentHistoryEntity = new MedicamentHistoryEntity();
            medicamentHistoryEntity.assign(medicamentEntities.get(0));
            medicamentHistoryEntity.setStatus("P");
            for (MedicamentEntity med : medicamentEntities)
            {
                MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity = new MedicamentDivisionHistoryEntity();
                medicamentDivisionHistoryEntity.setDescription(med.getDivision());
                medicamentDivisionHistoryEntity.setOld(1);
                medicamentHistoryEntity.getDivisionHistory().add(medicamentDivisionHistoryEntity);
            }
            request.getMedicamentHistory().add(medicamentHistoryEntity);
        }
        else
        {
            MedicamentHistoryEntity medicamentHistoryEntity = request.getMedicamentHistory().stream().findFirst().get();
            NmMedicamentGroupEntity nmMedicamentGroupEntity = medicamentGroupRepository.findByCode(medicamentHistoryEntity.getGroup().getCode());
            medicamentHistoryEntity.setGroup(nmMedicamentGroupEntity);
        }

        addDRDocument(request);
        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    private void setCodeAndRegistrationNr(@RequestBody MedicamentEntity medicament, Integer regNumber)
    {
        medicament.setRegistrationNumber(regNumber);
        medicament.setRegistrationDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        MedicamentEntity medicamentEntity;
        String generatedCode = "";
        do
        {
            generatedCode = Utils.generateMedicamentCode();
            medicamentEntity = medicamentRepository.findByCode(generatedCode);
        }
        while (medicamentEntity != null);
        medicament.setCode(generatedCode);
    }

    private void addDDDocument(@RequestBody RegistrationRequestsEntity request)
    {
        if (request.getOutputDocuments() == null || request.getOutputDocuments().isEmpty())
        {
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

    private void addDRDocument(@RequestBody RegistrationRequestsEntity request)
    {
        if (request.getOutputDocuments() == null || request.getOutputDocuments().isEmpty())
        {
            request.setOutputDocuments(new HashSet<>());
            Optional<NmDocumentTypesEntity> nmMedicamentTypeEntity = documentTypeRepository.findByCategory("DR");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmMedicamentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Dispozitie de repartizare");
            outputDocumentsEntity.setNumber("DR-" + request.getRequestNumber());
            request.getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    private void addInterruptionOrder(RegistrationRequestsEntity request)
    {
        if (request.getOutputDocuments() != null && !request.getOutputDocuments().stream().anyMatch(d -> d.getDocType().getCategory().equals("OI")))
        {
            Optional<NmDocumentTypesEntity> nmMedicamentTypeEntity = documentTypeRepository.findByCategory("OI");
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(nmMedicamentTypeEntity.get());
            outputDocumentsEntity.setDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
            outputDocumentsEntity.setName("Ordin de intrerupere");
            outputDocumentsEntity.setNumber("OI-" + request.getRequestNumber());
            request.getOutputDocuments().add(outputDocumentsEntity);
        }
    }

    @RequestMapping(value = "/add-medicament-registration-history", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentRegistrationHistoryOnInterruption(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament registration history");

        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findMedicamentRequestById(request.getId());
        if (regOptional.isPresent())
        {
            RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
            registrationRequestsEntity.setCurrentStep(request.getCurrentStep());
            if (request.getMedicaments() != null)
            {
                Optional<MedicamentEntity> opt = request.getMedicaments().stream().findFirst();
                if (opt.isPresent())
                {
                    MedicamentEntity med = opt.get();
                    for (MedicamentEntity medicament : registrationRequestsEntity.getMedicaments())
                    {
                        medicament.setExperts(med.getExperts());
                    }
                }
            }
            registrationRequestsEntity.getRequestHistories().add((RegistrationRequestHistoryEntity) request.getRequestHistories().toArray()[0]);
            addInterruptionOrder(registrationRequestsEntity);
            requestRepository.save(registrationRequestsEntity);
            return new ResponseEntity<>(request.getId(), HttpStatus.OK);
        }

        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/add-medicament-postauthorization-history", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentPostauthorizationHistoryOnInterruption(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament postauthorization history");

        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(request.getId());
        if (regOptional.isPresent())
        {
            RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
            registrationRequestsEntity.setCurrentStep(request.getCurrentStep());
            Optional<MedicamentHistoryEntity> optBody = request.getMedicamentHistory().stream().findFirst();
            Optional<MedicamentHistoryEntity> optDB = registrationRequestsEntity.getMedicamentHistory().stream().findFirst();
            optDB.get().setExperts(optBody.get().getExperts());
            registrationRequestsEntity.getRequestHistories().add((RegistrationRequestHistoryEntity) request.getRequestHistories().toArray()[0]);
            addInterruptionOrder(registrationRequestsEntity);
            requestRepository.save(registrationRequestsEntity);
            return new ResponseEntity<>(request.getId(), HttpStatus.OK);
        }

        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/load-medicament-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getMedicamentRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findMedicamentRequestById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @PostMapping(value = "/save-clinical-trail-request")
    public ResponseEntity<Integer> saveClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        if (requests.getClinicalTrails() == null)
        {
            throw new CustomException("Request was not found");
        }
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @PostMapping(value = "/add-clinical-trail-request")
    public ResponseEntity<Integer> saveNextClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        if (requests.getClinicalTrails() == null)
        {
            throw new CustomException("Request was not found");
        }
        addDDClinicalTrailsDocument(requests);
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    private void addDDClinicalTrailsDocument(@RequestBody RegistrationRequestsEntity request)
    {
        Optional<RegistrationRequestStepsEntity> requestTypesStepEntityList = registrationRequestStepRepository.findOneByRequestTypeIdAndCode(3, request.getCurrentStep());
        if (requestTypesStepEntityList.isPresent())
        {
            RegistrationRequestStepsEntity entity = requestTypesStepEntityList.get();
            request.setOutputDocuments(new HashSet<>());
            //            if(request.getOutputDocuments()==null){
            //                request.setOutputDocuments(new HashSet<>());
            //            }

            String[] docTypes = entity.getOutputDocTypes() == null ? new String[0] : entity.getOutputDocTypes().split(",");

            for (String docType : docTypes)
            {
                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(docType);
                if (nmDocumentTypeEntity.isPresent())
                {
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

    @PostMapping(value = "/add-output-document-request")
    public ResponseEntity<Integer> saveOutputDocumentRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        requests.getOutputDocuments().forEach(doc -> {
            if (doc.getId() == null)
            {
                Optional<NmDocumentTypesEntity> nmDocumentTypeEntity = documentTypeRepository.findByCategory(doc.getDocType().getCategory());
                doc.setDocType(nmDocumentTypeEntity.get());
            }
        });

        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
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


    @RequestMapping(value = "/add-prices-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> savePricesRequests(@RequestBody List<RegistrationRequestsEntity> requests)
    {
        LOGGER.debug("add new prices requests");
        requests.forEach(r -> {
            Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(r.getType().getCode());
            r.setType(type.get());
        });

        requestRepository.saveAll(requests);

        boolean saved = true;
        for(RegistrationRequestsEntity r : requests) {
            saved &= r.getId() != null;
        }

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }


    @RequestMapping(value = "/add-price-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> savePriceRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("add new price request");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.setType(type.get());

        PricesEntity updatedPrice = request.getPrice();
        PricesEntity price = priceRepository.findOneById(updatedPrice.getId());
        price.setType(updatedPrice.getType());
        price.setValue(updatedPrice.getValue());
        price.setMdlValue(updatedPrice.getMdlValue());
        price.setExpirationDate(updatedPrice.getExpirationDate());
        price.setExpirationReason(updatedPrice.getExpirationReason());
        price.setOrderApprovDate(updatedPrice.getOrderApprovDate());
        price.setRevisionDate(updatedPrice.getRevisionDate());
        price.setReferencePrices(updatedPrice.getReferencePrices());

        request.setPrice(price);
        try {
            requestRepository.saveAndFlush(request);
        } catch (Exception ex) {
            throw  new CustomException("A aparut o erroare la salvarea datelor");
        }
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }


    @RequestMapping(value = "/load-prices-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getPricesRequestById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findPricesRequestById(id);
        if (regOptional.isPresent()) {
            List<String> docTypes = Arrays.asList("OP", "A1", "A2", "DP", "NL");//OP,A1,A2,DP,CP,RF,RC,NL,RQ,CR,CC,PC
            List<NmDocumentTypesEntity> outputDocTypes = documentTypeRepository.findAll();
            outputDocTypes.removeIf(docType -> !docTypes.contains(docType.getCategory()));

            RegistrationRequestsEntity request = regOptional.get();
            PricesEntity price = (PricesEntity)Hibernate.unproxy(request.getPrice());
            MedicamentEntity originalMedicament = (MedicamentEntity)Hibernate.unproxy(price.getMedicament().getOriginalMedicament());
            price.getMedicament().setOriginalMedicament(originalMedicament);
            request.setPrice(price);

            Set<OutputDocumentsEntity> outputDocs = new HashSet<>(docTypes.size());

            Set<DocumentsEntity> docs = request.getDocuments();

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

            return new ResponseEntity<>(request, HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @RequestMapping("/save-postauthorization-medicament")
    @Transactional
    public ResponseEntity<RegistrationRequestsEntity> savePostauthorizationMedicament(@RequestBody RegistrationRequestsEntity request)
    {
        LOGGER.debug("Save postauthorization medicaemnt");
        //Initial entities
        List<MedicamentEntity> medicamentEntities = medicamentRepository.findByRegistrationNumber(request.getMedicamentPostauthorizationRegisterNr());
        // New division - new medicament
        Optional<MedicamentHistoryEntity> medicamentHistoryEntityOpt = request.getMedicamentHistory().stream().findFirst();
        MedicamentHistoryEntity medicamentHistoryEntity = medicamentHistoryEntityOpt.orElse(new MedicamentHistoryEntity());
        for (MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity : medicamentHistoryEntity.getDivisionHistory())
        {
            if (medicamentDivisionHistoryEntity.getOld() == 0)
            {
                MedicamentEntity medicamentEntity = fillMedicamentDetails(request.getMedicamentPostauthorizationRegisterNr(), medicamentHistoryEntity,medicamentDivisionHistoryEntity);
                request.getMedicaments().add(medicamentEntity);
            }
        }
        //in medicament history save old changes
        Optional<MedicamentEntity> medicamentEntityOpt = medicamentEntities.stream().findFirst();
        MedicamentEntity medicamentEntityForUpdate = medicamentEntityOpt.orElse(new MedicamentEntity());
        MedicamentHistoryEntity medicamentHistoryEntityForUpdate = fillMedicamentHistoryDetails(request.getMedicamentPostauthorizationRegisterNr(), medicamentHistoryEntity, medicamentEntityForUpdate);
        request.getMedicamentHistory().clear();
        request.getMedicamentHistory().add(medicamentHistoryEntityForUpdate);
        // Update old medicaments
        for (MedicamentEntity med : medicamentEntities)
        {
            med.assign(medicamentHistoryEntity);
            medicamentRepository.save(med);
        }
        return new ResponseEntity<>(requestRepository.save(request), HttpStatus.OK);
    }

    private MedicamentHistoryEntity fillMedicamentHistoryDetails(Integer regNr, MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntityForUpdate)
    {
        MedicamentHistoryEntity medicamentHistoryEntityForUpdate = new MedicamentHistoryEntity();
        if (!medicamentEntityForUpdate.getName().equals(medicamentHistoryEntity.getName()))
        {
            medicamentHistoryEntityForUpdate.setName(medicamentEntityForUpdate.getName());
        }
        if (!medicamentEntityForUpdate.getInternationalMedicamentName().equals(medicamentHistoryEntity.getInternationalMedicamentName()))
        {
            medicamentHistoryEntityForUpdate.setInternationalMedicamentName(medicamentEntityForUpdate.getInternationalMedicamentName());
        }
        if (!medicamentEntityForUpdate.getDose().equals(medicamentHistoryEntity.getDose()))
        {
            medicamentHistoryEntityForUpdate.setDose(medicamentEntityForUpdate.getDose());
        }
        if (!medicamentEntityForUpdate.getPharmaceuticalForm().equals(medicamentHistoryEntity.getPharmaceuticalForm()))
        {
            medicamentHistoryEntityForUpdate.setPharmaceuticalForm(medicamentEntityForUpdate.getPharmaceuticalForm());
        }
        if (!medicamentEntityForUpdate.getAuthorizationHolder().equals(medicamentHistoryEntity.getAuthorizationHolder()))
        {
            medicamentHistoryEntityForUpdate.setAuthorizationHolder(medicamentEntityForUpdate.getAuthorizationHolder());
        }
        if (!medicamentEntityForUpdate.getMedicamentType().equals(medicamentHistoryEntity.getMedicamentType()))
        {
            medicamentHistoryEntityForUpdate.setMedicamentType(medicamentEntityForUpdate.getMedicamentType());
        }
        if (!medicamentEntityForUpdate.getGroup().equals(medicamentHistoryEntity.getGroup()))
        {
            medicamentHistoryEntityForUpdate.setGroup(medicamentEntityForUpdate.getGroup());
        }
        if (!medicamentEntityForUpdate.getPrescription().equals(medicamentHistoryEntity.getPrescription()))
        {
            medicamentHistoryEntityForUpdate.setPrescription(medicamentEntityForUpdate.getPrescription());
        }
        if ((medicamentEntityForUpdate.getVolume()==null && medicamentHistoryEntity.getVolume()!=null) || (medicamentEntityForUpdate.getVolume()!=null && !medicamentEntityForUpdate.getVolume().equals(medicamentHistoryEntity.getVolume())))
        {
            medicamentHistoryEntityForUpdate.setVolume(medicamentEntityForUpdate.getVolume());
        }
        if (!medicamentEntityForUpdate.getTermsOfValidity().equals(medicamentHistoryEntity.getTermsOfValidity()))
        {
            medicamentHistoryEntityForUpdate.setTermsOfValidity(medicamentEntityForUpdate.getTermsOfValidity());
        }
        if ((medicamentEntityForUpdate.getVolumeQuantityMeasurement()==null && medicamentHistoryEntity.getVolumeQuantityMeasurement()!=null) || (medicamentEntityForUpdate.getVolumeQuantityMeasurement()!=null && !medicamentEntityForUpdate.getVolumeQuantityMeasurement().equals(medicamentHistoryEntity.getVolumeQuantityMeasurement())))
        {
            medicamentHistoryEntityForUpdate.setVolumeQuantityMeasurement(medicamentEntityForUpdate.getVolumeQuantityMeasurement());
        }
        for (MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity : medicamentEntityForUpdate.getActiveSubstances())
        {
            MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryForUpdateEntity = new MedicamentActiveSubstancesHistoryEntity();
            Optional<MedicamentActiveSubstancesHistoryEntity> medicamentActiveSubstancesHistoryEntityOpt =
                    medicamentHistoryEntity.getActiveSubstancesHistory().stream().filter(t -> t.getActiveSubstance().getId() == medicamentActiveSubstancesEntity.getActiveSubstance().getId()).findFirst();
            if (medicamentActiveSubstancesHistoryEntityOpt.isPresent())
            {
                MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity = medicamentActiveSubstancesHistoryEntityOpt.get();
                medicamentActiveSubstancesHistoryForUpdateEntity.setActiveSubstance(medicamentActiveSubstancesEntity.getActiveSubstance());
                boolean isModified = false;
                if (!medicamentActiveSubstancesHistoryEntity.getManufacture().equals(medicamentActiveSubstancesEntity.getManufacture()))
                {
                    medicamentActiveSubstancesHistoryForUpdateEntity.setManufacture(medicamentActiveSubstancesEntity.getManufacture());
                    isModified = true;
                }
                if (!medicamentActiveSubstancesHistoryEntity.getQuantity().equals(medicamentActiveSubstancesEntity.getQuantity()))
                {
                    medicamentActiveSubstancesHistoryForUpdateEntity.setQuantity(medicamentActiveSubstancesEntity.getQuantity());
                    isModified = true;
                }
                if (!medicamentActiveSubstancesHistoryEntity.getUnitsOfMeasurement().equals(medicamentActiveSubstancesEntity.getUnitsOfMeasurement()))
                {
                    medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurement(medicamentActiveSubstancesEntity.getUnitsOfMeasurement());
                    isModified = true;
                }
                medicamentActiveSubstancesHistoryForUpdateEntity.setStatus("M");
                if(isModified)
                {
                    medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryForUpdateEntity);
                }
            }
            else
            {
                medicamentActiveSubstancesHistoryForUpdateEntity.setActiveSubstance(medicamentActiveSubstancesEntity.getActiveSubstance());
                medicamentActiveSubstancesHistoryForUpdateEntity.setManufacture(medicamentActiveSubstancesEntity.getManufacture());
                medicamentActiveSubstancesHistoryForUpdateEntity.setQuantity(medicamentActiveSubstancesEntity.getQuantity());
                medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurement(medicamentActiveSubstancesEntity.getUnitsOfMeasurement());
                medicamentActiveSubstancesHistoryForUpdateEntity.setStatus("R");
                medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryForUpdateEntity);
            }
        }
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity : medicamentHistoryEntity.getActiveSubstancesHistory())
        {
            Optional<MedicamentActiveSubstancesEntity> medicamentActiveSubstancesEntity =
                    medicamentEntityForUpdate.getActiveSubstances().stream().filter(t -> t.getActiveSubstance().getId() == medicamentActiveSubstancesHistoryEntity.getActiveSubstance().getId()).findFirst();
            if(!medicamentActiveSubstancesEntity.isPresent())
            {
                medicamentActiveSubstancesHistoryEntity.setStatus("N");
                medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryEntity);
            }
        }
        medicamentHistoryEntityForUpdate.setExperts(medicamentHistoryEntity.getExperts());
        medicamentHistoryEntityForUpdate.setRegistrationNumber(regNr);
        medicamentHistoryEntityForUpdate.setChangeDate(LocalDateTime.now());
        medicamentHistoryEntity.setStatus("F");
        return medicamentHistoryEntityForUpdate;
    }

    private MedicamentEntity fillMedicamentDetails(Integer regNr, MedicamentHistoryEntity medicamentHistoryEntity,MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity)
    {
        MedicamentEntity medicamentEntity = new MedicamentEntity();
        setCodeAndRegistrationNr(medicamentEntity, regNr);
        medicamentEntity.setStatus("F");
        medicamentEntity.setName(medicamentHistoryEntity.getName());
        medicamentEntity.setInternationalMedicamentName(medicamentHistoryEntity.getInternationalMedicamentName());
        medicamentEntity.setExpirationDate(java.sql.Date.valueOf(LocalDate.now().plusYears(5)));
        medicamentEntity.setDose(medicamentHistoryEntity.getDose());
        medicamentEntity.setPharmaceuticalForm(medicamentHistoryEntity.getPharmaceuticalForm());
        medicamentEntity.setAuthorizationHolder(medicamentHistoryEntity.getAuthorizationHolder());
        medicamentEntity.setMedicamentType(medicamentHistoryEntity.getMedicamentType());
        medicamentEntity.setGroup(medicamentHistoryEntity.getGroup());
        medicamentEntity.setPrescription(medicamentHistoryEntity.getPrescription());
        medicamentEntity.setVolume(medicamentHistoryEntity.getVolume());
        medicamentEntity.setTermsOfValidity(medicamentHistoryEntity.getTermsOfValidity());
        medicamentEntity.setExperts(medicamentHistoryEntity.getExperts());
        medicamentEntity.setVolumeQuantityMeasurement(medicamentHistoryEntity.getVolumeQuantityMeasurement());
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistEntity : medicamentHistoryEntity.getActiveSubstancesHistory())
        {
            MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity = new MedicamentActiveSubstancesEntity();
            medicamentActiveSubstancesEntity.setActiveSubstance(medicamentActiveSubstancesHistEntity.getActiveSubstance());
            medicamentActiveSubstancesEntity.setManufacture(medicamentActiveSubstancesHistEntity.getManufacture());
            medicamentActiveSubstancesEntity.setQuantity(medicamentActiveSubstancesHistEntity.getQuantity());
            medicamentActiveSubstancesEntity.setUnitsOfMeasurement(medicamentActiveSubstancesHistEntity.getUnitsOfMeasurement());
            medicamentEntity.getActiveSubstances().add(medicamentActiveSubstancesEntity);
        }
        return medicamentEntity;
    }
    @PostMapping(value = "/add-import-request")
    public ResponseEntity<Integer> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
        LOGGER.debug("=====================\n=====================\nAdd Import\n=====================\n");


        if (requests.getImportAuthorizationEntity() == null) {
            throw new CustomException("/add-import-request Request was not found");
        }
        addDDDocument(requests);
        requestRepository.save(requests);
        LOGGER.debug("=====================\n=====================\nImport saved\n=====================\n");
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }


    @GetMapping(value = "/load-import-request")
    public ResponseEntity<RegistrationRequestsEntity> getImportById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea de Import nu a fost gasita");
        }
        RegistrationRequestsEntity rrE = regOptional.get();
//        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
//        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }
}
