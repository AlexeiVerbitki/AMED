package com.bass.amed.controller.rest;

import com.bass.amed.entity.NmMedicamentGroupEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import com.bass.amed.entity.RequestTypesEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.MedicamentGroupRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.repository.RequestTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class RequestController
{
    private static final Logger logger = LoggerFactory.getLogger(RequestController.class);

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private RequestTypeRepository requestTypeRepository;
    @Autowired
    private MedicamentGroupRepository medicamentGroupRepository;

    @RequestMapping(value = "/add-medicament-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveMedicamentRequest(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Add medicament");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());
        if(request.getMedicament().getGroup()!=null && !request.getMedicament().getGroup().getCode().isEmpty())
        {
            NmMedicamentGroupEntity nmMedicamentGroupEntity = medicamentGroupRepository.findByCode(request.getMedicament().getGroup().getCode());
            request.getMedicament().setGroup(nmMedicamentGroupEntity);
        }
        requestRepository.save(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/load-medicament-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getMedicamentRequestById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/add-clinical-trail-request", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveClinicalTrailRequest(@RequestBody RegistrationRequestsEntity requests) throws CustomException
    {
        requestRepository.save(requests);
        return new ResponseEntity<>(requests.getId(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/load-clinical-trail-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getClinicalTrailById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }
}
