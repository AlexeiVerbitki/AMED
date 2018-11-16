package com.bass.amed.controller.rest;

import com.bass.amed.dto.InterruptDetailsDTO;
import com.bass.amed.dto.SimilarMedicamentDTO;
import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.entity.RegistrationRequestHistoryEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import com.bass.amed.projection.MedicamentNamesListProjection;
import com.bass.amed.projection.MedicamentRegisterNumberProjection;
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
import java.util.Date;
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
        MedicamentEntity m = medicamentRepository.findById(id).get();
        return new ResponseEntity<>(m, HttpStatus.OK);
    }

    @RequestMapping("/search-medicaments-by-register-number")
    public ResponseEntity<List<MedicamentRegisterNumberProjection>> getMedicamentsByRegisterNumber(Integer registerNumber)
    {
        logger.debug("Retrieve medicaments by register number");
        return new ResponseEntity<>(medicamentRepository.findDistinctByRegistrationNumber(registerNumber), HttpStatus.OK);
    }

    @Autowired
    SimilarMedicamentsRepository similarMedicamentsRepository;
    @RequestMapping("/related")
    public ResponseEntity<List<SimilarMedicamentDTO>> getSimilarMedicaments(@RequestParam(value = "internationalNameId", required = true) Integer internationalNameId)
    {
        logger.debug("getSimilarMedicaments");
        List<SimilarMedicamentDTO> medicaments = similarMedicamentsRepository.getSimilarMedicaments(internationalNameId);
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }

    @RequestMapping(value = "/interrupt-process", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> interruptProcess(@RequestBody InterruptDetailsDTO interruptDetailsDTO)
    {
        logger.debug("Interrupt process");
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

        historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(interruptDetailsDTO.getUsername());
        historyEntity.setStep("C");
        historyEntity.setStartDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        registrationRequestsEntity.setEndDate(new Timestamp(new Date().getTime()));

        requestRepository.save(registrationRequestsEntity);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
