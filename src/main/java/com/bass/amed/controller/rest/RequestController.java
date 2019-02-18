package com.bass.amed.controller.rest;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.AutorizationImportDataSet;
import com.bass.amed.dto.AutorizationImportDataSet2;
import com.bass.amed.dto.InterruptDetailsDTO;
import com.bass.amed.dto.ImportSpecificationDataSet;
import com.bass.amed.dto.ScheduledModuleResponse;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.repository.license.LicensesRepository;
import com.bass.amed.repository.prices.NmPricesRepository;
import com.bass.amed.repository.prices.PriceRepository;
import com.bass.amed.repository.prices.PricesHistoryRepository;
import com.bass.amed.service.AuditLogService;
import com.bass.amed.service.ClinicalTrailsService;
import com.bass.amed.service.MedicamentAnnihilationRequestService;
import com.bass.amed.utils.AmountUtils;
import com.bass.amed.utils.AuditUtils;
import com.bass.amed.utils.SecurityUtils;
import com.bass.amed.utils.Utils;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
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
    CtAmendMedInstInvestigatorRepository ctAmendMedInstInvestigatorRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private RequestTypeRepository requestTypeRepository;
    @Autowired
    private MedicamentGroupRepository medicamentGroupRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private MedicamentHistoryRepository medicamentHistoryRepository;
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
    private OutputDocumentsRepository outputDocumentsRepository;
    @Autowired
    private SysParamsRepository sysParamsRepository;
    @Autowired
    private LicensesRepository licensesRepository;
    @Autowired
    private ImportAuthorizationRepository importAuthorizationRepository;
    @Autowired
    private ImportAuthRepository importAuthRepository;
	@Autowired
    private InvoiceDetailsRepository invoiceDetailsRepository;
    @Autowired
    private CtMedINstInvestigatorRepository medINstInvestigatorRepository;
    @Autowired
    private MedicamentAnnihilationRequestService medicamentAnnihilationRequestService;
    @Autowired
    private MedicamentCodeSeqRepository medicamentCodeSeqRepository;
    @Autowired
    private ClinicalTrailsService clinicalTrailsService;
    @Autowired
    private SrcUserRepository srcUserRepository;
    @Autowired
    private NmVariationTypeRespository variationTypeRespository;
    @Autowired
    private AuditLogService auditLogService;
    @Value("${scheduler.rest.api.host}")
    private String schedulerRestApiHost;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @RequestMapping(value = "/add-gmp-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<RegistrationRequestsEntity> saveGMPRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add GMP");
        if (request.getType() != null)
        {
            Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
            request.getType().setId(type.get().getId());
        }
        request.setMedicaments(new HashSet<>());
        requestRepository.save(request);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/add-medicament-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<RegistrationRequestsEntity> saveMedicamentRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament");
        if (request.getType() != null)
        {
            Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
            request.getType().setId(type.get().getId());
        }

        RegistrationRequestsEntity requestOutDoc = null;
        List<OutputDocumentsEntity> initialDocuments = new ArrayList<>();
        RequestTypesEntity initialReqType = new RequestTypesEntity();
        if (request.getId() != null && request.getId() > 0)
        {
            requestOutDoc = requestRepository.findDocuments(request.getId()).orElse(new RegistrationRequestsEntity());
            initialDocuments.addAll(requestOutDoc.getOutputDocuments());
            initialReqType = requestOutDoc.getType();
        }
        if (request.getMedicaments() != null)
        {
            long cntSteps = request.getRequestHistories().stream().filter(t -> t.getStep().equals("X")).count();
            if (cntSteps == 0 && request.getCurrentStep().equals("X"))
            {
                Utils.jobUnschedule(schedulerRestApiHost, "/wait-evaluation-medicament-registration", request.getId());
            }
            if (request.getId() != null && request.getId() > 0)
            {
                RegistrationRequestsEntity requestDB = requestRepository.findById(request.getId()).orElse(new RegistrationRequestsEntity());
                for (DocumentsEntity doc : requestDB.getDocuments())
                {
                    if (doc.getDocType().getCategory().equals("DD") || doc.getDocType().getCategory().equals("OA"))
                    {
                        if (request.getDocuments().stream().noneMatch(t -> t.getDocType().getCategory().equals(doc.getDocType().getCategory())))
                        {
                            request.getDocuments().add(doc);
                        }
                    }
                }
                Optional<MedicamentEntity> medicamentEntityOpt = requestDB.getMedicaments().stream().filter(t -> t.getOaNumber() != null).findFirst();
                Optional<DocumentsEntity> documentsEntityOptional = request.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("CA")).findFirst();
                if (medicamentEntityOpt.isPresent() && !documentsEntityOptional.isPresent())
                {
                    throw new CustomException("Ordinul de autorizare al medicamentului a fost emis. Modificari asupra medicamentelor nu sunt permise.");
                }
                request.setDdIncluded(requestDB.getDdIncluded());
                request.setDdNumber(requestDB.getDdNumber());
                request.setExpiredDate(requestDB.getExpiredDate());
                request.setExpired(requestDB.getExpired());
                request.setCritical(requestDB.getCritical());
                request.setExpiredComment(requestDB.getExpiredComment());
                for (MedicamentEntity medicament : request.getMedicaments())
                {
                    for (MedicamentEntity medDB : requestDB.getMedicaments())
                    {
                        if (Utils.areDivisionsEquals(medicament, medDB))
                        {
                            medicament.setApproved(medDB.getApproved());
                            medicament.setOaNumber(medDB.getOaNumber());
                            break;
                        }
                    }
                }
            }
            //            MedicamentRegistrationNumberSequence medicamentRegistrationNumberSequence = new MedicamentRegistrationNumberSequence();
            //            generateMedicamentRegistrationNumberRepository.save(medicamentRegistrationNumberSequence);
            for (MedicamentEntity medicament : request.getMedicaments())
            {
                if (medicament.getStatus().equals("F"))
                {
                    Timestamp dateOfIssue =
                            request.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("OA")).findFirst().orElse(new DocumentsEntity()).getDateOfIssue();
                    setCodeAndRegistrationNr(medicament, dateOfIssue, request.getType().getCode());
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(dateOfIssue);
                    cal.add(Calendar.YEAR, 5);
                    medicament.setExpirationDate(new java.sql.Date(cal.getTime().getTime()));
                    medicament.setName(medicament.getCommercialName() + " " + medicament.getPharmaceuticalForm().getCode() + " " + medicament.getDose() + " " + Utils.getConcatenatedDivision(medicament));
                    medicament.setUnlimitedRegistrationPeriod(false);
                    if (request.getType().getCode().equals("MEDR"))
                    {
                        medicament.setExpirationDate(null);
                        medicament.setUnlimitedRegistrationPeriod(true);
                        medicamentRepository.setStatusExpiredForOldMedicament(medicament.getCode());
                    }
                }
            }
        }

        //addDDDocument(request);
        ZonedDateTime zonedDateTime = request.getStartDate().toInstant().atZone(ZoneId.of("Europe/Athens"));
        request.setExpiredDate(Timestamp.from(zonedDateTime.plus(210, ChronoUnit.DAYS).toInstant()));
        requestRepository.save(request);

        long cntSteps = request.getMedicaments().stream().filter(t -> t.getStatus().equals("F")).count();
        if (cntSteps > 0)
        {
            Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
        }

        RegistrationRequestsEntity requestDBAfterCommit = requestRepository.findById(request.getId()).orElse(new RegistrationRequestsEntity());
        setJobsForRequestAdditionalData(request, initialDocuments, 90, requestDBAfterCommit);
        if (cntSteps > 0)
        {
            AuditUtils.auditMedicamentRegistration(auditLogService, requestDBAfterCommit);
        }

        if (initialReqType.getCode() != null && !initialReqType.getCode().equals(request.getType().getCode()))
        {
            ResponseEntity<ScheduledModuleResponse> result = null;
            switch (initialReqType.getCode())
            {
                case "MEDF":
                case "MEDP":
                case "MEDR":
                    Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
                    result = Utils.jobSchedule(210, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
                    break;
                case "MEDG":
                    Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
                    result = Utils.jobSchedule(150, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
                    break;
                case "MEDS":
                    Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
                    result = Utils.jobSchedule(60, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
                    break;
            }
            if (result != null && !result.getBody().isSuccess())
            {
                throw new CustomException("Nu a putut fi setat termenul de eliberare al certificatului.");
            }

        }

        if (request.getMedicaments() == null || request.getMedicaments().isEmpty())
        {
            Utils.jobSchedule(5, "/wait-evaluation-medicament-registration", "/wait-evaluation-medicament-registration", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
        }

        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    @Transactional
    @RequestMapping(value = "/add-medicament-history-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> saveMedicamentHistoryRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add medicament history");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());
        RegistrationRequestsEntity requestOutDoc = null;
        List<OutputDocumentsEntity> initialDocuments = new ArrayList<>();
        if (request.getId() != null && request.getId() > 0)
        {
            requestOutDoc = requestRepository.findDocuments(request.getId()).orElse(new RegistrationRequestsEntity());
            initialDocuments.addAll(requestOutDoc.getOutputDocuments());
        }
        if (!request.getMedicamentHistory().isEmpty())
        {
            long cntSteps = request.getRequestHistories().stream().filter(t -> t.getStep().equals("X")).count();
            if (cntSteps == 0 && request.getCurrentStep().equals("X"))
            {
                Utils.jobUnschedule(schedulerRestApiHost, "/wait-evaluation-medicament-registration", request.getId());
            }
            MedicamentHistoryEntity medicamentHistoryEntity = request.getMedicamentHistory().stream().findFirst().get();
            medicamentHistoryEntity.setRequestId(request.getId());
            RegistrationRequestsEntity requestDB = requestRepository.findById(request.getId()).orElse(new RegistrationRequestsEntity());
            for (DocumentsEntity doc : requestDB.getDocuments())
            {
                if (doc.getDocType().getCategory().equals("DDM") || doc.getDocType().getCategory().equals("OM"))
                {
                    if (request.getDocuments().stream().noneMatch(t -> t.getDocType().getCategory().equals(doc.getDocType().getCategory())))
                    {
                        request.getDocuments().add(doc);
                    }
                }
            }
            MedicamentHistoryEntity medicamentHistoryEntityDB =
                    requestDB.getMedicamentHistory().stream().findFirst().orElse(new MedicamentHistoryEntity());
            if(medicamentHistoryEntityDB.getCommercialNameFrom()==null || medicamentHistoryEntityDB.getCommercialNameFrom().isEmpty()
            || medicamentHistoryEntityDB.getInternationalMedicamentNameFrom()==null
            || medicamentHistoryEntity.getPharmaceuticalFormFrom()==null)
            {
                List<MedicamentEntity> medicaments = medicamentRepository.findByRegistrationNumber(medicamentHistoryEntity.getRegistrationNumber());
                MedicamentEntity med =  medicaments.stream().filter(t->t.getStatus().equals("F")).findFirst().orElse(new MedicamentEntity());
                medicamentHistoryEntity.setInternationalMedicamentNameFrom(med.getInternationalMedicamentName());
                medicamentHistoryEntity.setDoseFrom(med.getDose());
                medicamentHistoryEntity.setPharmaceuticalFormFrom(med.getPharmaceuticalForm());
                medicamentHistoryEntity.setAuthorizationHolderFrom(med.getAuthorizationHolder());
                medicamentHistoryEntity.setPrescriptionFrom(med.getPrescription());
                medicamentHistoryEntity.setTermsOfValidityFrom(med.getTermsOfValidity());
                medicamentHistoryEntity.setAtcCodeFrom(med.getAtcCode());
                medicamentHistoryEntity.setCommercialNameFrom(med.getCommercialName());
                medicamentHistoryEntity.setOriginaleFrom(Boolean.TRUE.equals(med.getOriginale()));
                medicamentHistoryEntity.setOrphanFrom(Boolean.TRUE.equals(med.getOrphan()));
                medicamentHistoryEntity.setVitaleFrom(med.getVitale());
                medicamentHistoryEntity.setEsentialeFrom(med.getEsentiale());
                medicamentHistoryEntity.setNonesentialeFrom(med.getNonesentiale());
            }
            request.setDdIncluded(requestDB.getDdIncluded());
            request.setDdNumber(requestDB.getDdNumber());
            if (medicamentHistoryEntity.getId() != null && medicamentHistoryEntity.getId() > 0)
            {
                MedicamentHistoryEntity medDB = medicamentHistoryRepository.findById(medicamentHistoryEntity.getId()).orElse(new MedicamentHistoryEntity());
                medicamentHistoryEntity.setRegistrationDate(medDB.getRegistrationDate());
                medicamentHistoryEntity.setApproved(medDB.getApproved());
                medicamentHistoryEntity.setOmNumber(medDB.getOmNumber());
            }
        }

        if (request.getMedicaments() == null)
        {
            request.setMedicaments(new HashSet<>());
        }
        //addDRDocument(request);
        requestRepository.save(request);

        if (request.getMedicamentHistory().isEmpty())
        {
            Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
            ResponseEntity<ScheduledModuleResponse> result = Utils.jobSchedule(210, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
            Utils.jobSchedule(10, "/wait-evaluation-medicament-registration", "/wait-evaluation-medicament-registration", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
            if (result != null && !result.getBody().isSuccess())
            {
                throw new CustomException("Nu a putut fi setat termenul limita de aprobare a modificărilor postautorizare");
            }
        }
        if (request.getVariations() != null && !request.getVariations().isEmpty())
        {
            List<NmVariationTypeEntity> variationsNomenclator = variationTypeRespository.findAll();
            List<NmVariationTypeEntity> transCertCodes = variationsNomenclator.stream().filter(t -> t.getCode().equals("A.1")).collect(Collectors.toList());
            String variation = request.getVariations().stream().findFirst().orElse(new RequestVariationTypeEntity()).getValue();
            Integer transCertId = transCertCodes.stream().findFirst().orElse(new NmVariationTypeEntity()).getId();
            int time = 60;
            boolean transCert =
                    request.getVariations().size() == 1 && request.getVariations().stream().findFirst().orElse(new RequestVariationTypeEntity()).getVariation().getId().equals(transCertId);
            if (!transCert && variation.startsWith("IA"))
            {
                time = 30;
            }
            RegistrationRequestsEntity requestDBAfterCommit = requestRepository.findById(request.getId()).orElse(new RegistrationRequestsEntity());
            setJobsForRequestAdditionalData(request, initialDocuments, time, requestDBAfterCommit);
        }

        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    private void setJobsForRequestAdditionalData(@RequestBody RegistrationRequestsEntity request, List<OutputDocumentsEntity> initialDocuments, int time,
                                                 RegistrationRequestsEntity requestDBAfterCommit)
    {
        requestDBAfterCommit.getOutputDocuments().stream().forEach(t ->
                {
                    if (t.getDocType().getCategory().equals("SL") && t.getResponseReceived() != 1 && !Boolean.TRUE.equals(t.getJobScheduled()))
                    {
                        Utils.jobSchedule(time, "/wait-request-additional-data-response", "/wait-request-additional-data-response", requestDBAfterCommit.getId(), requestDBAfterCommit.getRequestNumber(), t.getId(), schedulerRestApiHost);
                        outputDocumentsRepository.setJobScheduled(t.getId(), true);
                    }
                    if (t.getDocType().getCategory().equals("SL") && t.getResponseReceived() == 1 && Boolean.TRUE.equals(t.getJobScheduled()))
                    {
                        Utils.jobUnschedule(schedulerRestApiHost, "/wait-request-additional-data-response" + t.getId(), requestDBAfterCommit.getId());
                        outputDocumentsRepository.setJobScheduled(t.getId(), false);
                    }
                }
        );

        if (!initialDocuments.isEmpty())
        {
            initialDocuments.stream().forEach(t ->
                    {
                        long cnt = request.getOutputDocuments().stream().filter(d -> d.getId() == t.getId()).count();
                        if (cnt == 0)
                        {
                            Utils.jobUnschedule(schedulerRestApiHost, "/wait-request-additional-data-response" + t.getId(), request.getId());
                        }
                    }
            );
        }
    }

    @RequestMapping(value = "/medicament-approved", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> saveMedicamentRequest(@RequestBody List<Integer> ids) throws CustomException
    {
        LOGGER.debug("Approve medicament");
        MedicamentEntity medicamentEntity = medicamentRepository.findById(ids.get(0)).orElse(new MedicamentEntity());
        RegistrationRequestsEntity registrationRequestsEntity = requestRepository.findById(medicamentEntity.getRequestId()).orElse(new RegistrationRequestsEntity());

        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(SecurityUtils.getCurrentUser().orElse(""));
        historyEntity.setStep("OA");
        historyEntity.setStartDate(new Timestamp(new Date().getTime()));
        historyEntity.setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        List<Integer> allMedicamentIds = new ArrayList<>();
        registrationRequestsEntity.getMedicaments().stream().forEach(t -> allMedicamentIds.add(t.getId()));
        medicamentRepository.approveMedicament(allMedicamentIds, false);
        medicamentRepository.approveMedicament(ids, true);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/medicament-modify-approved", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> saveMedicamentModifyRequest(@RequestBody Integer id) throws CustomException
    {
        LOGGER.debug("Approve medicament modifications");
        RegistrationRequestsEntity registrationRequestsEntity = requestRepository.findById(id).orElse(new RegistrationRequestsEntity());

        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(SecurityUtils.getCurrentUser().orElse(""));
        historyEntity.setStep("OM");
        historyEntity.setStartDate(new Timestamp(new Date().getTime()));
        historyEntity.setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        medicamentRepository.approveMedicamentModify(registrationRequestsEntity.getMedicamentHistory().stream().findFirst().orElse(new MedicamentHistoryEntity()).getId(), true);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void fillDivisionHistory(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity med)
    {
        MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity = new MedicamentDivisionHistoryEntity();
        medicamentDivisionHistoryEntity.setDescription(med.getDivision());
        medicamentDivisionHistoryEntity.setOld(1);
        medicamentHistoryEntity.getDivisionHistory().add(medicamentDivisionHistoryEntity);
    }

    private void setCodeAndRegistrationNr(@RequestBody MedicamentEntity medicament, Timestamp orderDate, String type)
    {
        //medicament.setRegistrationNumber(regNumber);
        medicament.setRegistrationDate(orderDate);
        if (!type.equals("MEDR"))
        {
            MedicamentEntity medicamentEntity;
            String generatedCode = "";
            do
            {
                MedicamentCodeSequenceEntity seq = new MedicamentCodeSequenceEntity();
                medicamentCodeSeqRepository.save(seq);
                generatedCode = Utils.generateMedicamentCode(seq.getId());
                medicamentEntity = medicamentRepository.findByCode(generatedCode);
            }
            while (medicamentEntity != null);
            medicament.setCode(generatedCode);
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
                    if (med.getExperts() != null && med.getExperts().getId() != null && med.getExperts().getId() > 0)
                    {
                        for (MedicamentEntity medicament : registrationRequestsEntity.getMedicaments())
                        {
                            medicament.setExperts(med.getExperts());
                        }
                    }
                }
            }
            registrationRequestsEntity.getRequestHistories().add((RegistrationRequestHistoryEntity) request.getRequestHistories().toArray()[0]);
            //addInterruptionOrder(registrationRequestsEntity);
            if (registrationRequestsEntity.getMedicaments().isEmpty())
            {
                registrationRequestsEntity.getMedicaments().addAll(request.getMedicaments());
            }
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
            if(optBody.isPresent() && optBody.get().getExperts()!=null)
            {
            optDB.get().setExperts(optBody.get().getExperts());
            }
            registrationRequestsEntity.getRequestHistories().add((RegistrationRequestHistoryEntity) request.getRequestHistories().toArray()[0]);
            //addInterruptionOrder(registrationRequestsEntity);
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

    @RequestMapping(value = "/load-gmp-details", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadGMPDetailsByRequestId(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findGMPRequestById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/get-old-request-id-by-medicament-regnr", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> getOldRequestIdByMedicamentRegNr(@RequestParam(value = "regNr") String regNr)
    {
        List<MedicamentEntity> medicamentEntities = medicamentRepository.findByRegistrationNumber(Integer.valueOf(regNr));
        return new ResponseEntity<>(medicamentEntities.get(0).getRequestId(), HttpStatus.OK);
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


    @Transactional
    @RequestMapping(value = "/add-prices-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> savePricesRequests(@RequestBody List<RegistrationRequestsEntity> requests)
    {
        LOGGER.debug("add new prices requests");
        List<RegistrationRequestsEntity> oldRegistrations = new ArrayList<>();
        requests.forEach(r -> {
            if (r.getType().getCode().equals("CPMED"))
            {
                r.setCurrentStep("I");
            }
            Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(r.getType().getCode());
            r.setType(type.get());

            if(r.getId() != null) {
                EntityManager em = entityManagerFactory.createEntityManager();
                RegistrationRequestsEntity oldRequest = em.find(RegistrationRequestsEntity.class, r.getId());
                oldRequest.getRegistrationRequestMandatedContacts().size();
                PricesEntity oldPrice =  oldRequest.getPrice();
                if(oldPrice != null) {
                    oldPrice.getMedicament();
                    oldPrice.getNmPrice();
                    oldPrice.getType();
                    oldPrice.getReferencePrices().size();
                }
                em.detach(oldRequest);
                oldRegistrations.add(oldRequest);
                em.close();
            }
        });

        requestRepository.saveAll(requests);

        requests.forEach(r ->
            AuditUtils.auditOnePriceRegistration(auditLogService, oldRegistrations.stream().filter(o -> o.getId().equals(r.getId())).findFirst().orElse(new RegistrationRequestsEntity()),r)
        );

        return new ResponseEntity<>(requests, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/add-reg-request-price", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> addRegistrationRequestForPrice(@RequestBody RegistrationRequestsEntity request)
    {
        LOGGER.debug("add new prices requests");
        RegistrationRequestsEntity   oldRequest = null;
        request.setType(requestTypeRepository.findByCode("CPMED").get());
        if (request.getId() != null)
        {
            EntityManager em = entityManagerFactory.createEntityManager();
            oldRequest = em.find(RegistrationRequestsEntity.class, request.getId());
            oldRequest.getRegistrationRequestMandatedContacts().size();
            em.detach(oldRequest);
            em.close();
        }
        requestRepository.save(request);

        AuditUtils.auditOnePriceRegistration(auditLogService, oldRequest, request);

        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }


    @Transactional
    @RequestMapping(value = "/add-reg-request-gdp", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> addRegistrationRequestForGDP(@RequestBody RegistrationRequestsEntity request)
    {
        LOGGER.debug("add new gdp requests");
        RegistrationRequestsEntity   oldRequest = null;
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.setType(type.get());

        if (request.getId() != null)
        {
            EntityManager em = entityManagerFactory.createEntityManager();
            oldRequest = em.find(RegistrationRequestsEntity.class, request.getId());
            oldRequest.getRegistrationRequestMandatedContacts().size();
            GDPInspectionEntity e = oldRequest.getGdpInspection();
            if(e != null) {
                e.getInspectors();
                e.getPeriods();
                e.getSubsidiaries();
            }
            em.detach(oldRequest);
            em.close();
        }

        request = requestRepository.save(request);

        AuditUtils.auditGDP(auditLogService, oldRequest, request);

        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }


    @RequestMapping(value = "/load-gdp-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getGDPRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findGDPRequestById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @Transactional
    @RequestMapping(value = "/remove-price-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public void removeRequest(@RequestParam(value = "requestNumber") String requestNumber)
    {
        LOGGER.info("Remove request number: " + requestNumber);
        requestRepository.deleteByRequestNumber(requestNumber);
    }


    @Transactional
    @RequestMapping(value = "/add-prices", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> savePrices(@RequestBody List<PricesEntity> pricesRequests)
    {
        LOGGER.debug("add new prices");

        if (pricesRequests != null && pricesRequests.size() > 0)
        {
            for (PricesEntity p : pricesRequests)
            {
                if (p.getMedicament() != null && p.getMedicament().getId() != null)
                {
                    int type = p.getType().getId();
                    PricesEntity oldPrice = priceRepository.findOneByMedicamentIdAndType(p.getMedicament().getId(), type); //9 - Propus după modificarea originalului / 11 - Propus dupa modificarea valutei
                    if (oldPrice != null)
                    {
                        p.setId(oldPrice.getId());
                        p.setFolderNr(oldPrice.getFolderNr());
                    }
                    try {
                        AuditUtils.auditPriceEntityGenericReval(auditLogService, oldPrice, p);
                    } catch (Exception e) {}
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
    public ResponseEntity<Boolean> approvePrices(@RequestBody List<PricesEntity> prices)
    {
        LOGGER.debug("approvePrices");
        List<PricesHistoryEntity> newHistoryPrices = new ArrayList<>(prices.size());

        for (PricesEntity p : prices)
        {
            newHistoryPrices.add(new PricesHistoryEntity(p.getNmPrice()));
            List<NmPricesEntity> nmPrices = nmPricesRepository.findOneByMedicamentId(p.getMedicament().getId());

            if (nmPrices != null && nmPrices.size() > 0)
            {
                p.getNmPrice().setId(nmPrices.get(0).getId());
            }
            try {
                AuditUtils.auditNmPriceApproved(auditLogService, nmPrices.get(0), p.getNmPrice());
            } catch (Exception e) {}
        }

        priceRepository.saveAll(prices);
        pricesHistoryRepository.saveAll(newHistoryPrices);

        boolean saved = true;
        for (PricesEntity p : prices)
        {
            saved &= p.getId() != null;
        }

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/add-price-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> savePriceRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("add new price request");
        RegistrationRequestsEntity oldRequest = null;
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.setType(type.get());

        if (request.getId() != null)
        {
            EntityManager em = entityManagerFactory.createEntityManager();
            oldRequest = em.find(RegistrationRequestsEntity.class, request.getId());
            oldRequest.getRegistrationRequestMandatedContacts().size();
            PricesEntity oldPrice = oldRequest.getPrice();
            if(oldPrice != null) {
                oldPrice.getNmPrice();
                oldPrice.getType();
                oldPrice.getMedicament();
                oldPrice.getReferencePrices().size();
            }
            em.detach(oldRequest);
            em.close();
        }

        PricesEntity updatedPrice = request.getPrice();
        PricesEntity price = priceRepository.findOneById(updatedPrice.getId());
        price.setType(updatedPrice.getType());
        price.setValue(updatedPrice.getValue());
        price.setMdlValue(updatedPrice.getMdlValue());
        price.setReferencePrices(updatedPrice.getReferencePrices());

        //        request.getDocuments().removeIf(r -> r.getId() == 2236);

        request.setPrice(price);
        try
        {
            requestRepository.save(request);
            if (request.getCurrentStep().equals("AF") || request.getCurrentStep().equals("C"))
            {
                changeBaseRequestStatus(request.getRequestNumber());
        }
        }
        catch (Exception ex)
        {
            throw new CustomException(ex.getMessage());
        }

        AuditUtils.auditOnePriceRegistration(auditLogService, oldRequest, request);


        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    private void changeBaseRequestStatus(String requestNumber)
    {
        if (requestNumber.contains("/"))
        {
            String baseRequestNumber = requestNumber.substring(0, requestNumber.indexOf("/"));
            List<Integer> unfinishedRequestsIds = requestRepository.getUnfinishedRequests(baseRequestNumber);
            if (unfinishedRequestsIds.isEmpty())
            {
                Optional<RegistrationRequestsEntity> baseRegRequestOpt = requestRepository.getBaseReqistrationRequest(baseRequestNumber);
                if (baseRegRequestOpt.isPresent())
                {
                    RegistrationRequestsEntity baseRegRequest = baseRegRequestOpt.get();
                    baseRegRequest.setCurrentStep("F");
                    requestRepository.save(baseRegRequest);
                }
            }
        }
    }


    @RequestMapping(value = "/load-prices-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getPricesRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findPricesRequestById(id);
        if (regOptional.isPresent())
        {
            List<String> docTypes = Arrays.asList("FE");//OP,A1,A2,DP,CP,RF,RC,NL,RQ,CR,CC,PC,LP
            List<NmDocumentTypesEntity> outputDocTypes = documentTypeRepository.findAll();
            outputDocTypes.removeIf(docType -> !docTypes.contains(docType.getCategory()));

            RegistrationRequestsEntity request = regOptional.get();
            Set<RegistrationRequestMandatedContactEntity> contacts = (Set<RegistrationRequestMandatedContactEntity>) Hibernate.unproxy(request.getRegistrationRequestMandatedContacts());
            if (!contacts.isEmpty())
            {
                Iterator iter = contacts.iterator();
                Object first = iter.next();
            }
            request.setRegistrationRequestMandatedContacts(contacts);
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
        List<MedicamentEntity> medicamentEntitiesT = new ArrayList<>();
        for (MedicamentEntity m : medicamentEntities)
        {
            MedicamentEntity mTemp = new MedicamentEntity();
            mTemp.assign(m);
            medicamentEntitiesT.add(mTemp);
        }
        Optional<MedicamentHistoryEntity> medicamentHistoryEntityOpt = request.getMedicamentHistory().stream().findFirst();
        MedicamentHistoryEntity medicamentHistoryEntity = medicamentHistoryEntityOpt.orElse(new MedicamentHistoryEntity());
        //in medicament history save old changes
        Optional<MedicamentEntity> medicamentEntityOpt = medicamentEntities.stream().findFirst();
        MedicamentEntity medicamentEntityForUpdate = medicamentEntityOpt.orElse(new MedicamentEntity());
        MedicamentHistoryEntity medicamentHistoryEntityForUpdate = fillMedicamentHistoryDetails(request.getMedicamentPostauthorizationRegisterNr(), medicamentHistoryEntity, medicamentEntityForUpdate);
        fillHistoryDetailsTo(medicamentHistoryEntity, medicamentHistoryEntityForUpdate);
        checkInstructionsHistory(medicamentEntities, medicamentHistoryEntity, medicamentHistoryEntityForUpdate);
        addMedicamentDivisionHistory(medicamentEntities, medicamentHistoryEntity, medicamentHistoryEntityForUpdate, request);
        request.getMedicamentHistory().clear();
        request.getMedicamentHistory().add(medicamentHistoryEntityForUpdate);
        // Update old medicaments and change status of canceled medicaments (division was removed)
        for (MedicamentEntity med : medicamentEntities)
        {
            boolean isExistingDivisionInHistory = medicamentHistoryEntity.getDivisionHistory().stream().anyMatch(e -> Utils.areDivisionHistoryEqualsWithMedicament(e, med));
            if (isExistingDivisionInHistory)
            {
              MedicamentDivisionHistoryEntity divisionHistory =  medicamentHistoryEntity.getDivisionHistory().stream().filter(e -> Utils.areDivisionHistoryEqualsWithMedicament(e,
                    med)).findFirst().orElse(new MedicamentDivisionHistoryEntity());
                med.assign(medicamentHistoryEntity, divisionHistory);
                med.setName(med.getCommercialName() + " " + med.getPharmaceuticalForm().getCode() + " " + med.getDose() + " " + Utils.getConcatenatedDivision(med));
                medicamentRepository.save(med);
            }
            else
            {
                med.setStatus("C");
                medicamentRepository.save(med);
            }
        }
        requestRepository.save(request);
        Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());

        List<MedicamentEntity> medicamentsAfterSaveEntities = medicamentRepository.findByRegistrationNumber(request.getMedicamentPostauthorizationRegisterNr());
        AuditUtils.auditMedicamentPostAuthorization(auditLogService, medicamentEntitiesT, medicamentsAfterSaveEntities.stream().filter(m -> m.getStatus().equals("F")).collect(Collectors.toList()), request, medicamentHistoryEntity.getOmNumber());
        return new ResponseEntity<>(request, HttpStatus.OK);
    }

    private void fillHistoryDetailsTo(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        medicamentHistoryEntityForUpdate.setInternationalMedicamentNameTo(medicamentHistoryEntity.getInternationalMedicamentNameTo());
        medicamentHistoryEntityForUpdate.setDoseTo(medicamentHistoryEntity.getDoseTo());
        medicamentHistoryEntityForUpdate.setPharmaceuticalFormTo(medicamentHistoryEntity.getPharmaceuticalFormTo());
        medicamentHistoryEntityForUpdate.setAuthorizationHolderTo(medicamentHistoryEntity.getAuthorizationHolderTo());
        medicamentHistoryEntityForUpdate.setVitaleTo(medicamentHistoryEntity.getVitaleTo());
        medicamentHistoryEntityForUpdate.setEsentialeTo(medicamentHistoryEntity.getEsentialeTo());
        medicamentHistoryEntityForUpdate.setNonesentialeTo(medicamentHistoryEntity.getNonesentialeTo());
        medicamentHistoryEntityForUpdate.setPrescriptionTo(medicamentHistoryEntity.getPrescriptionTo());
        medicamentHistoryEntityForUpdate.setTermsOfValidityTo(medicamentHistoryEntity.getTermsOfValidityTo());
        medicamentHistoryEntityForUpdate.setAtcCodeTo(medicamentHistoryEntity.getAtcCodeTo());
        medicamentHistoryEntityForUpdate.setCustomsCodeTo(medicamentHistoryEntity.getCustomsCodeTo());
        medicamentHistoryEntityForUpdate.setCommercialNameTo(medicamentHistoryEntity.getCommercialNameTo());
        medicamentHistoryEntityForUpdate.setOriginaleTo(medicamentHistoryEntity.getOriginaleTo());
        medicamentHistoryEntityForUpdate.setOrphanTo(medicamentHistoryEntity.getOrphanTo());
        medicamentHistoryEntityForUpdate.setStatus("F");
    }

    private void checkInstructionsHistory(List<MedicamentEntity> medicamentEntities, MedicamentHistoryEntity medicamentHistoryEntity,
                                          MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        for (MedicamentEntity med : medicamentEntities)
        {
            boolean isExistingDivisionInHistory = medicamentHistoryEntity.getDivisionHistory().stream().anyMatch(e -> Utils.areDivisionHistoryEqualsWithMedicament(e, med));
            if (!isExistingDivisionInHistory)
            {
                MedicamentDivisionHistoryEntity divisionHistoryEntity = new MedicamentDivisionHistoryEntity();
                divisionHistoryEntity.setMedicamentCode(med.getCode());
                divisionHistoryEntity.setStatus("R");
                divisionHistoryEntity.setMedicamentId(med.getId());
                divisionHistoryEntity.setDescription(med.getDivision());
                divisionHistoryEntity.setVolume(med.getVolume());
                divisionHistoryEntity.setVolumeQuantityMeasurement(med.getVolumeQuantityMeasurement());
                for (MedicamentInstructionsEntity instr : med.getInstructions())
                {
                    MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryEntity = new MedicamentInstructionsHistoryEntity();
                    medicamentInstructionsHistoryEntity.assign(instr);
                    medicamentInstructionsHistoryEntity.setStatus("R");
                    divisionHistoryEntity.getInstructionsHistory().add(medicamentInstructionsHistoryEntity);

                }
                medicamentHistoryEntityForUpdate.getDivisionHistory().add(divisionHistoryEntity);
            }
            else
            {
                fillRemovedInstructions(medicamentHistoryEntity, medicamentHistoryEntityForUpdate, med);
            }
        }
    }

    private void fillRemovedInstructions(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentHistoryEntity medicamentHistoryEntityForUpdate, MedicamentEntity med)
    {
        for (MedicamentInstructionsEntity medicamentInstructionsEntity : med.getInstructions())
        {
            boolean wasFound = false;
            MedicamentDivisionHistoryEntity divisionHistoryEntity =
                    medicamentHistoryEntity.getDivisionHistory().stream().filter(t -> Utils.areDivisionHistoryEqualsWithMedicament(t, med)).findFirst().orElse(new MedicamentDivisionHistoryEntity());
            for (MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryEntity :
                    divisionHistoryEntity.getInstructionsHistory())
            {
                if (medicamentInstructionsHistoryEntity.getPath().equals(medicamentInstructionsEntity.getPath()))
                {
                    wasFound = true;
                }
            }
            if (!wasFound)
            {
                MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryForUpdate = new MedicamentInstructionsHistoryEntity();
                medicamentInstructionsHistoryForUpdate.assign(medicamentInstructionsEntity);
                medicamentInstructionsHistoryForUpdate.setStatus("R");
                divisionHistoryEntity.getInstructionsHistory().add(medicamentInstructionsHistoryForUpdate);
            }
        }
    }

    private void addMedicamentDivisionHistory(List<MedicamentEntity> medicamentEntities, MedicamentHistoryEntity medicamentHistoryEntity,
                                              MedicamentHistoryEntity medicamentHistoryEntityForUpdate,
                                              RegistrationRequestsEntity request)
    {
        for (MedicamentEntity med : medicamentEntities)
        {
            boolean isExistingDivisionInHistory = medicamentHistoryEntity.getDivisionHistory().stream().anyMatch(e -> Utils.areDivisionHistoryEqualsWithMedicament(e,med));
            MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity = new MedicamentDivisionHistoryEntity();
            medicamentDivisionHistoryEntity.setDescription(med.getDivision());
            medicamentDivisionHistoryEntity.setVolume(med.getVolume());
            medicamentDivisionHistoryEntity.setVolumeQuantityMeasurement(med.getVolumeQuantityMeasurement());
            medicamentDivisionHistoryEntity.setMedicamentId(med.getId());
            medicamentDivisionHistoryEntity.setStatus(isExistingDivisionInHistory ? "M" : "R");
            medicamentDivisionHistoryEntity.setMedicamentCode(med.getCode());
            if (medicamentDivisionHistoryEntity.getStatus().equals("M"))
            {
               MedicamentDivisionHistoryEntity divisionHistory = medicamentHistoryEntity.getDivisionHistory().stream().filter(t->Utils.areDivisionHistoryEqualsWithMedicament(t,
                    med)).findFirst().orElse(new MedicamentDivisionHistoryEntity());
                medicamentDivisionHistoryEntity.setInstructionsHistory(divisionHistory.getInstructionsHistory());
                medicamentHistoryEntityForUpdate.getDivisionHistory().add(medicamentDivisionHistoryEntity);
                med.getInstructions().clear();
                fillMedicamentInstructions(medicamentHistoryEntity, med);
                medicamentRepository.save(med);
            }
        }
        for (MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity : medicamentHistoryEntity.getDivisionHistory())
        {
            boolean isExistingDivisionInMedicament = medicamentEntities.stream().anyMatch(e -> Utils.areDivisionHistoryEqualsWithMedicament(medicamentDivisionHistoryEntity,e));
            if (!isExistingDivisionInMedicament)
            {
                MedicamentEntity medicamentEntity = fillMedicamentDetails(request.getMedicamentPostauthorizationRegisterNr(), medicamentHistoryEntity,
                        medicamentDivisionHistoryEntity.getDescription(),
                        request.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("OM")).findFirst().orElse(new DocumentsEntity()).getDateOfIssue(),
                        request.getType().getCode(), medicamentDivisionHistoryEntity.getVolume(), medicamentDivisionHistoryEntity.getVolumeQuantityMeasurement(), Utils.getConcatenatedDivisionHistory(medicamentDivisionHistoryEntity));
                fillMedicamentInstructions(medicamentHistoryEntity, medicamentEntity);
                medicamentRepository.save(medicamentEntity);
                request.getMedicaments().add(medicamentEntity);
                MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity1 = new MedicamentDivisionHistoryEntity();
                medicamentDivisionHistoryEntity1.setDescription(medicamentDivisionHistoryEntity.getDescription());
                medicamentDivisionHistoryEntity1.setVolume(medicamentDivisionHistoryEntity.getVolume());
                medicamentDivisionHistoryEntity1.setVolumeQuantityMeasurement(medicamentDivisionHistoryEntity.getVolumeQuantityMeasurement());
                medicamentDivisionHistoryEntity1.setMedicamentId(medicamentEntity.getId());
                medicamentDivisionHistoryEntity1.setStatus("N");
                medicamentDivisionHistoryEntity1.setMedicamentCode(medicamentEntity.getCode());
                medicamentDivisionHistoryEntity1.setInstructionsHistory(medicamentDivisionHistoryEntity.getInstructionsHistory());
                medicamentHistoryEntityForUpdate.getDivisionHistory().add(medicamentDivisionHistoryEntity1);
            }
        }
    }

//    private void fillRemovedInstructions(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentHistoryEntity medicamentHistoryEntityForUpdate, MedicamentEntity med)
//    {
//        for (MedicamentInstructionsEntity medicamentInstructionsEntity : med.getInstructions())
//        {
//            boolean wasFound = false;
//            for (MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryEntity :
//                    medicamentHistoryEntity.getInstructionsHistory().stream().filter(t -> t.getDivision().equals(med.getDivision())).collect(Collectors.toList()))
//            {
//                if (medicamentInstructionsHistoryEntity.getName().equals(medicamentInstructionsEntity.getName()))
//                {
//                    wasFound = true;
//                }
//            }
//            if (!wasFound)
//            {
//                MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryForUpdate = new MedicamentInstructionsHistoryEntity();
//                medicamentInstructionsHistoryForUpdate.assign(medicamentInstructionsEntity);
//                medicamentInstructionsHistoryForUpdate.setStatus("R");
//                medicamentHistoryEntityForUpdate.getInstructionsHistory().add(medicamentInstructionsHistoryForUpdate);
//            }
//        }
//    }

//    private void fillNewInstructions(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentHistoryEntity medicamentHistoryEntityForUpdate, MedicamentEntity med)
//    {
//        for (MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryEntity :
//                medicamentHistoryEntity.getInstructionsHistory().stream().filter(t -> t.getDivision().equals(med.getDivision())).collect(Collectors.toList()))
//        {
//            boolean wasFound = false;
//            for (MedicamentInstructionsEntity medicamentInstructionsEntity : med.getInstructions())
//            {
//                if (medicamentInstructionsHistoryEntity.getName().equals(medicamentInstructionsEntity.getName()))
//                {
//                    wasFound = true;
//                }
//            }
//            if (!wasFound)
//            {
//                medicamentInstructionsHistoryEntity.setStatus("N");
//                medicamentHistoryEntityForUpdate.getInstructionsHistory().add(medicamentInstructionsHistoryEntity);
//            }
//        }
//    }

    private void fillMedicamentInstructions(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntity)
    {
        for (MedicamentDivisionHistoryEntity medicamentDivisionHistoryEntity : medicamentHistoryEntity.getDivisionHistory())
        {
            if (Utils.areDivisionHistoryEqualsWithMedicament(medicamentDivisionHistoryEntity, medicamentEntity))
            {
                for(MedicamentInstructionsHistoryEntity medicamentInstructionsHistoryEntity : medicamentDivisionHistoryEntity.getInstructionsHistory())
                {
                    if(!medicamentInstructionsHistoryEntity.getStatus().equals("R"))
                    {
                        MedicamentInstructionsEntity medicamentInstructionsEntity = new MedicamentInstructionsEntity();
                        medicamentInstructionsEntity.assign(medicamentInstructionsHistoryEntity);
                        medicamentEntity.getInstructions().add(medicamentInstructionsEntity);
                    }
                }
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
        medicamentHistoryEntityForUpdate.setOriginaleFrom(Boolean.TRUE.equals(medicamentEntityForUpdate.getOriginale()));
        medicamentHistoryEntityForUpdate.setOrphanFrom(Boolean.TRUE.equals(medicamentEntityForUpdate.getOrphan()));
        medicamentHistoryEntityForUpdate.setVitaleFrom(medicamentEntityForUpdate.getVitale());
        medicamentHistoryEntityForUpdate.setEsentialeFrom(medicamentEntityForUpdate.getEsentiale());
        medicamentHistoryEntityForUpdate.setNonesentialeFrom(medicamentEntityForUpdate.getNonesentiale());
        medicamentHistoryEntityForUpdate.setPrescriptionFrom(medicamentEntityForUpdate.getPrescription());
        medicamentHistoryEntityForUpdate.setAtcCodeFrom(medicamentEntityForUpdate.getAtcCode());
        medicamentHistoryEntityForUpdate.setCustomsCodeFrom(medicamentEntityForUpdate.getCustomsCode());
        medicamentHistoryEntityForUpdate.setTermsOfValidityFrom(medicamentEntityForUpdate.getTermsOfValidity());
        checkActiveSubstancesModifications(medicamentHistoryEntity, medicamentEntityForUpdate, medicamentHistoryEntityForUpdate);
        checkAuxiliarySubstancesModifications(medicamentHistoryEntity, medicamentEntityForUpdate, medicamentHistoryEntityForUpdate);
        checkMedicamentTypesModifications(medicamentHistoryEntity, medicamentEntityForUpdate, medicamentHistoryEntityForUpdate);
        checkManufacturesModifications(medicamentHistoryEntity, medicamentEntityForUpdate, medicamentHistoryEntityForUpdate);
        medicamentHistoryEntityForUpdate.setRegistrationNumber(regNr);
        medicamentHistoryEntityForUpdate.setStatus("F");
        medicamentHistoryEntityForUpdate.setRegistrationDate(medicamentEntityForUpdate.getRegistrationDate());
        medicamentHistoryEntityForUpdate.setChangeDate(LocalDateTime.now());
        medicamentHistoryEntity.setStatus("F");
        medicamentHistoryEntityForUpdate.setOmNumber(medicamentHistoryEntity.getOmNumber());
        medicamentHistoryEntityForUpdate.setApproved(true);
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
                //medicamentActiveSubstancesHistoryForUpdateEntity.setManufactureFrom(medicamentActiveSubstancesEntity.getManufacture());
                medicamentActiveSubstancesHistoryForUpdateEntity.setQuantityFrom(medicamentActiveSubstancesEntity.getQuantity());
                medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurementFrom(medicamentActiveSubstancesEntity.getUnitsOfMeasurement());
                for (MedicamentActiveSubstanceManufacturesEntity manufacture : medicamentActiveSubstancesEntity.getManufactures())
                {
                    MedicamentActiveSubstanceManufactureHistoryEntity manufactureHistoryEntity = new MedicamentActiveSubstanceManufactureHistoryEntity();
                    manufactureHistoryEntity.setManufacture(manufacture.getManufacture());
                    medicamentActiveSubstancesHistoryForUpdateEntity.getManufactures().add(manufactureHistoryEntity);
                }
                medicamentActiveSubstancesHistoryForUpdateEntity.setStatus("M");
                if (!medicamentActiveSubstancesHistoryEntity.getQuantityTo().equals(medicamentActiveSubstancesEntity.getQuantity())
                        || !medicamentActiveSubstancesHistoryEntity.getUnitsOfMeasurementTo().equals(medicamentActiveSubstancesEntity.getUnitsOfMeasurement()))
                {
                    //medicamentActiveSubstancesHistoryForUpdateEntity.setManufactureTo(medicamentActiveSubstancesHistoryEntity.getManufactureTo());
                    medicamentActiveSubstancesHistoryForUpdateEntity.setQuantityTo(medicamentActiveSubstancesHistoryEntity.getQuantityTo());
                    medicamentActiveSubstancesHistoryForUpdateEntity.setUnitsOfMeasurementTo(medicamentActiveSubstancesHistoryEntity.getUnitsOfMeasurementTo());
                    medicamentHistoryEntityForUpdate.getActiveSubstancesHistory().add(medicamentActiveSubstancesHistoryForUpdateEntity);
                }
            }
            else
            {
                medicamentActiveSubstancesHistoryForUpdateEntity.setActiveSubstance(medicamentActiveSubstancesEntity.getActiveSubstance());
                for (MedicamentActiveSubstanceManufacturesEntity manufacture : medicamentActiveSubstancesEntity.getManufactures())
                {
                    MedicamentActiveSubstanceManufactureHistoryEntity manufactureHistoryEntity = new MedicamentActiveSubstanceManufactureHistoryEntity();
                    manufactureHistoryEntity.setManufacture(manufacture.getManufacture());
                    medicamentActiveSubstancesHistoryForUpdateEntity.getManufactures().add(manufactureHistoryEntity);
                }
                //medicamentActiveSubstancesHistoryForUpdateEntity.setManufactureFrom(medicamentActiveSubstancesEntity.getManufacture());
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

    private void checkAuxiliarySubstancesModifications(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntityForUpdate, MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        for (MedicamentAuxiliarySubstancesEntity medicamentAuxiliarySubstancesEntity : medicamentEntityForUpdate.getAuxSubstances())
        {
            MedicamentAuxiliarySubstancesHistoryEntity medicamentAuxiliarySubstancesHistoryForUpdateEntity = new MedicamentAuxiliarySubstancesHistoryEntity();
            Optional<MedicamentAuxiliarySubstancesHistoryEntity> medicamentAuxiliarySubstancesHistoryEntityOpt =
                    medicamentHistoryEntity.getAuxiliarySubstancesHistory().stream().filter(t -> t.getAuxSubstance().getId() == medicamentAuxiliarySubstancesEntity.getAuxSubstance().getId()).findFirst();
            if (!medicamentAuxiliarySubstancesHistoryEntityOpt.isPresent())
            {
                medicamentAuxiliarySubstancesHistoryForUpdateEntity.setAuxSubstance(medicamentAuxiliarySubstancesEntity.getAuxSubstance());
                medicamentAuxiliarySubstancesHistoryForUpdateEntity.setStatus("R");
                medicamentHistoryEntityForUpdate.getAuxiliarySubstancesHistory().add(medicamentAuxiliarySubstancesHistoryForUpdateEntity);
            }
        }
        for (MedicamentAuxiliarySubstancesHistoryEntity medicamentAuxiliarySubstancesHistoryEntity : medicamentHistoryEntity.getAuxiliarySubstancesHistory())
        {
            Optional<MedicamentAuxiliarySubstancesEntity> medicamentAuxiliarySubstancesEntity =
                    medicamentEntityForUpdate.getAuxSubstances().stream().filter(t -> t.getAuxSubstance().getId() == medicamentAuxiliarySubstancesHistoryEntity.getAuxSubstance().getId()).findFirst();
            if (!medicamentAuxiliarySubstancesEntity.isPresent())
            {
                medicamentAuxiliarySubstancesHistoryEntity.setStatus("N");
                medicamentHistoryEntityForUpdate.getAuxiliarySubstancesHistory().add(medicamentAuxiliarySubstancesHistoryEntity);
            }
        }
    }

    private void checkMedicamentTypesModifications(MedicamentHistoryEntity medicamentHistoryEntity, MedicamentEntity medicamentEntityForUpdate, MedicamentHistoryEntity medicamentHistoryEntityForUpdate)
    {
        for (MedicamentTypesEntity medicamentTypesEntity : medicamentEntityForUpdate.getMedicamentTypes())
        {
            MedicamentTypesHistoryEntity medicamentTypesHistoryForUpdateEntity = new MedicamentTypesHistoryEntity();
            Optional<MedicamentTypesHistoryEntity> medicamentTypesHistoryEntityOpt =
                    medicamentHistoryEntity.getMedicamentTypesHistory().stream().filter(t -> t.getType().getId() == medicamentTypesEntity.getType().getId()).findFirst();
            if (!medicamentTypesHistoryEntityOpt.isPresent())
            {
                medicamentTypesHistoryForUpdateEntity.setType(medicamentTypesEntity.getType());
                medicamentTypesHistoryForUpdateEntity.setStatus("R");
                medicamentHistoryEntityForUpdate.getMedicamentTypesHistory().add(medicamentTypesHistoryForUpdateEntity);
            }
        }
        for (MedicamentTypesHistoryEntity medicamentTypesHistoryEntity : medicamentHistoryEntity.getMedicamentTypesHistory())
        {
            Optional<MedicamentTypesEntity> medicamentTypesEntity =
                    medicamentEntityForUpdate.getMedicamentTypes().stream().filter(t -> t.getType().getId() == medicamentTypesHistoryEntity.getType().getId()).findFirst();
            if (!medicamentTypesEntity.isPresent())
            {
                medicamentTypesHistoryEntity.setStatus("N");
                medicamentHistoryEntityForUpdate.getMedicamentTypesHistory().add(medicamentTypesHistoryEntity);
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
                Boolean producatorProdusFinitTo = Boolean.TRUE.equals(medicamentManufactureHistoryEntity.getProducatorProdusFinitTo());
                if (!producatorProdusFinitTo.equals(medicamentManufactureEntity.getProducatorProdusFinit()))
                {
                    medicamentManufactureHistoryForUpdateEntity.setProducatorProdusFinitTo(producatorProdusFinitTo);
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

    private MedicamentEntity fillMedicamentDetails(Integer regNr, MedicamentHistoryEntity medicamentHistoryEntity, String division, Timestamp orderDate, String type,
                                                   String volume,NmUnitsOfMeasurementEntity volumeMeasurement,String concatenatedDivision)
    {
        MedicamentEntity medicamentEntity = new MedicamentEntity();
        medicamentEntity.setRegistrationNumber(regNr);
        setCodeAndRegistrationNr(medicamentEntity, orderDate, type);
        medicamentEntity.setStatus("F");
        medicamentEntity.setName(medicamentHistoryEntity.getCommercialNameTo() + " " + medicamentHistoryEntity.getPharmaceuticalFormTo().getCode() + " " + medicamentHistoryEntity.getDoseTo() +
                " " + concatenatedDivision);
        medicamentEntity.setCustomsCode(medicamentHistoryEntity.getCustomsCodeTo());
        medicamentEntity.setCommercialName(medicamentHistoryEntity.getCommercialNameTo());
        medicamentEntity.setInternationalMedicamentName(medicamentHistoryEntity.getInternationalMedicamentNameTo());
        Calendar cal = Calendar.getInstance();
        cal.setTime(orderDate);
        cal.add(Calendar.YEAR, 5);
        medicamentEntity.setExpirationDate(new java.sql.Date(cal.getTime().getTime()));
        medicamentEntity.setDose(medicamentHistoryEntity.getDoseTo());
        medicamentEntity.setPharmaceuticalForm(medicamentHistoryEntity.getPharmaceuticalFormTo());
        medicamentEntity.setAuthorizationHolder(medicamentHistoryEntity.getAuthorizationHolderTo());
        medicamentEntity.setVitale(medicamentHistoryEntity.getVitaleTo());
        medicamentEntity.setEsentiale(medicamentHistoryEntity.getEsentialeTo());
        medicamentEntity.setNonesentiale(medicamentHistoryEntity.getNonesentialeTo());
        medicamentEntity.setPrescription(medicamentHistoryEntity.getPrescriptionTo());
        medicamentEntity.setVolume(volume);
        medicamentEntity.setTermsOfValidity(medicamentHistoryEntity.getTermsOfValidityTo());
        medicamentEntity.setExperts(medicamentHistoryEntity.getExperts());
        medicamentEntity.setVolumeQuantityMeasurement(volumeMeasurement);
        medicamentEntity.setAtcCode(medicamentHistoryEntity.getAtcCodeTo());
        medicamentEntity.setDivision(division);
        medicamentEntity.setOriginale(medicamentHistoryEntity.getOriginaleTo());
        medicamentEntity.setOrphan(medicamentHistoryEntity.getOrphanTo());
        medicamentEntity.setUnlimitedRegistrationPeriod(false);
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistEntity : medicamentHistoryEntity.getActiveSubstancesHistory())
        {
            MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity = new MedicamentActiveSubstancesEntity();
            medicamentActiveSubstancesEntity.setActiveSubstance(medicamentActiveSubstancesHistEntity.getActiveSubstance());
            //medicamentActiveSubstancesEntity.setManufacture(medicamentActiveSubstancesHistEntity.getManufactureTo());
            medicamentActiveSubstancesEntity.setQuantity(medicamentActiveSubstancesHistEntity.getQuantityTo());
            medicamentActiveSubstancesEntity.setUnitsOfMeasurement(medicamentActiveSubstancesHistEntity.getUnitsOfMeasurementTo());
            medicamentActiveSubstancesEntity.setCompositionNumber(medicamentActiveSubstancesHistEntity.getCompositionNumberTo());
            medicamentEntity.getActiveSubstances().add(medicamentActiveSubstancesEntity);
        }
        for (MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity : medicamentHistoryEntity.getManufacturesHistory())
        {
            MedicamentManufactureEntity medicamentManufactureEntity = new MedicamentManufactureEntity();
            medicamentManufactureEntity.setManufacture(medicamentManufactureHistoryEntity.getManufacture());
            medicamentManufactureEntity.setProducatorProdusFinit(medicamentManufactureHistoryEntity.getProducatorProdusFinitTo());
            medicamentManufactureEntity.setComment(medicamentManufactureHistoryEntity.getCommentTo());
            medicamentEntity.getManufactures().add(medicamentManufactureEntity);
        }
        for (MedicamentAuxiliarySubstancesHistoryEntity medicamentAuxiliarySubstancesHistoryEntity : medicamentHistoryEntity.getAuxiliarySubstancesHistory())
        {
            MedicamentAuxiliarySubstancesEntity medicamentAuxiliarySubstancesEntity = new MedicamentAuxiliarySubstancesEntity();
            medicamentAuxiliarySubstancesEntity.setAuxSubstance(medicamentAuxiliarySubstancesHistoryEntity.getAuxSubstance());
            medicamentEntity.getAuxSubstances().add(medicamentAuxiliarySubstancesEntity);
        }
        for (MedicamentTypesHistoryEntity medicamentTypesHistoryEntity : medicamentHistoryEntity.getMedicamentTypesHistory())
        {
            MedicamentTypesEntity medicamentTypesEntity = new MedicamentTypesEntity();
            medicamentTypesEntity.setType(medicamentTypesHistoryEntity.getType());
            medicamentEntity.getMedicamentTypes().add(medicamentTypesEntity);
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

	@RequestMapping(value = "/add-invoice-request"/*, method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE*/)
    public ResponseEntity<RegistrationRequestsEntity> saveInvoice(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        LOGGER.debug("\n\n\n\n=====================\nAdd Import\n=====================\n\n\n");


        if (requests.getInvoiceEntity() == null)
        {
            throw new CustomException("/add-invoice Threw an error, requests.getInvoice() == null");
        }

        if (requests.getInvoiceEntity().getInvoiceDetailsEntitySet() != null)
        {
            requestRepository.save(requests);

        }
        else
        {
			System.out.println("\n\n\n\n=====================\ngetImportAuthorizationEntity is null\n=====================\n\n\n");
		}


		LOGGER.debug("\n\n\n\n=====================\nInvoice saved\n=====================\n\n\n");


//		List<InvoiceDetailsEntity> list = new ArrayList<>();
//		list = invoiceDetailsRepository.findInvoicesByAuthorization("0023/2010-AM");
//		int importedQuantity  = list.stream().map(emp -> emp.getQuantity()).reduce(0, (x , y) -> x + y);
//		list.forEach(x -> System.out.println(x.getQuantity()));
//
//		System.out
//				.println("\n\n\n\n=====================\nlist.stream: "+ importedQuantity +"\n=====================\n\n\n");
		return new ResponseEntity<>(requests, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/get-invoice-quota")
	public ResponseEntity<Integer> getInvoiceQuota(@RequestParam Map<String, String> requestParams) throws CustomException

	{
//		Optional<List<RegistrationRequestsEntity>> registrationRequestsEntities = requestRepository.findMedicamentHistoryByRegistrationNumber(registrationNumber);

		List<InvoiceDetailsEntity> list = new ArrayList<>();
		list = invoiceDetailsRepository.findInvoicesByAuthorization(requestParams.get("nameOrCodeAmed"), requestParams.get("authorizationNumber"));
		int importedQuantity  = list.stream().map(emp -> emp.getQuantity()).reduce(0, (x,y) -> x+y);
        list.forEach(x -> System.out.println(x.getQuantity()));

        System.out.println("\n\n\n\n=====================\nlist.stream: "+ importedQuantity +"\n=====================\n\n\n");


		return new ResponseEntity<>(importedQuantity, HttpStatus.CREATED);
	}


//	@RequestMapping(value = "/add-import-request"/*, method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE*/)
//	public ResponseEntity<RegistrationRequestsEntity> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
//		LOGGER.debug("\n\n\n\n=====================\nAdd Import\n=====================\n\n\n");
//
//	}
//	@RequestMapping(value = "/add-import-request"/*, method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE*/)
//	public ResponseEntity<RegistrationRequestsEntity> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException {
//		LOGGER.debug("\n\n\n\n=====================\nAdd Import\n=====================\n\n\n");
//
//    }


    @RequestMapping(value = "/add-import-request"/*, method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE*/)
    public ResponseEntity<RegistrationRequestsEntity> saveImportRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        LOGGER.debug("\n\n\n\n=====================\nAdd Import\n=====================\n\n\n");


        if (requests.getImportAuthorizationEntity() == null)
        {
            throw new CustomException("/add-import-request Threw an error, requests.getImportAuthorizationEntity() == null");
        }

        if (requests.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList() != null)
        {

            for (ImportAuthorizationDetailsEntity medNotGer : requests.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList())
            {
                if (medNotGer.getCodeAmed() == null && requests.getImportAuthorizationEntity().getMedType()==2)
                {
                    MedicamentCodeSequenceEntity seq = new MedicamentCodeSequenceEntity();
                    medicamentCodeSeqRepository.save(seq);
                    medNotGer.setCodeAmed(Utils.generateMedicamentCode(seq.getId()));
                }
            }
        }
        else
        {
            System.out.println("\n\n\n\n=====================\ngetImportAuthorizationEntity is null\n=====================\n\n\n");
        }

        //        requests.setMedicaments(null);
        LOGGER.debug("MED==============" + requests.getMedicaments());
        requestRepository.save(requests);
        //TODO fix the docs
        //        addDDDocument(requests);
        LOGGER.debug("\n\n\n\n=====================\nImport saved\n=====================\n\n\n");


//		List<InvoiceDetailsEntity> list = new ArrayList<>();
//		list = invoiceDetailsRepository.findInvoicesByAuthorization("0023/2010-AM");
//		int importedQuantity  = list.stream().map(emp -> emp.getQuantity()).reduce(0, (x,y) -> x+y);
//        list.forEach(x -> System.out.println(x.getQuantity()));
//
//        System.out.println("\n\n\n\n=====================\nlist.stream: "+ importedQuantity +"\n=====================\n\n\n");

		return new ResponseEntity<>(requests, HttpStatus.CREATED);
	}
//	@GetMapping(value = "/load-import-request")
//	public ResponseEntity<RegistrationRequestsEntity> getImportById(@RequestParam(value = "id") Integer id) throws CustomException {
//		Optional<RegistrationRequestsEntity> regOptional = requestRepository.findImportAuthRequestById(id);
//		if (!regOptional.isPresent()) {
//			throw new CustomException("Inregistrarea de Import nu a fost gasita");
//		}
//		RegistrationRequestsEntity rrE = regOptional.get();
////        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
////        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));
//
//		return new ResponseEntity<>(requests, HttpStatus.CREATED);
//	}
//	@GetMapping(value = "/load-import-request")
//	public ResponseEntity<RegistrationRequestsEntity> getImportById(@RequestParam(value = "id") Integer id) throws CustomException {
//		Optional<RegistrationRequestsEntity> regOptional = requestRepository.findImportAuthRequestById(id);
//		if (!regOptional.isPresent()) {
//			throw new CustomException("Inregistrarea de Import nu a fost gasita");
//		}
//		RegistrationRequestsEntity rrE = regOptional.get();
////        rrE.setClinicalTrails((ClinicalTrialsEntity) Hibernate.unproxy(regOptional.get().getClinicalTrails()));
////        rrE.setCompany((NmEconomicAgentsEntity) Hibernate.unproxy(regOptional.get().getCompany()));
//
//        //        requests.setMedicaments(null);
//        LOGGER.debug("MED==============" + requests.getMedicaments());
//        requestRepository.save(requests);
//        //TODO fix the docs
//        //        addDDDocument(requests);
//        LOGGER.debug("\n\n\n\n=====================\nImport saved\n=====================\n\n\n");
//
//
//        return new ResponseEntity<>(requests, HttpStatus.CREATED);
//    }

    @GetMapping(value = "/load-import-request")
    public ResponseEntity<RegistrationRequestsEntity> getImportById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findImportAuthRequestById(id);
        if (!regOptional.isPresent())
        {
            throw new CustomException("Inregistrarea de Import nu a fost gasita");
        }
        RegistrationRequestsEntity rrE = regOptional.get();

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }

    @RequestMapping(value = "/view-import-authorization")
    public ResponseEntity<byte[]> viewImportAuthorization(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/ImportAutorizareDeImport.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());



            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            ArrayList<AutorizationImportDataSet> autorizationImportDataSetArrayList = new ArrayList<>();
            ArrayList<AutorizationImportDataSet2> autorizationImportDataSet2ArrayList = new ArrayList<>();


            HashMap<String, Double> map = new HashMap();

            for (ImportAuthorizationDetailsEntity entity : request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList())
            {
                /*Create a map Key is the code value is the amount
                 *
                 * if the jey exists add the sum, if id doesn't creaet the key and add the value*/
                
                if (entity != null && entity.getApproved() == true)
                {
                    if (autorizationImportDataSet2ArrayList.stream().anyMatch(x -> x.getProductCode().equalsIgnoreCase(entity.getCustomsCode().getCode())))
                    {
                        for (int i = 0; i < autorizationImportDataSet2ArrayList.size(); i++)
                        {
                            if (autorizationImportDataSet2ArrayList.get(i).getProductCode().equals(entity.getCustomsCode().getCode()))
                            {
                                autorizationImportDataSet2ArrayList.get(i).setAmount(AmountUtils.round(autorizationImportDataSet2ArrayList.get(i).getAmount() + entity.getSumm(),2));
                            }
                        }
                    }
                    else
                    {

                        AutorizationImportDataSet2 dataSet2 = new AutorizationImportDataSet2();
                        dataSet2.setAmount(AmountUtils.round(entity.getSumm(), 2));
                        dataSet2.setField18("");
                        dataSet2.setProductCode(entity.getCustomsCode().getCode());
                        dataSet2.setProductName(entity.getCustomsCode().getDescription());
                        dataSet2.setQuantity("");
                        dataSet2.setUnitMeasure("");

                        autorizationImportDataSet2ArrayList.add(dataSet2);
                    }

                    //====================================

                    if (map.get(entity.getCustomsCode().getCode()) == null)
                    {
                        map.put(entity.getCustomsCode().getCode(), entity.getSumm());
                    }
                    else
                    {
                        map.put(entity.getCustomsCode().getCode(), map.get(entity.getCustomsCode().getCode()) + entity.getSumm());
                    }

                }

            }

            long numberOfApprovedPositions = request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().stream().filter(x -> x.getApproved()==true).count();


//            dataSet.setCustom("Nord \nSud \nAeroport \nCentru \nChișinau");
            String customsPoints = "";

            for (NmCustomsPointsEntity point : request.getImportAuthorizationEntity().getNmCustomsPointsList())
            {
//                customsPoints = customsPoints + point.getDescription() +"\n";
                AutorizationImportDataSet dataSet = new AutorizationImportDataSet();
          
                dataSet.setCustom(point.getDescription());
                dataSet.setCustomCode(point.getCode());
                autorizationImportDataSetArrayList.add(dataSet);
            }
            parameters.put("transactionType" , "Cumparare/Vinzare ferma");

            
            if (request.getImportAuthorizationEntity().getCurrency() != null)
            {
                parameters.put("currencyPayment", request.getImportAuthorizationEntity().getCurrency().getShortDescription());
                parameters.put("currencyCode", request.getImportAuthorizationEntity().getCurrency().getCode());
            }


            JRBeanCollectionDataSource autorizationImportDataSet = new JRBeanCollectionDataSource(autorizationImportDataSetArrayList);
            JRBeanCollectionDataSource autorizationImportDataSet2 = new JRBeanCollectionDataSource(autorizationImportDataSet2ArrayList);

            
            if (request.getImportAuthorizationEntity().getAuthorizationsNumber() != null)
            {
                parameters.put("autorizationNr", request.getImportAuthorizationEntity().getAuthorizationsNumber());
            }
            parameters.put("autorizationDate", (new SimpleDateFormat("dd/MM/yyyy").format(new Date())));
            parameters.put("importExportSectionDate", (new SimpleDateFormat("dd/MM/yyyy").format(new Date())));
            parameters.put("generalDirectorDate", (new SimpleDateFormat("dd/MM/yyyy").format(new Date())));

            
            if (request.getImportAuthorizationEntity().getSeller() != null)
            {
                parameters.put("sellerAndAddress",
                        request.getImportAuthorizationEntity().getSeller().getDescription() + "\n" + request.getImportAuthorizationEntity().getSeller().getAddress());
                parameters.put("sellerCountry", request.getImportAuthorizationEntity().getSeller().getCountry().getDescription());
                parameters.put("sellerCountryCode", request.getImportAuthorizationEntity().getSeller().getCountry().getCode());
            }
            parameters.put("transactionType", "Cumparare/Vinzare ferma          11");


            parameters.put("destinationCountry", "Moldova");
            parameters.put("destinationCountryCode", "MD");

            
            if (request.getImportAuthorizationEntity().getImporter() != null)
            {
                parameters.put("companyNameAndAddress",
                        request.getImportAuthorizationEntity().getImporter().getLongName() + "\n" + request.getImportAuthorizationEntity()
                                .getImporter()
                                .getLegalAddress());
            }
            
            if (request.getImportAuthorizationEntity().getApplicant() != null)
            {
                parameters.put("registartionDate", request.getImportAuthorizationEntity().getApplicant().getRegistrationDate().toString());
                parameters.put("registrationNr", request.getImportAuthorizationEntity().getApplicant().getIdno());
            }


            
            if (request.getImportAuthorizationEntity().getContract() != null && request.getImportAuthorizationEntity().getContractDate() != null && request.getImportAuthorizationEntity().getAnexa() != null && request.getImportAuthorizationEntity().getAnexaDate() != null)
            {

	            String themesForApplicationForAuthorization;

	            
	            if (request.getImportAuthorizationEntity().getConditionsAndSpecification()!= null || !request.getImportAuthorizationEntity().getConditionsAndSpecification().equals("")) {
		            themesForApplicationForAuthorization = "Contract: " + request.getImportAuthorizationEntity().getContract() + " din " + new SimpleDateFormat("dd/MM/yyyy").format(request.getImportAuthorizationEntity().getContractDate()) +
		                                                   "\n" + "Anexa: " + request.getImportAuthorizationEntity().getAnexa() + " din " + new SimpleDateFormat("dd/MM/yyyy").format(request.getImportAuthorizationEntity().getAnexaDate()) +

                            "\n" + "Alte: " + request.getImportAuthorizationEntity().getConditionsAndSpecification();
                    ;
                }
                else
                {
		            themesForApplicationForAuthorization =  "Contract: " + request.getImportAuthorizationEntity().getContract() + " din " + new SimpleDateFormat("dd/MM/yyyy").format(request.getImportAuthorizationEntity().getContractDate()) +
		            "\n" + "Anexa: " + request.getImportAuthorizationEntity().getAnexa() + " din " + new SimpleDateFormat("dd/MM/yyyy").format(request.getImportAuthorizationEntity().getAnexaDate());

	            }


            	parameters.put("themesForApplicationForAuthorization", themesForApplicationForAuthorization);
            }

            parameters.put("geniralDirectorName", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("importExportSectionRepresentant", sysParamsRepository.findByCode(Constants.SysParams.IMPORT_REPREZENTANT).get().getValue());
            parameters.put("importExportSectionChief", sysParamsRepository.findByCode(Constants.SysParams.IMPORT_SEF_SECTIE).get().getValue());
            parameters.put("validityTerms", (new SimpleDateFormat("dd/MM/yyyy").format(request.getImportAuthorizationEntity().getExpirationDate())));


                
            if (numberOfApprovedPositions > 1 && request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().iterator().next().getProducer() != null)
            {
                parameters.put("manufacturerAndAddress", "Producători diferiți");
                parameters.put("manufacturerCountry", "Țari diferite");
                parameters.put("manufacturerCountryCode","");
            
            }
            else if (numberOfApprovedPositions == 1 && request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().iterator().next().getProducer() != null)
            {
                    parameters.put("manufacturerAndAddress",
                                   request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().iterator().next().getProducer().getDescription() + "\n" + request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().iterator().next().getProducer().getAddress());
                    parameters.put("manufacturerCountry", request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().iterator().next().getProducer().getCountry().getDescription());
                    parameters.put("manufacturerCountryCode", request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList().iterator().next().getProducer().getCountry().getCode());
                }


            parameters.put("autorizationImportDataSet", autorizationImportDataSet);
            parameters.put("autorizationImportDataSet2", autorizationImportDataSet2);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);


        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf").header("Content-Disposition", "inline; filename=importAuthorization.pdf").body(
                bytes);
    }

    @RequestMapping(value = "/view-import-authorization-specification")
    public ResponseEntity<byte[]> viewImportAuthorizationSpecification(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/ImportSpecificatiaMedicamente.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());



            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            ArrayList<AutorizationImportDataSet> autorizationImportDataSetArrayList = new ArrayList<>();
            ArrayList<ImportSpecificationDataSet> ImportSpecificationDataSetArrayList = new ArrayList<>();
            double totalSum = 0;


            HashMap<String, Double> map = new HashMap();
            DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

            for (ImportAuthorizationDetailsEntity entity : request.getImportAuthorizationEntity().getImportAuthorizationDetailsEntityList())
            {
                /*Create a map Key is the code value is the amount
                 *
                 * if the jey exists add the sum, if id doesn't creaet the key and add the value*/
                if (entity != null && entity.getApproved() == true)                {
//                    if (autorizationImportDataSet2ArrayList.stream().anyMatch(x -> x.getProductCode().equalsIgnoreCase(entity.getCustomsCode().getCode())))
//                    {
//                        for (int i = 0; i < autorizationImportDataSet2ArrayList.size(); i++)
//                        {
//                            if (autorizationImportDataSet2ArrayList.get(i).getProductCode().equals(entity.getCustomsCode().getCode()))
//                            {
//                                autorizationImportDataSet2ArrayList.get(i).setAmount(AmountUtils.round(autorizationImportDataSet2ArrayList.get(i).getAmount() + entity.getSumm(),2));
//                            }
//                        }
//                    }
//                    else
//                    {

                    ImportSpecificationDataSet specificationMedicament = new ImportSpecificationDataSet();

                  if (entity.getCodeAmed()                                !=null)         { specificationMedicament.setMedicamentCode(entity.getCodeAmed()); }
                  if (entity.getCustomsCode().getCode()                   !=null)         { specificationMedicament.setCustomsCode(entity.getCustomsCode().getCode()); }
                  if (entity.getName()                                    !=null)         { specificationMedicament.setTradeNameOfDrug(entity.getName()); }
                  if (entity.getPharmaceuticalForm().getCode()            !=null)         { specificationMedicament.setPharmaceuticForm(entity.getPharmaceuticalForm().getCode()); }
                  if (entity.getDose()                                    !=null)         { specificationMedicament.setDose(entity.getDose()); }
                  if (entity.getUnitsOfMeasurement()                      !=null)         { specificationMedicament.setPackaging(entity.getUnitsOfMeasurement()); }
                  if (entity.getQuantity()                                !=null)         { specificationMedicament.setQuantity(entity.getApprovedQuantity().toString()); }
                  if (entity.getPrice() !=null && entity.getCurrency()    !=null)         { specificationMedicament.setPriceCurrency(String.valueOf(AmountUtils.round(entity.getPrice(), 2)) + " " +  entity.getCurrency().getShortDescription()); }
                  if (entity.getSumm() != null  && entity.getCurrency()   !=null)         { specificationMedicament.setValueCurrency(String.valueOf(AmountUtils.round(entity.getSumm(), 2) + " " +  entity.getCurrency().getShortDescription())); }
                  if (entity.getProducer().getCountry()                   !=null)         { specificationMedicament.setCountryOfOrigin(entity.getProducer().getCountry().getCode()); }
                  if (entity.getProducer().getDescription()               !=null)         { specificationMedicament.setManufacturingCompany(entity.getProducer().getDescription()); }
                  if (entity.getRegistrationDate()                        !=null)         { specificationMedicament.setRegistrationDate(formatter.format(entity.getRegistrationDate())); }
                  if (entity.getRegistrationNumber()                      !=null)         { specificationMedicament.setRegistrationNumber(entity.getRegistrationNumber().toString()); } else
                      {specificationMedicament.setRegistrationNumber("");}
                  if (entity.getAtcCode()                                 !=null)         { specificationMedicament.setAtc(entity.getAtcCode().getCode()); }
                  if (entity.getInternationalMedicamentName()             !=null)         { specificationMedicament.setInternationalName(entity.getInternationalMedicamentName().getDescription()); }
                  totalSum += totalSum;

                    ImportSpecificationDataSetArrayList.add(specificationMedicament);
                    }


            }

	        if (request.getImportAuthorizationEntity().getAuthorizationsNumber()        !=null) {parameters.put("annexNr", request.getImportAuthorizationEntity().getAnexa()); }
	        if (request.getImportAuthorizationEntity().getImporter().getDirector()      !=null) {parameters.put("buyerDirector",  request.getImportAuthorizationEntity().getImporter().getDirector()  );}
	        if (request.getImportAuthorizationEntity().getImporter().getDirector()      !=null) {parameters.put("buyerAddress",  request.getImportAuthorizationEntity().getImporter().getLegalAddress()  );}
	        if (request.getImportAuthorizationEntity().getContract()                    !=null) {parameters.put("contractNr",     request.getImportAuthorizationEntity().getContract()                );}
	        if (request.getImportAuthorizationEntity().getAnexaDate()                   !=null) {parameters.put("annexNrDate",    formatter.format(request.getImportAuthorizationEntity().getAnexaDate())               );}
	        if (request.getImportAuthorizationEntity().getContractDate()                !=null) {parameters.put("contractNrDate", formatter.format(request.getImportAuthorizationEntity().getContractDate())            );}
	        if (request.getImportAuthorizationEntity().getImporter().getName()          !=null) {parameters.put("buyerName",      request.getImportAuthorizationEntity().getImporter().getName()      );}
	        if (request.getImportAuthorizationEntity().getSeller().getDescription()     !=null) {parameters.put("sellerName",     request.getImportAuthorizationEntity().getSeller().getDescription() );}
	        if (request.getImportAuthorizationEntity().getSeller()                      !=null) {parameters.put("sellerAddress",  request.getImportAuthorizationEntity().getSeller().getAddress() + " " + request.getImportAuthorizationEntity().getSeller().getCountry().getCode());}
	        parameters.put("sellerDirector", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
//	        parameters.put("totalSum", String.valueOf(AmountUtils.round(ImportSpecificationDataSetArrayList.stream().map(sum -> sum.getValueCurrency()).reduce(0.0, (x,y) -> x+y)                    , 2 )));
	        parameters.put("totalSum", String.valueOf(AmountUtils.round(totalSum , 2 )));
            parameters.put("importSpecificationMedicament", new JRBeanCollectionDataSource( ImportSpecificationDataSetArrayList));


            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);


        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf").header("Content-Disposition", "inline; filename=importAuthorization.pdf").body(
                bytes);
    }


    @GetMapping(value = "/load-import-authorization-details")
    public ResponseEntity<List<ImportAuthorizationDetailsEntity>> getAuthorizationDetailsByNameOrCode(@RequestParam Map<String, String> requestParams) throws CustomException
    {
        List<ImportAuthorizationDetailsEntity> regOptional = importAuthorizationRepository.getAuthorizationDetailsByNameOrCode(requestParams.get("id"), true, requestParams.get("authId"));
        return new ResponseEntity<>(regOptional, HttpStatus.OK);
    }

	@GetMapping(value = "/load-import-authorization-byAuth")
	
    public ResponseEntity<RegistrationRequestsEntity> getAuthorizationByAuth(@RequestParam(value = "id") String id) throws CustomException
    {
		List<ImportAuthorizationEntity> regOptional = importAuthRepository.getAuthorizationByAuth(id).orElse(new ArrayList<>());
		List<ImportAuthorizationEntity> rrI = regOptional;
		RegistrationRequestsEntity rrE = requestRepository.findRequestsByImportId(
                rrI.get(0).getId());


		return new ResponseEntity<>(rrE, HttpStatus.OK);
	}

    @GetMapping(value = "/load-active-licenses")
    public ResponseEntity<LicensesEntity> getActiveLicensesByIdno(@RequestParam(value = "id") String idno) throws CustomException
    {
        Optional<LicensesEntity> regOptional = licensesRepository.getActiveLicenseByIdno(idno, new Date());
        if (!regOptional.isPresent())
        {
            //            throw new CustomException("Licenta nu a fost gasita");
            return null;

        }
        LicensesEntity rrE = regOptional.get();

        return new ResponseEntity<>(rrE, HttpStatus.OK);
    }

    @GetMapping(value = "/load-document-module-request")
    public ResponseEntity<DocumentModuleDetailsEntity> getDocumentRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<DocumentModuleDetailsEntity> documentDetails = documentModuleDetailsRepository.finddDocumentModuleById(id);
        if (documentDetails.isPresent())
        {
            return new ResponseEntity<>(documentDetails.get(), HttpStatus.CREATED);
        }
        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/include-experts-dd", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> includeExpertsDD(@RequestBody RegistrationRequestsEntity requestsEntity) throws CustomException
    {
        requestRepository.save(requestsEntity);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/get-request-dd", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForDD() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForDD();
        regs.sort(Comparator.comparing(o -> o.getStartDate()));
        return new ResponseEntity<>(regs, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-request-ddm", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForDDM() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForDDM();
        regs.sort(Comparator.comparing(o -> o.getStartDate()));
        return new ResponseEntity<>(regs, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-request-oi", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForOI() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForOI();
        regs.sort(Comparator.comparing(o -> o.getStartDate()));
        return new ResponseEntity<>(regs, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-request-oim", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForOIM() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForOIM();
        regs.sort(Comparator.comparing(o -> o.getStartDate()));
        return new ResponseEntity<>(regs, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-medicaments-oa", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MedicamentEntity>> getMedicamentsOA() throws CustomException
    {
        List<MedicamentEntity> medicamentEntities = medicamentRepository.getMedicamentsForOA();
        medicamentEntities.sort(Comparator.comparing(o -> o.getId()));
        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-medicaments-om", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MedicamentHistoryEntity>> getMedicamentsOM() throws CustomException
    {
        List<MedicamentHistoryEntity> medicamentEntities = medicamentRepository.getMedicamentsForOM();
        medicamentEntities.sort(Comparator.comparing(o -> o.getId()));
        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-dds", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getDDs() throws CustomException
    {
        List<OutputDocumentsEntity> dds = outputDocumentsRepository.findDD();
        dds.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(dds, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-ddms", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getDDMs() throws CustomException
    {
        List<OutputDocumentsEntity> dds = outputDocumentsRepository.findDDM();
        dds.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(dds, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-ois", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getOIs() throws CustomException
    {
        List<OutputDocumentsEntity> ois = outputDocumentsRepository.findOI();
        ois.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(ois, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-oims", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getOIMs() throws CustomException
    {
        List<OutputDocumentsEntity> ois = outputDocumentsRepository.findOIM();
        ois.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(ois, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-oas", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getOAs() throws CustomException
    {
        List<OutputDocumentsEntity> oos = outputDocumentsRepository.findOA();
        oos.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(oos, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-oms", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getOMs() throws CustomException
    {
        List<OutputDocumentsEntity> oos = outputDocumentsRepository.findOM();
        oos.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(oos, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-request-dd-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForDDCt() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForDDCt();

        for (RegistrationRequestsEntity reg : regs)
        {
            this.clinicalTrailsService.getCtMedInstInvestigator(reg);
        }
        regs.sort(Comparator.comparing(o -> o.getStartDate()));
        return new ResponseEntity<>(regs, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-request-dd-amd-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForDDACt() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForDDACt();

        for (RegistrationRequestsEntity requestsEntity : regs)
        {
            ClinicTrialAmendEntity clinicTrialAmendEntity = requestsEntity.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(entity ->
                    entity.getRegistrationRequestId().equals(requestsEntity.getId())
            ).findFirst().orElse(null);

            if (clinicTrialAmendEntity != null)
            {
                Set<CtAmendMedInstInvestigatorEntity> medInstInvestigators = ctAmendMedInstInvestigatorRepository.findCtMedInstInvestigatorById(clinicTrialAmendEntity.getId());
                medInstInvestigators.forEach(medInstInvestigator -> {
                    if ('U' == medInstInvestigator.getEmbededId().getStatus() || 'N' == medInstInvestigator.getEmbededId().getStatus())
                    {
                        CtMedicalInstitutionEntity medInst = medInstInvestigator.getMedicalInstitutionsEntity();
                        CtInvestigatorEntity ctInvestigatorEntity = new CtInvestigatorEntity();
                        ctInvestigatorEntity.asign(medInstInvestigator.getInvestigatorsEntity());
                        ctInvestigatorEntity.setMain(medInstInvestigator.getMainInvestigator());
                        medInst.getInvestigators().add(ctInvestigatorEntity);

                        clinicTrialAmendEntity.getMedicalInstitutionsTo().add(medInst);
                    }
                });
            }
        }
        return new ResponseEntity<>(regs,HttpStatus.OK);
    }

    @RequestMapping(value = "/get-ddcs", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getDDCs() throws CustomException
    {
        List<OutputDocumentsEntity> dds = outputDocumentsRepository.findDDC();
        dds.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(dds, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-ddacs", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getDDACs() throws CustomException
    {
        List<OutputDocumentsEntity> dda = outputDocumentsRepository.findDDA();
        dda.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(dda, HttpStatus.OK);
    }

    @GetMapping(value = "/get-old-request-term")
    public ResponseEntity<String> getOldRequestTerm(@RequestParam(value = "code") String code) throws CustomException
    {
        String term = sysParamsRepository.findByCode(code).get().getValue();
        if (term != null)
        {
            return new ResponseEntity<>(term, HttpStatus.CREATED);
        }
        throw new CustomException("Request was not found");
    }

	@RequestMapping(value = "/get-request-anih", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForAnih() throws CustomException
    {
        List<RegistrationRequestsEntity> regs = requestRepository.findRequestsForAnih();
        for (RegistrationRequestsEntity reg : regs)
        {
            reg = medicamentAnnihilationRequestService.findMedAnnihilationRegistrationById(reg.getId());
        }

        regs.stream().map(rr -> {
            try
            {
                return medicamentAnnihilationRequestService.findMedAnnihilationRegistrationById(rr.getId());
            }
            catch (CustomException c)
            {
                return null;
            }
        }).collect(Collectors.toList());

        regs.sort(Comparator.comparing(o -> o.getStartDate()));
        return new ResponseEntity<>(regs, HttpStatus.OK);
    }


    @RequestMapping(value = "/get-anih-meds", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OutputDocumentsEntity>> getAnihMeds()
    {
        List<OutputDocumentsEntity> dds = outputDocumentsRepository.findAnihMed();
        dds.sort(Comparator.comparing(o -> o.getDate(), Comparator.reverseOrder()));
        return new ResponseEntity<>(dds, HttpStatus.OK);
    }

    @GetMapping(value = "/validate-idnp")
    public ResponseEntity<Boolean> validateIDNP(@RequestParam(value = "idnp") String idnp )
    {
        Boolean valid = Utils.validateIdnp(idnp);
        return new ResponseEntity<>(valid, HttpStatus.OK);
    }

    @RequestMapping(value = "/interrupt-gmp-process", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> interruptProcess(@RequestBody InterruptDetailsDTO interruptDetailsDTO)
    {
        LOGGER.debug("Interrupt GMP process");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(interruptDetailsDTO.getRequestId());

        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("C");
        registrationRequestsEntity.setAssignedUser(interruptDetailsDTO.getUsername());
        registrationRequestsEntity.setInterruptionReason(interruptDetailsDTO.getReason());

        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(interruptDetailsDTO.getUsername());
        historyEntity.setStep("I");
        historyEntity.setStartDate(interruptDetailsDTO.getStartDate());
        historyEntity.setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);
        GMPAuthorizationEntity gmpAuthorizationEntity = registrationRequestsEntity.getGmpAuthorizations().stream().findFirst().orElse(new GMPAuthorizationEntity());
        if(gmpAuthorizationEntity.getId()!=null)
        {
            gmpAuthorizationEntity.setStatus("C");
        }

        requestRepository.save(registrationRequestsEntity);

        auditLogService.save(new AuditLogEntity().withField("Intrerupere proces, numar cerere").withAction(Constants.AUDIT_ACTIONS.INTERRUPT.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name())
                .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_12.name()).withEntityId(null).withRequestId(registrationRequestsEntity.getId()).withNewValue(registrationRequestsEntity.getRequestNumber()));
        auditLogService.save(new AuditLogEntity().withField("Intrerupere proces, motiv").withAction(Constants.AUDIT_ACTIONS.INTERRUPT.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name())
                .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_12.name()).withEntityId(null).withRequestId(registrationRequestsEntity.getId()).withNewValue(registrationRequestsEntity.getInterruptionReason()));

        return new ResponseEntity<>(HttpStatus.OK);
    }

}