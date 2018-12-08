package com.bass.amed.controller.rest.drugs;

import com.bass.amed.dto.drugs.DrugDecisionsFilterDTO;
import com.bass.amed.repository.drugs.DrugDecisionsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/drug-decisions")
public class DrugDecisionsController {

    private static final Logger logger = LoggerFactory.getLogger(DrugDecisionsController.class);

    @Autowired
    DrugDecisionsRepository drugDecisionsRepository;

    @PostMapping(value = "/by-filter")
    public ResponseEntity<List<DrugDecisionsFilterDTO>> getDrugDecisionsByFilter(@RequestBody DrugDecisionsFilterDTO filter) {
        logger.debug("get drug decisions by filter");
        List<DrugDecisionsFilterDTO> dtos = drugDecisionsRepository.getDrugDecisionsByFilter(filter.getProtocolNr(),
                filter.getProtocolDate(),
                filter.getDrugSubstanceTypesId(),
                filter.getMedicamentId(),
                filter.getCompanyId()
        );

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @RequestMapping(value = "/by-id")
    public ResponseEntity<List<DrugDecisionsFilterDTO>> getDrugDecisionsById(String id) {
        logger.debug("get drug decisions by id");
        List<DrugDecisionsFilterDTO> dtos = drugDecisionsRepository.getDrugDecisionsById( id );

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

}
