package com.bass.amed.controller.rest.pharmaceuticalforms;

import com.bass.amed.entity.NmPharmaceuticalFormsEntity;
import com.bass.amed.repository.PharmaceuticalFormsRepository;
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
@RequestMapping( "/api/pharmaceutical-forms" )
public class PharmaceuticalFormsController {

    private static final Logger logger = LoggerFactory.getLogger(PharmaceuticalFormsController.class);

    @Autowired
    private PharmaceuticalFormsRepository pharmaceuticalFormsRepository;

    @GetMapping("/all-pharmaceutical-forms")
    public ResponseEntity<List<NmPharmaceuticalFormsEntity>> getAllMedicamentTypes()
    {
        logger.debug("Retrieve all pharmaceutical forms");
        return new ResponseEntity<>(pharmaceuticalFormsRepository.findAll(), HttpStatus.OK);
    }

}
