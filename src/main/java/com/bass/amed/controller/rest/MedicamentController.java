package com.bass.amed.controller.rest;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.repository.MedicamentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping( "/api" )
public class MedicamentController
{
    private static final Logger logger = LoggerFactory.getLogger(MedicamentController.class);

    @Autowired
    private MedicamentRepository medicamentRepository;

    @RequestMapping("/company-medicaments")
    public ResponseEntity<List<MedicamentEntity>> getCompanyMedicaments(Integer companyId)
    {
        logger.debug("Retrieve all medicaments of company");
        return new ResponseEntity<>(medicamentRepository.getMedicamentsByCompany(companyId), HttpStatus.OK);
    }

    @RequestMapping("/company-all-medicaments")
    public ResponseEntity<List<MedicamentEntity>> getAllMedicaments()
    {
        logger.debug("Retrieve all medicaments");
        return new ResponseEntity<>(medicamentRepository.findAll(), HttpStatus.OK);
    }
}
