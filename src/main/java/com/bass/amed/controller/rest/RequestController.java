package com.bass.amed.controller.rest;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.prices.CatalogPriceDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.repository.license.LicensesRepository;
import com.bass.amed.repository.prices.NmPricesRepository;
import com.bass.amed.repository.prices.PriceRepository;
import com.bass.amed.repository.prices.PricesHistoryRepository;
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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
    @Autowired
    private DocumentModuleDetailsRepository documentModuleDetailsRepository;
    @Autowired
    private NmPricesRepository nmPricesRepository;
    @Autowired
    private PricesHistoryRepository pricesHistoryRepository;
    @Autowired
    private LicensesRepository licensesRepository;

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
                    medicament.setName(medicament.getCommercialName() + " " + medicament.getPharmaceuticalForm().getCode() + " " + medicament.getDose() + " " + medicament.getDivision());
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
            medicamentEntities.stream().filter(med -> med.getStatus().equals("F")).forEach(med -> {
                fillDivisionHistory(medicamentHistoryEntity, med);
            });
            request.getMedicamentHistory().add(medicamentHistoryEntity);
        }
        else
        {
            MedicamentHistoryEntity medicamentHistoryEntity = request.getMedicamentHistory().stream().findFirst().get();
            NmMedicamentGroupEntity nmMedicamentGroupEntity = medicamentGroupRepository.findByCode(medicamentHistoryEntity.getGroupTo().getCode());
            medicamentHistoryEntity.setGroupTo(nmMedicamentGroupEntity);
        }
        if (request.getMedicaments() == null)
        {
            request.setMedicaments(new HashSet<>());
        }
        addDRDocument(request);
        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    private void fillDivisionHistory(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity med)
    {
        MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity = new MedicamentDivisionHistoryEntity();
        medicamentDivisionHistoryEntity.setDescription(med.getDivision());
        medicamentDivisionHistoryEntity.setOld(1);
        medicamentHistoryEntity.getDivisionHistory().add(medicamentDivisionHistoryEntity);
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

    @RequestMapping(value = "/load-medicament-history", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getMedicamentHistoryById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findMedicamentHistoryById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
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
        for (RegistrationRequestsEntity r : requests)
        {
            saved &= r.getId() != null;
        }

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }


    @Transactional
    @RequestMapping(value = "/add-prices", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> savePrices(@RequestBody List<PricesEntity> pricesRequests)
    {
        LOGGER.debug("add new prices");

        if(pricesRequests != null && pricesRequests.size() > 0) {
            for (PricesEntity p : pricesRequests) {
                if (p.getMedicament() != null && p.getMedicament().getId() != null) {
                    int type = p.getType().getId();
                    PricesEntity oldPrice = priceRepository.findOneByMedicamentIdAndType(p.getMedicament().getId(), type); //9 - Propus după modificarea originalului / 11 - Propus dupa modificarea valutei
                    if (oldPrice != null) {
                        p.setId(oldPrice.getId());
                    }
                }
            }
        }

        priceRepository.saveAll(pricesRequests);

        boolean saved = true;
        for (PricesEntity p : pricesRequests)
        {
            saved &= p.getId() != null;
        }

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }


    @Transactional
    @RequestMapping(value = "/approve-prices", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> approvePrices(@RequestBody List<PricesEntity> prices) {
        LOGGER.debug("approvePrices");
        List<PricesHistoryEntity> newHistoryPrices = new ArrayList<>(prices.size());

        for (PricesEntity p : prices) {
            PricesEntity oldPrice = priceRepository.findOneById(p.getId());
            p.setFolderNr(oldPrice.getFolderNr());
            newHistoryPrices.add(new PricesHistoryEntity(p.getNmPrice()));
            NmPricesEntity nmPrice = nmPricesRepository.findOneByMedicamentId(p.getMedicament().getId());

            if (nmPrice != null) {
                p.getNmPrice().setId(nmPrice.getId());
            }
        }

        priceRepository.saveAll(prices);
        pricesHistoryRepository.saveAll(newHistoryPrices);

        boolean saved = true;
        for (PricesEntity p : prices) {
            saved &= p.getId() != null;
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
        price.setReferencePrices(updatedPrice.getReferencePrices());


        request.setPrice(price);
        try
        {
            requestRepository.save(request);
        }
        catch (Exception ex)
        {
            throw new CustomException("A aparut o erroare la salvarea datelor");
        }
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }


    @RequestMapping(value = "/load-prices-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getPricesRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findPricesRequestById(id);
        if (regOptional.isPresent())
        {
            List<String> docTypes = Arrays.asList("A1", "DP", "NL" ,"FE", "LP");//OP,A1,A2,DP,CP,RF,RC,NL,RQ,CR,CC,PC
            List<NmDocumentTypesEntity> outputDocTypes = documentTypeRepository.findAll();
            outputDocTypes.removeIf(docType -> !docTypes.contains(docType.getCategory()));

            RegistrationRequestsEntity request = regOptional.get();
            PricesEntity price = (PricesEntity) Hibernate.unproxy(request.getPrice());
            request.setPrice(price);

            Set<OutputDocumentsEntity> outputDocs = new HashSet<>(docTypes.size());

            Set<DocumentsEntity> docs = request.getDocuments();

            outputDocTypes.forEach(docType -> {
                OutputDocumentsEntity outDoc = new OutputDocumentsEntity();
                outDoc.setDocType(docType);

                Optional<DocumentsEntity> foundDoc = docs.stream().filter(doc -> doc.getDocType().equals(docType)).findFirst();
                if (foundDoc.isPresent())
                {
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
        //Initial medicament entities
        List<MedicamentEntity> medicamentEntities = medicamentRepository.findByRegistrationNumber(request.getMedicamentPostauthorizationRegisterNr());
        medicamentEntities = medicamentEntities.stream().filter(m -> m.getStatus().equals("F")).collect(Collectors.toList());
        Optional<MedicamentHistoryEntity> medicamentHistoryEntityOpt = request.getMedicamentHistory().stream().findFirst();
        MedicamentHistoryEntity medicamentHistoryEntity = medicamentHistoryEntityOpt.orElse(new MedicamentHistoryEntity());
        //in medicament history save old changes
        Optional<MedicamentEntity> medicamentEntityOpt = medicamentEntities.stream().findFirst();
        MedicamentEntity medicamentEntityForUpdate = medicamentEntityOpt.orElse(new MedicamentEntity());
        MedicamentHistoryEntity medicamentHistoryEntityForUpdate = fillMedicamentHistoryDetails(request.getMedicamentPostauthorizationRegisterNr(), medicamentHistoryEntity, medicamentEntityForUpdate);
        fillHistoryDetailsTo(medicamentHistoryEntity, medicamentHistoryEntityForUpdate);

        addMedicamentDivisionHistory(medicamentEntities, medicamentHistoryEntity, medicamentHistoryEntityForUpdate, request);
        request.getMedicamentHistory().clear();
        request.getMedicamentHistory().add(medicamentHistoryEntityForUpdate);
        // Update old medicaments and change status of canceled medicaments (division was removed)
        for (MedicamentEntity med : medicamentEntities)
        {
            boolean isExistingDivisionInHistory = medicamentHistoryEntity.getDivisionHistory().stream().anyMatch(e -> e.getDescription().equals(med.getDivision()));
            if (isExistingDivisionInHistory)
            {
                med.assign(medicamentHistoryEntity);
                med.setName(med.getCommercialName() + " " + med.getPharmaceuticalForm().getCode() + " " + med.getDose() + " " + med.getDivision());
                medicamentRepository.save(med);
            }
            else
            {
                med.setStatus("C");
                medicamentRepository.save(med);
            }
        }
        return new ResponseEntity<>(requestRepository.save(request), HttpStatus.OK);
    }

    private void fillHistoryDetailsTo(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        medicamentHistoryEntityForUpdate.setInternationalMedicamentNameTo(medicamentHistoryEntity.getInternationalMedicamentNameTo());
        medicamentHistoryEntityForUpdate.setDoseTo(medicamentHistoryEntity.getDoseTo());
        medicamentHistoryEntityForUpdate.setPharmaceuticalFormTo(medicamentHistoryEntity.getPharmaceuticalFormTo());
        medicamentHistoryEntityForUpdate.setAuthorizationHolderTo(medicamentHistoryEntity.getAuthorizationHolderTo());
        medicamentHistoryEntityForUpdate.setMedicamentTypeTo(medicamentHistoryEntity.getMedicamentTypeTo());
        medicamentHistoryEntityForUpdate.setGroupTo(medicamentHistoryEntity.getGroupTo());
        medicamentHistoryEntityForUpdate.setPrescriptionTo(medicamentHistoryEntity.getPrescriptionTo());
        medicamentHistoryEntityForUpdate.setVolumeTo(medicamentHistoryEntity.getVolumeTo());
        medicamentHistoryEntityForUpdate.setVolumeQuantityMeasurementTo(medicamentHistoryEntity.getVolumeQuantityMeasurementTo());
        medicamentHistoryEntityForUpdate.setTermsOfValidityTo(medicamentHistoryEntity.getTermsOfValidityTo());
        medicamentHistoryEntityForUpdate.setAtcCodeTo(medicamentHistoryEntity.getAtcCodeTo());
        medicamentHistoryEntityForUpdate.setCommercialNameTo(medicamentHistoryEntity.getCommercialNameTo());
        medicamentHistoryEntityForUpdate.setStatus("F");
    }

    private void addMedicamentDivisionHistory(List<MedicamentEntity> medicamentEntities, MedicamentHistoryEntity medicamentHistoryEntity,
                                              MedicamentHistoryEntity medicamentHistoryEntityForUpdate,
                                              RegistrationRequestsEntity request)
    {
        for (MedicamentEntity med : medicamentEntities)
        {
            boolean isExistingDivisionInHistory = medicamentHistoryEntity.getDivisionHistory().stream().anyMatch(e -> e.getDescription().equals(med.getDivision()));
            MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity = new MedicamentDivisionHistoryEntity();
            medicamentDivisionHistoryEntity.setDescription(med.getDivision());
            medicamentDivisionHistoryEntity.setMedicamentId(med.getId());
            medicamentDivisionHistoryEntity.setStatus(isExistingDivisionInHistory ? "M" : "R");
            medicamentDivisionHistoryEntity.setMedicamentCode(med.getCode());
            medicamentHistoryEntityForUpdate.getDivisionHistory().add(medicamentDivisionHistoryEntity);
        }
        for (MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity : medicamentHistoryEntity.getDivisionHistory())
        {
            boolean isExistingDivisionInMedicament = medicamentEntities.stream().anyMatch(e -> e.getDivision().equals(medicamentDivisionHistoryEntity.getDescription()));
            if (!isExistingDivisionInMedicament)
            {
                MedicamentEntity medicamentEntity = fillMedicamentDetails(request.getMedicamentPostauthorizationRegisterNr(), medicamentHistoryEntity, medicamentDivisionHistoryEntity.getDescription());
                medicamentRepository.save(medicamentEntity);
                request.getMedicaments().add(medicamentEntity);
                MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity1 = new MedicamentDivisionHistoryEntity();
                medicamentDivisionHistoryEntity1.setDescription(medicamentDivisionHistoryEntity.getDescription());
                medicamentDivisionHistoryEntity1.setMedicamentId(medicamentEntity.getId());
                medicamentDivisionHistoryEntity1.setStatus("N");
                medicamentDivisionHistoryEntity1.setMedicamentCode(medicamentEntity.getCode());
                medicamentHistoryEntityForUpdate.getDivisionHistory().add(medicamentDivisionHistoryEntity1);
            }
        }
    }

    private MedicamentHistoryEntity fillMedicamentHistoryDetails(Integer regNr, MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntityForUpdate)
    {
        MedicamentHistoryEntity medicamentHistoryEntityForUpdate = new MedicamentHistoryEntity();
        medicamentHistoryEntityForUpdate.setCommercialNameFrom(medicamentEntityForUpdate.getCommercialName());
        medicamentHistoryEntityForUpdate.setInternationalMedicamentNameFrom(medicamentEntityForUpdate.getInternationalMedicamentName());
        medicamentHistoryEntityForUpdate.setDoseFrom(medicamentEntityForUpdate.getDose());
        medicamentHistoryEntityForUpdate.setPharmaceuticalFormFrom(medicamentEntityForUpdate.getPharmaceuticalForm());
        medicamentHistoryEntityForUpdate.setAuthorizationHolderFrom(medicamentEntityForUpdate.getAuthorizationHolder());
        medicamentHistoryEntityForUpdate.setMedicamentTypeFrom(medicamentEntityForUpdate.getMedicamentType());
        medicamentHistoryEntityForUpdate.setGroupFrom(medicamentEntityForUpdate.getGroup());
        medicamentHistoryEntityForUpdate.setPrescriptionFrom(medicamentEntityForUpdate.getPrescription());
        medicamentHistoryEntityForUpdate.setAtcCodeFrom(medicamentEntityForUpdate.getAtcCode());
        medicamentHistoryEntityForUpdate.setVolumeFrom(medicamentEntityForUpdate.getVolume());
        medicamentHistoryEntityForUpdate.setTermsOfValidityFrom(medicamentEntityForUpdate.getTermsOfValidity());
        medicamentHistoryEntityForUpdate.setVolumeQuantityMeasurementFrom(medicamentEntityForUpdate.getVolumeQuantityMeasurement());
        checkActiveSubstancesModifications(medicamentHistoryEntity, medicamentEntityForUpdate, medicamentHistoryEntityForUpdate);
        checkManufacturesModifications(medicamentHistoryEntity, medicamentEntityForUpdate, medicamentHistoryEntityForUpdate);
        medicamentHistoryEntityForUpdate.setExperts(medicamentHistoryEntity.getExperts());
        medicamentHistoryEntityForUpdate.setRegistrationNumber(regNr);
        medicamentHistoryEntityForUpdate.setChangeDate(LocalDateTime.now());
        medicamentHistoryEntity.setStatus("F");
        return medicamentHistoryEntityForUpdate;
    }

    private void checkActiveSubstancesModifications(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntityForUpdate, MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        for (MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity : medicamentEntityForUpdate.getActiveSubstances())
        {
            MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryForUpdateEntity = new MedicamentActiveSubstancesHistoryEntity();
            Optional<MedicamentActiveSubstancesHistoryEntity> medicamentActiveSubstancesHistoryEntityOpt =
                    medicamentHistoryEntity.getActiveSubstancesHistory().stream().filter(t -> t.getActiveSubstance().getId() == medicamentActiveSubstancesEntity.getActiveSubstance().getId()).findFirst();
            if (medicamentActiveSubstancesHistoryEntityOpt.isPresent())
            {
                MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity = medicamentActiveSubstancesHistoryEntityOpt.get();
                medicamentActiveSubstancesHistoryForUpdateEntity.setActiveSubstance(medicamentActiveSubstancesEntity.getActiveSubstance());
                medicamentActiveSubstancesHistoryForUpdateEntity.setManufactureFrom(medicamentActiveSubstancesEntity.getManufacture());
                medicamentActiveSubstancesHistoryForUpdateEntity.setQuantityFrom(medicamentActiveSubstancesEntity.getQuantity());
                medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurementFrom(medicamentActiveSubstancesEntity.getUnitsOfMeasurement());
                medicamentActiveSubstancesHistoryForUpdateEntity.setStatus("M");
                if (!medicamentActiveSubstancesHistoryEntity.getManufactureTo().equals(medicamentActiveSubstancesEntity.getManufacture())
                || !medicamentActiveSubstancesHistoryEntity.getQuantityTo().equals(medicamentActiveSubstancesEntity.getQuantity())
                || !medicamentActiveSubstancesHistoryEntity.getUnitsOfMeasurementTo().equals(medicamentActiveSubstancesEntity.getUnitsOfMeasurement()))
                {
                    medicamentActiveSubstancesHistoryForUpdateEntity.setManufactureTo(medicamentActiveSubstancesHistoryEntity.getManufactureTo());
                    medicamentActiveSubstancesHistoryForUpdateEntity.setQuantityTo(medicamentActiveSubstancesHistoryEntity.getQuantityTo());
                    medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurementTo(medicamentActiveSubstancesHistoryEntity.getUnitsOfMeasurementTo());
                    medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryForUpdateEntity);
                }
            }
            else
            {
                medicamentActiveSubstancesHistoryForUpdateEntity.setActiveSubstance(medicamentActiveSubstancesEntity.getActiveSubstance());
                medicamentActiveSubstancesHistoryForUpdateEntity.setManufactureFrom(medicamentActiveSubstancesEntity.getManufacture());
                medicamentActiveSubstancesHistoryForUpdateEntity.setQuantityFrom(medicamentActiveSubstancesEntity.getQuantity());
                medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurementFrom(medicamentActiveSubstancesEntity.getUnitsOfMeasurement());
                medicamentActiveSubstancesHistoryForUpdateEntity.setStatus("R");
                medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryForUpdateEntity);
            }
        }
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity : medicamentHistoryEntity.getActiveSubstancesHistory())
        {
            Optional<MedicamentActiveSubstancesEntity> medicamentActiveSubstancesEntity =
                    medicamentEntityForUpdate.getActiveSubstances().stream().filter(t -> t.getActiveSubstance().getId() == medicamentActiveSubstancesHistoryEntity.getActiveSubstance().getId()).findFirst();
            if (!medicamentActiveSubstancesEntity.isPresent())
            {
                medicamentActiveSubstancesHistoryEntity.setStatus("N");
                medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryEntity);
            }
        }
    }

    private void checkManufacturesModifications(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntityForUpdate,
                                                MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        for (MedicamentManufactureEntity medicamentManufactureEntity : medicamentEntityForUpdate.getManufactures())
        {
            MedicamentManufactureHistoryEntity medicamentManufactureHistoryForUpdateEntity = new MedicamentManufactureHistoryEntity();
            Optional<MedicamentManufactureHistoryEntity> medicamentManufactureHistoryEntityOpt =
                    medicamentHistoryEntity.getManufacturesHistory().stream().filter(t -> t.getManufacture().getId() == medicamentManufactureEntity.getManufacture().getId()).findFirst();
            if (medicamentManufactureHistoryEntityOpt.isPresent())
            {
                MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity = medicamentManufactureHistoryEntityOpt.get();
                medicamentManufactureHistoryForUpdateEntity.setManufacture(medicamentManufactureEntity.getManufacture());
                medicamentManufactureHistoryForUpdateEntity.setProducatorProdusFinitFrom(medicamentManufactureEntity.getProducatorProdusFinit());
                medicamentManufactureHistoryForUpdateEntity.setStatus("M");
                if (!medicamentManufactureHistoryEntity.getProducatorProdusFinitTo().equals(medicamentManufactureEntity.getProducatorProdusFinit()))
                {
                    medicamentManufactureHistoryForUpdateEntity.setProducatorProdusFinitTo(medicamentManufactureHistoryEntity.getProducatorProdusFinitTo());
                    medicamentHistoryEntityForUpdate.getManufacturesHistory().add(medicamentManufactureHistoryForUpdateEntity);
                }
            }
            else
            {
                medicamentManufactureHistoryForUpdateEntity.setProducatorProdusFinitFrom(medicamentManufactureEntity.getProducatorProdusFinit());
                medicamentManufactureHistoryForUpdateEntity.setManufacture(medicamentManufactureEntity.getManufacture());
                medicamentManufactureHistoryForUpdateEntity.setStatus("R");
                medicamentHistoryEntityForUpdate.getManufacturesHistory().add(medicamentManufactureHistoryForUpdateEntity);
            }
        }
        for (MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity : medicamentHistoryEntity.getManufacturesHistory())
        {
            Optional<MedicamentManufactureEntity> medicamentManufactureEntity =
                    medicamentEntityForUpdate.getManufactures().stream().filter(t -> t.getManufacture().getId() == medicamentManufactureHistoryEntity.getManufacture().getId()).findFirst();
            if (!medicamentManufactureEntity.isPresent())
            {
                medicamentManufactureHistoryEntity.setStatus("N");
                medicamentHistoryEntityForUpdate.getManufacturesHistory().add(medicamentManufactureHistoryEntity);
            }
        }
    }

    private MedicamentEntity fillMedicamentDetails(Integer regNr, MedicamentHistoryEntity medicamentHistoryEntity, String division)
    {
        MedicamentEntity medicamentEntity = new MedicamentEntity();
        setCodeAndRegistrationNr(medicamentEntity, regNr);
        medicamentEntity.setStatus("F");
        medicamentEntity.setCommercialName(medicamentHistoryEntity.getCommercialNameTo());
        medicamentEntity.setInternationalMedicamentName(medicamentHistoryEntity.getInternationalMedicamentNameTo());
        medicamentEntity.setExpirationDate(java.sql.Date.valueOf(LocalDate.now().plusYears(5)));
        medicamentEntity.setDose(medicamentHistoryEntity.getDoseTo());
        medicamentEntity.setPharmaceuticalForm(medicamentHistoryEntity.getPharmaceuticalFormTo());
        medicamentEntity.setAuthorizationHolder(medicamentHistoryEntity.getAuthorizationHolderTo());
        medicamentEntity.setMedicamentType(medicamentHistoryEntity.getMedicamentTypeTo());
        medicamentEntity.setGroup(medicamentHistoryEntity.getGroupTo());
        medicamentEntity.setPrescription(medicamentHistoryEntity.getPrescriptionTo());
        medicamentEntity.setVolume(medicamentHistoryEntity.getVolumeTo());
        medicamentEntity.setTermsOfValidity(medicamentHistoryEntity.getTermsOfValidityTo());
        medicamentEntity.setExperts(medicamentHistoryEntity.getExperts());
        medicamentEntity.setVolumeQuantityMeasurement(medicamentHistoryEntity.getVolumeQuantityMeasurementTo());
        medicamentEntity.setAtcCode(medicamentHistoryEntity.getAtcCodeTo());
        medicamentEntity.setDivision(division);
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistEntity : medicamentHistoryEntity.getActiveSubstancesHistory())
        {
            MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity = new MedicamentActiveSubstancesEntity();
            medicamentActiveSubstancesEntity.setActiveSubstance(medicamentActiveSubstancesHistEntity.getActiveSubstance());
            medicamentActiveSubstancesEntity.setManufacture(medicamentActiveSubstancesHistEntity.getManufactureTo());
            medicamentActiveSubstancesEntity.setQuantity(medicamentActiveSubstancesHistEntity.getQuantityTo());
            medicamentActiveSubstancesEntity.setUnitsOfMeasurement(medicamentActiveSubstancesHistEntity.getUnitsOfMeasurementTo());
            medicamentEntity.getActiveSubstances().add(medicamentActiveSubstancesEntity);
        }
        for (MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity : medicamentHistoryEntity.getManufacturesHistory())
        {
            MedicamentManufactureEntity medicamentManufactureEntity = new MedicamentManufactureEntity();
            medicamentManufactureEntity.setManufacture(medicamentManufactureHistoryEntity.getManufacture());
            medicamentManufactureEntity.setProducatorProdusFinit(medicamentManufactureHistoryEntity.getProducatorProdusFinitTo());
            medicamentEntity.getManufactures().add(medicamentManufactureEntity);
        }
        return medicamentEntity;
    }

    @PostMapping("/add-document-request")
    public ResponseEntity<DocumentModuleDetailsEntity> addDocumentRequest(@RequestBody DocumentModuleDetailsEntity request)
    {
        LOGGER.info("Add document registration request");
        documentModuleDetailsRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    @PostMapping(value = "/get-requests-by-registration-number")
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsByRegistrationNumber(@RequestBody Integer registrationNumber) throws CustomException
    {
        Optional<List<RegistrationRequestsEntity>> registrationRequestsEntities = requestRepository.findMedicamentHistoryByRegistrationNumber(registrationNumber);
        return new ResponseEntity<>(registrationRequestsEntities.orElse(new ArrayList<>()), HttpStatus.CREATED);
    }



//    @RequestMapping(value = "/add-import-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<RegistrationRequestsEntity> saveImportRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
//    {
//        System.out.println("\n\n\n\n=====================\nAdd Import\n=====================\n\n\n");
//        return null;
//    }

	@RequestMapping(value = "/add-import-request"/*, method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE*/)
	public ResponseEntity<RegistrationRequestsEntity> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException{
    	LOGGER.debug("\n\n\n\n=====================\nAdd Import\n=====================\n\n\n");


        if (requests.getImportAuthorizationEntity() == null) {
            throw new CustomException("/add-import-request Threw an error, requests.getImportAuthorizationEntity() == null");
        }

        if (requests.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList()!=null) {

            for (ImportAuthorizationDetailsEntity medNotGer: requests.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList()) {
                if (medNotGer.getCodeAmed()==null){
                    medNotGer.setCodeAmed(Utils.generateMedicamentCode());
                }
            }
        } else {
            System.out.println("\n\n\n\n=====================\ngetImportAuthorizationEntity is null\n=====================\n\n\n");
        }

//        requests.setMedicaments(null);
        LOGGER.debug("MED=============="+requests.getMedicaments());
        requestRepository.save(requests);
        //TODO fix the docs
//        addDDDocument(requests);
        LOGGER.debug("\n\n\n\n=====================\nImport saved\n=====================\n\n\n");

        return new ResponseEntity<>(requests, HttpStatus.CREATED);
    }


    @GetMapping(value = "/load-import-request")
    public ResponseEntity<RegistrationRequestsEntity> getImportById(@RequestParam(value = "id") Integer id) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findImportAuthRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea de Import nu a fost gasita");
        }
        RegistrationRequestsEntity rrE = regOptional.get();
//        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
//        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }

    @GetMapping(value = "/load-active-licenses")
    public ResponseEntity<LicensesEntity> getActiveLicensesByIdno(@RequestParam(value = "id") String idno) throws CustomException {
        Optional<LicensesEntity> regOptional = licensesRepository.getActiveLicenseByIdno(idno, new Date());
        if (!regOptional.isPresent()) {
//            throw new CustomException("Licenta nu a fost gasita");
            return null;

        }
        LicensesEntity rrE = regOptional.get();
//        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
//        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }

}
