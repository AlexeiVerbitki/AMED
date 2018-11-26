package com.bass.amed.controller.rest.drugsubstancetypes;


import com.bass.amed.entity.DrugSubstanceTypesEntity;
import com.bass.amed.repository.drugs.DrugSubstanceTypesRepository;
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
@RequestMapping( "/api/drug-substance-types" )
public class DrugSubstanceTypesController {

    private static final Logger logger = LoggerFactory.getLogger(DrugSubstanceTypesController.class);

    @Autowired
    private DrugSubstanceTypesRepository drugSubstanceTypesRepository;

    @GetMapping("/all-drug-substance-types")
    public ResponseEntity<List<DrugSubstanceTypesEntity>> getAllDrugSubstanceTypes()
    {
        logger.debug("Retrieve all drug substance types");
        return new ResponseEntity<>(drugSubstanceTypesRepository.findAll(), HttpStatus.OK);
    }

}
