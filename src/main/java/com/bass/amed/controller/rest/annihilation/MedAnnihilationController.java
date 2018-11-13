package com.bass.amed.controller.rest.annihilation;

import com.bass.amed.controller.rest.license.LicenseController;
import com.bass.amed.entity.AnnihilationCommisionsEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.AnnihilationCommisionRepository;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.repository.RequestTypeRepository;
import com.bass.amed.service.MedicamentAnnihilationRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping( "/api/annihilation" )
public class MedAnnihilationController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseController.class);

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private MedicamentAnnihilationRequestService medicamentAnnihilationRequestService;

    @Autowired
    private AnnihilationCommisionRepository annihilationRepository;


    @RequestMapping(value = "/new-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextNewAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add annihilation" + request);

        Optional<NmEconomicAgentsEntity> eco = economicAgentsRepository.findById(request.getCompany().getId());

        if (!eco.isPresent())
        {
            throw new CustomException("Economic agent not found" + request.getCompany().getId());
        }

        request.setCompany(eco.get());

        request.setType(requestTypeRepository.findByCode("INMD").get());
        request.getMedicamentAnnihilation().setStatus("A");

        medicamentAnnihilationRequestService.saveAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }



    @RequestMapping(value = "/confirm-evaluate-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmEvaluateAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Confirm annihilation" + request);
        medicamentAnnihilationRequestService.updateAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }


    @RequestMapping(value = "/next-evaluate-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextEvaluateAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Next evaluate annihilation" + request);
        medicamentAnnihilationRequestService.updateAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/finish-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> finishAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Finish annihilation" + request);
        medicamentAnnihilationRequestService.finishAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }


    @RequestMapping(value = "/retrieve-annihilation-by-request-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadAnnihilationById(@RequestParam("id") String id) throws  CustomException
    {
        LOGGER.debug("Retrieve license by request id", id);
        RegistrationRequestsEntity r = medicamentAnnihilationRequestService.findMedAnnihilationRegistrationById(Integer.valueOf(id));
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-all-commisions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AnnihilationCommisionsEntity>> loadAllCommisions()
    {
        LOGGER.debug("Retrieve all commisions");
        return new ResponseEntity<>(annihilationRepository.findAll(), HttpStatus.OK);
    }
}
