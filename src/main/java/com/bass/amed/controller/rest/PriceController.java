package com.bass.amed.controller.rest;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.projection.GetMinimalCurrencyProjection;
import com.bass.amed.repository.CurrencyRepository;
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
@RequestMapping( "/api/price" )
public class PriceController
{
    private static final Logger logger = LoggerFactory.getLogger(PriceController.class);

    @Autowired
    private CurrencyRepository currencyRepository;

    @RequestMapping("/all-currencies-short")
    public ResponseEntity<List<GetMinimalCurrencyProjection>> getCurrencyShort()
    {
        logger.debug("Retrieve all currencies with minimal info");
        return new ResponseEntity<>(currencyRepository.findAllOnlyIdAndAndShortDescriptionBy(), HttpStatus.OK);
    }

    @RequestMapping("/today-currencies-short")
    public ResponseEntity<List<GetMinimalCurrencyProjection>> getTodayCurrencyShort()
    {
        logger.debug("Retrieve all currencies for toady with minimal info");
        return new ResponseEntity<>(currencyRepository.findAllOnlyIdAndAndShortDescriptionBy(), HttpStatus.OK);
    }
}
