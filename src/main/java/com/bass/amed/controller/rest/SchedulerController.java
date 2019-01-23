package com.bass.amed.controller.rest;

import com.bass.amed.service.XchangeUpdateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/communication/triggers")
public class SchedulerController {

    @Autowired
    private XchangeUpdateService xchangeUpdateService;

    @RequestMapping(value = "/currency-updating", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    public ResponseEntity<String> getNewCurrencyRates() {
        log.debug("update currencies request");

//        try {
//            xchangeUpdateService.execute();
//        } catch (Exception e) {
//            return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }
}
