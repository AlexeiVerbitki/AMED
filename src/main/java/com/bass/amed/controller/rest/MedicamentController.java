package com.bass.amed.controller.rest;

import com.bass.amed.dto.DocumentDTO;
import com.bass.amed.entity.*;
import com.bass.amed.projection.MedicamentDetailsForPraceRegProjection;
import com.bass.amed.projection.MedicamentNamesListProjection;
import com.bass.amed.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/medicaments")
public class MedicamentController
{
    private static final Logger logger = LoggerFactory.getLogger(MedicamentController.class);

    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private DocumentsRepository documentsRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private OutputDocumentsRepository outputDocumentsRepository;


    @RequestMapping("/company-medicaments")
    public ResponseEntity<List<MedicamentDetailsForPraceRegProjection>> getCompanyMedicaments(@RequestParam(value = "companyId") Integer companyId)
    {

        logger.debug("Retrieve all medicaments of company");
        NmEconomicAgentsEntity company = economicAgentsRepository.findById(companyId).get();

        List<MedicamentDetailsForPraceRegProjection> meds = medicamentRepository.findAllByCompany(company);

        return new ResponseEntity<>(meds, HttpStatus.OK);
    }

    @RequestMapping("/company-all-medicaments")
    public ResponseEntity<List<MedicamentEntity>> getAllMedicaments()
    {


        logger.debug("Retrieve all medicaments");
        return new ResponseEntity<>(medicamentRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/search-medicament-names-by-name")
    public ResponseEntity<List<MedicamentNamesListProjection>> getAllMedicamentNamesByName(String partialName)
    {
        logger.debug("Retrieve medicament names list by name");
        return new ResponseEntity<>(medicamentRepository.findByNameStartingWithIgnoreCase(partialName), HttpStatus.OK);
    }

    @RequestMapping("/search-medicament-by-id")
    public ResponseEntity<MedicamentEntity> getMedicamentById(Integer id)
    {
        logger.debug("Retrieve medicament by id");
        return new ResponseEntity<>(medicamentRepository.findById(id).get(), HttpStatus.OK);
    }

    @RequestMapping(value = "/save-request-additional-data", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveRequestAdditionalData(@RequestBody DocumentDTO documentDTO)
    {
        logger.debug("Save request additional data");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(documentDTO.getRequestId());
        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("S");

        fillHistoryDetails(documentDTO, registrationRequestsEntity, "S");

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/save-laboratory-analysis", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveLaboratoryAnalysis(@RequestBody DocumentDTO documentDTO)
    {
        logger.debug("Save LaboratoryAnalysis");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(documentDTO.getRequestId());
        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("L");

        fillHistoryDetails(documentDTO, registrationRequestsEntity, "L");

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void fillHistoryDetails(@RequestBody DocumentDTO documentDTO, RegistrationRequestsEntity registrationRequestsEntity, String l)
    {
        fillDocumentDetails(documentDTO, registrationRequestsEntity);
        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(documentDTO.getUsername());
        historyEntity.setStep("E");
        historyEntity.setStartDate(documentDTO.getStartDate());
        Timestamp stepDate = new Timestamp(System.currentTimeMillis());
        historyEntity.setEndDate(stepDate);
        registrationRequestsEntity.getRequestHistories().add(historyEntity);
        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(documentDTO.getUsername());
        historyEntity.setStep(l);
        historyEntity.setStartDate(stepDate);
        registrationRequestsEntity.getRequestHistories().add(historyEntity);
    }

    @RequestMapping(value = "/save-notification-letter", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveNotificationLetter(@RequestBody DocumentDTO documentDTO)
    {
        logger.debug("Save notification letter");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(documentDTO.getRequestId());
        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();

        fillDocumentDetails(documentDTO, registrationRequestsEntity);

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void fillLastWaitingStep(@RequestBody DocumentDTO documentDTO, RegistrationRequestsEntity registrationRequestsEntity, Timestamp endDate)
    {
        Optional<RegistrationRequestHistoryEntity> registrationRequestHistoryEntityOpt =
                registrationRequestsEntity.getRequestHistories().stream().max((x, y) -> (int) x.getStartDate().getTime() - (int) y.getStartDate().getTime());
        RegistrationRequestHistoryEntity historyEntity = registrationRequestHistoryEntityOpt.get();
        if (historyEntity.getEndDate() == null)
        {
            registrationRequestHistoryEntityOpt.get().setEndDate(endDate);
        }
        fillDocumentDetails(documentDTO, registrationRequestsEntity);
    }

    @RequestMapping(value = "/save-order-interrupt", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveOrderInterrupt(@RequestBody DocumentDTO documentDTO)
    {
        logger.debug("Save order interrupt");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(documentDTO.getRequestId());

        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("C");
        registrationRequestsEntity.setInterruptionReason(documentDTO.getInterruptionReason());

        fillLastWaitingStep(documentDTO, registrationRequestsEntity, documentDTO.getStartDate());

        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(documentDTO.getUsername());
        historyEntity.setStep("I");
        historyEntity.setStartDate(documentDTO.getStartDate());
        historyEntity.setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(documentDTO.getUsername());
        historyEntity.setStep("C");
        historyEntity.setStartDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void fillDocumentDetails(@RequestBody DocumentDTO documentDTO, RegistrationRequestsEntity registrationRequestsEntity)
    {
        Optional<NmDocumentTypesEntity> docTypeEntity = documentTypeRepository.findByCategory(documentDTO.getDocType());
        if (docTypeEntity.isPresent())
        {
            DocumentsEntity documentsEntity = new DocumentsEntity();
            documentsEntity.setDate(documentDTO.getDate());
            documentsEntity.setName(documentDTO.getName());
            documentsEntity.setPath(documentDTO.getPath());
            documentsEntity.setEmail(documentDTO.getEmail());
            documentsEntity.setDocType(docTypeEntity.get());

            registrationRequestsEntity.getMedicament().getDocuments().add(documentsEntity);
        }
    }

    @RequestMapping(value = "/answer-received-request-additional-data", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> answerReceivedRequestAdditionalData(@RequestBody DocumentDTO documentDTO)
    {
        logger.debug("Answer received request additional data");

        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(documentDTO.getRequestId());
        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("E");

        if (documentDTO.getDocType() == null)
        {
            fillLastWaitingStep(documentDTO, registrationRequestsEntity, new Timestamp(Calendar.getInstance().getTime().getTime()));
        }
        else
        {
            Optional<RegistrationRequestHistoryEntity> registrationRequestHistoryEntityOpt =
                    registrationRequestsEntity.getRequestHistories().stream().filter(hist -> hist.getStep().equals("L")).max((x, y) -> (int) x.getStartDate().getTime() - (int) y.getStartDate().getTime());
            registrationRequestHistoryEntityOpt.get().setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        }

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/move-to-interrupt", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> moveToInterrupt(@RequestBody DocumentDTO documentDTO)
    {
        logger.debug("Move to interrupt from attempt answer page");

        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(documentDTO.getRequestId());
        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("I");

        Optional<RegistrationRequestHistoryEntity> registrationRequestHistoryEntityOpt =
                registrationRequestsEntity.getRequestHistories().stream().max(Comparator.comparingInt(x -> (int) x.getStartDate().getTime()));
        RegistrationRequestHistoryEntity historyEntity = registrationRequestHistoryEntityOpt.get();
        if (historyEntity.getEndDate() == null)
        {
            registrationRequestHistoryEntityOpt.get().setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        }

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
