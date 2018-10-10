package com.bass.amed.controller.rest;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.NmPharmaceuticalFormsEntity;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.impl.ImportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/import")
public class ImportController
{
    private static final Logger logger = LoggerFactory.getLogger(ImportController.class);

    @Autowired
    private GenerateDocNumberService generateDocNumberService;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private ImportService importService;

    @RequestMapping(value = "/generate-doc-nr")
    public ResponseEntity<Integer> generateDocNr()
    {
        return new ResponseEntity<>(generateDocNumberService.getDocumentNumber(), HttpStatus.OK);
    }

    @RequestMapping("/all-companies")
    public ResponseEntity<List<NmEconomicAgentsEntity>> retrieveAllEconomicAgents()
    {
        logger.debug("Retrieve all economic agents");
        return new ResponseEntity<>(economicAgentsRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping("/save")
    public MedicamentEntity saveImport(@Valid @RequestBody MedicamentEntity medicamentEntity)
    {
        logger.debug("Save Import");
        return importService.saveImport(medicamentEntity);
    }

//    public ResponseEntity<MedicamentEntity> saveMedicament(){
//        return registerService.registerMedicament();
//    }

}
