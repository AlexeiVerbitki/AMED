package com.bass.amed.controller.rest.license;

import com.bass.amed.entity.LicensesEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.LicensesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping( "/api/license" )
public class LicenseController
{
    private static final Logger logger = LoggerFactory.getLogger(LicenseController.class);

    @Autowired
    private LicensesRepository licensesRepository;

    @RequestMapping(value = "/new-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveLicense(@RequestBody LicensesEntity license)
    {
        logger.debug("Add license" + license);

        licensesRepository.save(license);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
