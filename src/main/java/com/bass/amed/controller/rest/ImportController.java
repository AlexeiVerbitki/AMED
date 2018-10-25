package com.bass.amed.controller.rest;

import com.bass.amed.entity.*;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.impl.ImportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/import")
public class ImportController
{
    private static final Logger logger = LoggerFactory.getLogger(ImportController.class);

    @Autowired
    private GenerateDocNumberService generateDocNumberService;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private ImportService importService;

    @RequestMapping(value = "/generate-doc-nr")
    public ResponseEntity<Integer> generateDocNr()
    {
        return new ResponseEntity<>(generateDocNumberService.getDocumentNumber(), HttpStatus.OK);
    }

    @RequestMapping("/all-companies")
    public ResponseEntity<List<NmEconomicAgentsEntity>> retrieveAllEconomicAgents()
    {
        logger.debug("Retrieve all economic agents");
        return new ResponseEntity<>(economicAgentsRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<Integer> saveImport(@Valid @RequestBody ImportAuthorizationEntity importAuthorizationEntity)
    {
        logger.debug("Save Import");
        importAuthorizationEntity.setStartDate(new Timestamp(new Date().getTime()));
        importService.saveImport(importAuthorizationEntity);
        return new ResponseEntity<>(importAuthorizationEntity.getId(), HttpStatus.CREATED);
    }

//    @RequestMapping(value = "/new-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Integer> saveNewLicense(@RequestBody RegistrationRequestsEntity request)
//    {
//        logger.debug("Add license" + request);
//        request.setCurrentStep("E");
//        RegistrationRequestHistoryEntity registrationRequestHistory = new RegistrationRequestHistoryEntity();
//        registrationRequestHistory.setStartDate(new Timestamp(new Date().getTime()));
//        registrationRequestHistory.setStep("E");
//        //TODO
//        registrationRequestHistory.setUsername("username");
//        request.getRequestHistories().add(registrationRequestHistory);
//        request.setStartDate(new Timestamp(new Date().getTime()));
//        request.setType(requestTypeRepository.findByCode("LICEL").get());
//
//        requestRepository.save(request);
//        return new ResponseEntity<>(request.getId(),HttpStatus.CREATED);
//    }
}
