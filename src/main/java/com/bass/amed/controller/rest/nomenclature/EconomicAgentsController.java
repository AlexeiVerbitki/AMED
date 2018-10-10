package com.bass.amed.controller.rest.nomenclature;

import com.bass.amed.controller.rest.license.LicenseController;
import com.bass.amed.entity.LicensesEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.repository.LicensesRepository;
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

import java.util.List;

@RestController
@RequestMapping( "/api/nomenclature" )
public class EconomicAgentsController
{
    private static final Logger logger = LoggerFactory.getLogger(EconomicAgentsController.class);

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @RequestMapping(value = "/new-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> saveLicense(@RequestBody LicensesEntity license)
    {
        logger.debug("Add license" + license);
        return new ResponseEntity<>(economicAgentsRepository.findAll(), HttpStatus.CREATED);
    }
}
