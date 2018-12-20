package com.bass.amed.controller.rest;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.repository.MedicamentRepository;
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
import java.util.Set;

@RestController
@RequestMapping("/api/nomenclator")
public class NomenclatorController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(NomenclatorController.class);

    @Autowired
    MedicamentService medicamentService;

    @GetMapping("/medicaments")
    public ResponseEntity<List<String>> getMedicamentNomenclator()
    {
        LOGGER.info("Start loading medicamnet nomenclator");

        List<String> medicamentEntities = medicamentService.retreiveAllMedicamentDetails();

        LOGGER.debug("Retrieved medicament details: ", medicamentEntities.toString());

        return new ResponseEntity<>(medicamentEntities, HttpStatus.OK);
    }
}
