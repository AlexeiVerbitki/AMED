package com.bass.amed.controller.rest;

import com.bass.amed.dto.TasksDTO;
import com.bass.amed.entity.ProcessNamesEntity;
import com.bass.amed.entity.RegistrationRequestStepsEntity;
import com.bass.amed.entity.RequestTypesEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.ProcessNamesRepository;
import com.bass.amed.repository.RegistrationRequestStepRepository;
import com.bass.amed.repository.RequestTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TasksController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(TasksController.class);
    @Autowired
    ProcessNamesRepository processNamesRepository;
    @Autowired
    RequestTypeRepository requestTypeRepository;
    @Autowired
    RegistrationRequestStepRepository registrationRequestStepRepository;

    @GetMapping(value = "/request-names")
    public ResponseEntity<List<ProcessNamesEntity>> getRequestNames()
    {
        LOGGER.debug("Get process names");
        List<ProcessNamesEntity> processNames = processNamesRepository.findAll();
        return new ResponseEntity<>(processNames, HttpStatus.OK);
    }

    @GetMapping(value = "/request-types")
    public ResponseEntity<List<RequestTypesEntity>> getRequestTypes(@RequestParam(value = "id") Integer id) throws CustomException
    {
        LOGGER.debug("Get process types");
        Optional<List<RequestTypesEntity>> requestTypesEntityList = requestTypeRepository.findByProcessId(id);
        return new ResponseEntity<>(requestTypesEntityList.orElseThrow(() -> new CustomException("Request was not found")), HttpStatus.OK);
    }

    @GetMapping(value = "/request-steps")
    public ResponseEntity<List<RegistrationRequestStepsEntity>> getRegistrationRequestSteps(@RequestParam(value = "id") Integer id) throws CustomException
    {
        LOGGER.debug("Get process steps");
        Optional<List<RegistrationRequestStepsEntity>> requestTypesStepEntityList = registrationRequestStepRepository.findByRequestTypeId(id);
        return new ResponseEntity<>(requestTypesStepEntityList.orElseThrow(() -> new CustomException("Request was not found")), HttpStatus.OK);
    }

    @PostMapping(value = "/get-filtered-tasks")
    public ResponseEntity<String> getTasksByFilter(@RequestBody TasksDTO filter)
    {

        if (filter.getId() != null)
        {

        }
        System.out.println(filter);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

}
