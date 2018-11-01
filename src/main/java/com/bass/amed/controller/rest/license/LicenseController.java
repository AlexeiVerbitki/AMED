package com.bass.amed.controller.rest.license;

import com.bass.amed.common.Constants;
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
import java.util.Optional;

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

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @Autowired
    private LicenseActivityTypeRepository licenseActivityTypeRepository;

    @Autowired
    private LicenseMandatedContactRepository licenseMandatedContactRepository;

    @RequestMapping(value = "/new-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextNewLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Add license" + request);

        Optional<NmEconomicAgentsEntity> eco = economicAgentsRepository.findById(request.getCompany().getId());

        if (!eco.isPresent())
        {
            throw new CustomException("Economic agent not found" + request.getCompany().getId());
        }

        request.setCompany(eco.get());

        request.setType(requestTypeRepository.findByCode("LICEL").get());
        request.getLicense().setStatus("A");

//        requestRepository.save(request);


        licenseRegistrationRequestService.saveNewLicense(request);



        request.setCurrentStep(Constants.StepLink.MODULE + Constants.StepLink.LICENSE + "evaluate/" + request.getId());
        requestRepository.save(request);

        return new ResponseEntity<>(request.getId(),HttpStatus.CREATED);
    }


    @RequestMapping(value = "/save-evaluation-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveEvaluationLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Save evaluation license" + request);

        licenseRegistrationRequestService.updateRegistrationLicense(request, false);
        return new ResponseEntity<>(request.getId(),HttpStatus.OK);
    }

    @RequestMapping(value = "/next-evaluation-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextEvaluationLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Save evaluation license" + request);

        licenseRegistrationRequestService.updateRegistrationLicense(request, true);
        return new ResponseEntity<>(request.getId(),HttpStatus.OK);
    }


    @RequestMapping(value = "/finish-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> finishLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Finish license" + request);

        request.getLicense().setStatus("F");

        request.setCurrentStep("I");
        request.setEndDate(new Timestamp(new Date().getTime()));
        request.setCurrentStep(Constants.StepLink.MODULE + Constants.StepLink.LICENSE + "issue/" + request.getId());

        licenseRegistrationRequestService.finishLicense(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-issue-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> confirmIssueLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm issue license" + request);

        request.getLicense().setStatus("A");
        request.setCurrentStep("I");
        request.setCurrentStep(Constants.StepLink.MODULE + Constants.StepLink.LICENSE + "issue/" + request.getId());

        licenseRegistrationRequestService.finishLicense(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }



    @RequestMapping(value = "/stop-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> stopLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Cancel request license" + request);

        licenseRegistrationRequestService.stopLicense(request);
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

    @RequestMapping(value = "/retrieve-activities", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LicenseActivityTypeEntity>> loadActivities()
    {
        logger.debug("Retrieve all activities");
        return new ResponseEntity<>(licenseActivityTypeRepository.findAll(), HttpStatus.OK);
    }
}
