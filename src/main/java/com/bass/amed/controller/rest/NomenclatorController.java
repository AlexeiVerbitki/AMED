package com.bass.amed.controller.rest;

import com.bass.amed.dto.DrugsNomenclator;
import com.bass.amed.dto.EconomicAgentsNomenclator;
import com.bass.amed.dto.PricesCatalogNomenclator;
import com.bass.amed.service.EconomicAgentService;
import com.bass.amed.service.MedicamentService;
import com.bass.amed.service.PriceEvaluationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class NomenclatorController {
    @Autowired
    MedicamentService medicamentService;

    @Autowired
    EconomicAgentService economicAgentService;

    @Autowired
    PriceEvaluationService priceEvaluationService;

    @GetMapping("/nomenclator/medicaments")
    public ResponseEntity<List<DrugsNomenclator>> getMedicamentNomenclator() {
        LOGGER.info("Start loading medicament nomenclature");

        List<DrugsNomenclator> medicamentEntities = medicamentService.retreiveAllMedicamentNomenclature();

        LOGGER.debug("Retrieved medicament nomenclature details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

    @GetMapping("/classifier/economic-agents")
    public ResponseEntity<List<EconomicAgentsNomenclator>> getEconomicAgentsNomenclator() {
        LOGGER.info("Start loading EconomicAgents nomenclator");

        List<EconomicAgentsNomenclator> economicAgentsNomenclator = economicAgentService.getEconomicAgentsNomenclature();

        LOGGER.debug("Retrieved EconomicAgents details: ", economicAgentsNomenclator.toString());

        return new ResponseEntity<>(economicAgentsNomenclator, HttpStatus.OK);
    }

    @GetMapping("/classifier/prices")
    public ResponseEntity<List<PricesCatalogNomenclator>> getPricesClassifier() {
        LOGGER.info("Start loading prices classifier");

        List<PricesCatalogNomenclator> medicamentEntities = priceEvaluationService.getNationalCatalogPricesNomenclature();

        LOGGER.debug("Retrieved prices classifier details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }

}
