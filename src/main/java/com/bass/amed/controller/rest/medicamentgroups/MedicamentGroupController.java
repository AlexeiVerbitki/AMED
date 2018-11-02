package com.bass.amed.controller.rest.medicamentgroups;
import com.bass.amed.entity.NmMedicamentGroupEntity;
import com.bass.amed.repository.NmMedicamentGroupRepository;
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
@RequestMapping( "/api/medicament-group" )
public class MedicamentGroupController {

    private static final Logger logger = LoggerFactory.getLogger(MedicamentGroupController.class);

    @Autowired
    private NmMedicamentGroupRepository medicamentGroupRepository;

    @GetMapping("/all-medicament-groups")
    public ResponseEntity<List<NmMedicamentGroupEntity>> getAllMedicamentTypes()
    {
        logger.debug("Retrieve all medicament groups");
        return new ResponseEntity<>(medicamentGroupRepository.findAll(), HttpStatus.OK);
    }
}
