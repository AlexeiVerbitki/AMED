package com.bass.amed.controller.rest.nomenclature;

import com.bass.amed.dto.nomenclature.EcAgents;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.service.EconomicAgentService;
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
    @Autowired
    private EconomicAgentService economicAgentService;

    @RequestMapping(value = "/all-economic-agents", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> loadAllEconomicAgents()
    {
        logger.debug("Load all economic agents");
        return new ResponseEntity<>(economicAgentsRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/all-economic-agents-by-idno", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> loadAllEconomicAgentsByIdno()
    {
        logger.debug("Load all economic agents");
        return new ResponseEntity<>(economicAgentsRepository.loadAllAgentsGroupByIdno(), HttpStatus.OK);
    }


    @RequestMapping(value = "/agent/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveAgent(@RequestBody List<NmEconomicAgentsEntity> nmEconomicAgentsEntities) throws CustomException
    {
        logger.debug("Save economic agents");

        if ( economicAgentsRepository.findAllByIdno(nmEconomicAgentsEntities.get(0).getIdno()).size() > 1)
        {
            throw new CustomException("Idno already exists");
        }

        economicAgentService.saveNewAgents(nmEconomicAgentsEntities);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @RequestMapping(value = "/agent/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> editAgent(@RequestBody List<NmEconomicAgentsEntity> nmEconomicAgentsEntities) throws CustomException
    {
        logger.debug("Save economic agents");

        economicAgentService.editAgents(nmEconomicAgentsEntities);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/agent/generate-code-agent")
    public ResponseEntity<Integer> generateCodeAgent() {
        return new ResponseEntity<>(economicAgentService.generateCode(), HttpStatus.OK);
    }


    @RequestMapping(value = "/parent-for-idno", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NmEconomicAgentsEntity> parentForIdno(String idno) throws CustomException
    {
        logger.debug("Load parent for idno");
        return new ResponseEntity<>(economicAgentsRepository.getParentForIdno(idno).orElseThrow( () -> new CustomException("Nu s-a gasit contul parinte pentru acest IDNO")), HttpStatus.OK);
    }

    @RequestMapping(value = "/filials-for-idno", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> filialsPerIdno(String idno)
    {
        logger.debug("Load filials for idno");
        return new ResponseEntity<>(economicAgentsRepository.loadFilialsForIdno(idno), HttpStatus.OK);
    }
}
