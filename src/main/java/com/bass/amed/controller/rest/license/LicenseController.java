package com.bass.amed.controller.rest.license;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.LicenseRegistrationRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping( "/api/license" )
public class LicenseController
{
    private static final Logger logger = LoggerFactory.getLogger(LicenseController.class);

    @Autowired
    private LicensesRepository licensesRepository;

    @Autowired
    private LicenseRequestTypeRepository licenseRequestTypeRepository;

    @Autowired
    private LicenseAnnounceMethodsRepository licenseAnnounceMethodsRepository;


    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Autowired
    private LicenseRegistrationRequestService licenseRegistrationRequestService;

    @RequestMapping(value = "/new-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveNewLicense(@RequestBody RegistrationRequestsEntity request)
    {
        logger.debug("Add license" + request);
        request.setCurrentStep("E");
        RegistrationRequestHistoryEntity registrationRequestHistory = new RegistrationRequestHistoryEntity();
        registrationRequestHistory.setStartDate(new Timestamp(new Date().getTime()));
        registrationRequestHistory.setStep("E");
        //TODO
        registrationRequestHistory.setUsername("username");
        request.getRequestHistories().add(registrationRequestHistory);
        request.setStartDate(new Timestamp(new Date().getTime()));
        request.setType(requestTypeRepository.findByCode("LICEL").get());

        requestRepository.save(request);
        return new ResponseEntity<>(request.getId(),HttpStatus.CREATED);
    }

    @RequestMapping(value = "/save-evaluation-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveEvaluationLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Save evaluation license" + request);

        licenseRegistrationRequestService.updateRegistrationLicense(request);
        return new ResponseEntity<>(request.getId(),HttpStatus.OK);
    }

    @RequestMapping(value = "/all-license-request-types", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LicenseRequestTypeEntity>> loadRequestTypes()
    {
        logger.debug("Retrieve all license request types");
        return new ResponseEntity<>(licenseRequestTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-license-by-request-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadLicenseById(@RequestParam("id") String id) throws  CustomException
    {
        logger.debug("Retrieve license by request id", id);
        RegistrationRequestsEntity r = licenseRegistrationRequestService.findLicenseRegistrationById(Integer.valueOf(id));
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-announce-methods", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LicenseAnnounceMethodsEntity>> loadAnnounceMethods()
    {
        logger.debug("Retrieve announce metthods");
        return new ResponseEntity<>(licenseAnnounceMethodsRepository.findAll(), HttpStatus.OK);
    }
}
