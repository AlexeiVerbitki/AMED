package com.bass.amed.controller.rest;

import com.bass.amed.dto.DrugsNomenclator;
import com.bass.amed.service.MedicamentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NomenclatorController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(NomenclatorController.class);

    @Autowired
    MedicamentService medicamentService;

    @GetMapping("/nomenclator/medicaments")
    public ResponseEntity<List<DrugsNomenclator>> getMedicamentNomenclator()
    {
        LOGGER.info("Start loading medicament nomenclature");

        List<DrugsNomenclator> medicamentEntities = medicamentService.retreiveAllMedicamentNomenclature();

        LOGGER.debug("Retrieved medicament nomenclature details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

    @GetMapping("/classifier/medicaments")
    public ResponseEntity<List<DrugsNomenclator>> getMedicamentClassifier()
    {
        LOGGER.info("Start loading medicament classifier");

        List<DrugsNomenclator> medicamentEntities = medicamentService.retreiveAllMedicamentNomenclature();

        LOGGER.debug("Retrieved medicament classifier details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

    @GetMapping("/classifier/prices")
    public ResponseEntity<List<DrugsNomenclator>> getPricesClassifier()
    {
        LOGGER.info("Start loading prices classifier");

        List<DrugsNomenclator> medicamentEntities = medicamentService.retreiveAllMedicamentNomenclature();

        LOGGER.debug("Retrieved prices classifier details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

    @GetMapping("/classifier/economic-agents")
    public ResponseEntity<List<DrugsNomenclator>> getEconomicAgentsClassifier()
    {
        LOGGER.info("Start loading economic agents classifier");

        List<DrugsNomenclator> medicamentEntities = medicamentService.retreiveAllMedicamentNomenclature();

        LOGGER.debug("Retrieved economic agents classifier details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }
}
