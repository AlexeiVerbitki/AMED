package com.bass.amed.controller.rest.license;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.repository.license.LicenseActivityTypeRepository;
import com.bass.amed.repository.license.LicenseAnnounceMethodsRepository;
import com.bass.amed.repository.license.LicenseMandatedContactRepository;
import com.bass.amed.repository.license.LicensesRepository;
import com.bass.amed.service.LicenseRegistrationRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Comparator;
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

//        Optional<NmEconomicAgentsEntity> eco = economicAgentsRepository.findById(request.getCompany().getId());
//
//        if (!eco.isPresent())
//        {
//            throw new CustomException("Economic agent not found" + request.getCompany().getId());
//        }
//
//        request.setCompany(eco.get());
//        request.getLicense().setEconomicAgent(eco.get());

        request.setType(requestTypeRepository.findByCode("LICEL").get());
        request.getLicense().setStatus("A");

//        requestRepository.save(request);


        licenseRegistrationRequestService.saveNewLicense(request);


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
        request.setEndDate(new Timestamp(new Date().getTime()));

        licenseRegistrationRequestService.finishLicense(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-issue-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> confirmIssueLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm issue license" + request);

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


    @RequestMapping(value = "/confirm-modify-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmModifyLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm modify license" + request);

        request.setType(requestTypeRepository.findByCode("LICM").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(),HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-duplicate-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmDuplicateLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm duplicate license" + request);

        request.setType(requestTypeRepository.findByCode("LICD").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(),HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-license-by-request-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadLicenseById(@RequestParam("id") String id) throws  CustomException
    {
        logger.debug("Retrieve license by request id", id);
        RegistrationRequestsEntity r = licenseRegistrationRequestService.findLicenseRegistrationById(Integer.valueOf(id));




        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-license-by-idno", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LicensesEntity> loadLicenseByCompany(@RequestParam("idno") String idno) throws  CustomException
    {
        logger.debug("Retrieve license by company id idno", idno);
        Optional<NmEconomicAgentsEntity> firstChoice = economicAgentsRepository.findFirstByIdnoEqualsAndLicenseIdIsNotNull(idno);
        Optional<LicensesEntity> r = Optional.empty();
            if (firstChoice.isPresent())
        {
            r = licensesRepository.getActiveLicenseById(firstChoice.get().getLicenseId(), new Date());
        }
        return new ResponseEntity<>(r.isPresent() ? r.get() : null, HttpStatus.OK);
    }


    @RequestMapping(value = "/retrieve-agents-by-idno-without-license", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> loadAgentsByIdnoWitouhtLicense(@RequestParam("idno") String idno) throws  CustomException
    {
        logger.debug("Retrieve agents by idno", idno);
        List<NmEconomicAgentsEntity> all = economicAgentsRepository.findAllByIdnoEndsWithAndLicenseIdIsNull(idno);
        for (NmEconomicAgentsEntity ece : all)
        {
            Optional<LicenseAgentPharmaceutistEntity> selectedPharmaceutist = ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate));
            ece.setSelectedPharmaceutist(selectedPharmaceutist.isPresent() ? selectedPharmaceutist.get() : null);
        }

        return new ResponseEntity<>(all, HttpStatus.OK);
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
