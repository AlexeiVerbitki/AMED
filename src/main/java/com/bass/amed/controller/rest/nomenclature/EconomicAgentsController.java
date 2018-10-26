package com.bass.amed.controller.rest.nomenclature;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.repository.EconomicAgentsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @RequestMapping(value = "/all-economic-agents", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> loadAllEconomicAgents()
    {
        logger.debug("Load all economic agents");
        return new ResponseEntity<>(economicAgentsRepository.findAll(), HttpStatus.OK);
    }
}
