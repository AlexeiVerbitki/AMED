package com.bass.amed.controller.rest.medicamenttypes;

import com.bass.amed.entity.NmMedicamentTypeEntity;
import com.bass.amed.repository.NmMedicamentTypeRepository;
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
@RequestMapping( "/api/medicament-type" )
public class MedicamentTypeController
{

    private static final Logger logger = LoggerFactory.getLogger(MedicamentTypeController.class);

    @Autowired
    private NmMedicamentTypeRepository medicamentTypeRepository;

    @GetMapping("/all-medicament-types")
    public ResponseEntity<List<NmMedicamentTypeEntity>> getAllMedicamentTypes()
    {
        logger.debug("Retrieve all medicament types");
        return new ResponseEntity<>(medicamentTypeRepository.findAll(), HttpStatus.OK);
    }

}
