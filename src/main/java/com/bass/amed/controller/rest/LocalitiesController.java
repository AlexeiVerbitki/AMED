package com.bass.amed.controller.rest;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.NmLocalitiesEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.service.LocalityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/localities")
public class LocalitiesController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(AdministrationController.class);


    @Autowired
    private LocalityService localityService;

    @RequestMapping("/load-locality")
    public ResponseEntity<NmLocalitiesEntity> getLocalityAndState(Integer id) throws CustomException
    {
        LOGGER.debug("Retrieve companies by name or idno");
        NmLocalitiesEntity localityById = localityService.findLocalityById(id);

        return new ResponseEntity<>(localityById, HttpStatus.OK);
    }
}
