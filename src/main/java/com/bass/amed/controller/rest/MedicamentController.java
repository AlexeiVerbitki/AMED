package com.bass.amed.controller.rest;

import com.bass.amed.dto.InterruptDetailsDTO;
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


//    @RequestMapping("/company-medicaments")
//    public ResponseEntity<List<MedicamentDetailsForPraceRegProjection>> getCompanyMedicaments(@RequestParam(value = "companyId") Integer companyId)
//    {
//
//        logger.debug("Retrieve all medicaments of company");
//        NmEconomicAgentsEntity company = economicAgentsRepository.findById(companyId).get();
//
//        List<MedicamentDetailsForPraceRegProjection> meds = medicamentRepository.findAllByCompanyAndStatus(company, "F");
//
//        return new ResponseEntity<>(meds, HttpStatus.OK);
//    }

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


    @RequestMapping("/search-medicament-names-by-name-or-code")
    public ResponseEntity<List<MedicamentNamesListProjection>> getAllMedicamentNamesByNameAndCode(String partialName)
    {
        logger.debug("Retrieve medicament names list by name");
        return new ResponseEntity<>(medicamentRepository.getMedicamentsByNameAndCode( partialName, partialName, "F"), HttpStatus.OK);
    }

    @RequestMapping("/search-medicament-by-id")
    public ResponseEntity<MedicamentEntity> getMedicamentById(Integer id)
    {
        logger.debug("Retrieve medicament by id");
        return new ResponseEntity<>(medicamentRepository.findById(id).get(), HttpStatus.OK);
    }

    @RequestMapping(value = "/interrupt-process", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> interruptProcess(@RequestBody InterruptDetailsDTO interruptDetailsDTO)
    {
        logger.debug("Interrupt process");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(interruptDetailsDTO.getRequestId());

        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        registrationRequestsEntity.setCurrentStep("C");
        registrationRequestsEntity.setInterruptionReason(interruptDetailsDTO.getReason());

        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(interruptDetailsDTO.getUsername());
        historyEntity.setStep("I");
        historyEntity.setStartDate(interruptDetailsDTO.getStartDate());
        historyEntity.setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(interruptDetailsDTO.getUsername());
        historyEntity.setStep("C");
        historyEntity.setStartDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
