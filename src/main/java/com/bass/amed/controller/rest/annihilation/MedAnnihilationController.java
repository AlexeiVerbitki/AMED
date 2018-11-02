package com.bass.amed.controller.rest.annihilation;

import com.bass.amed.controller.rest.license.LicenseController;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import com.bass.amed.exception.CustomException;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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


    @RequestMapping(value = "/new-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextNewLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
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
}
