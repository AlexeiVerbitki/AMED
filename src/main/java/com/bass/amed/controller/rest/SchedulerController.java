package com.bass.amed.controller.rest;

import com.bass.amed.repository.RequestRepository;
import com.bass.amed.service.XchangeUpdateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/communication/triggers")
public class SchedulerController
{

    @Autowired
    private XchangeUpdateService xchangeUpdateService;
    @Autowired
    private RequestRepository    requestRepository;

    @RequestMapping(value = "/currency-updating", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    public ResponseEntity<String> getNewCurrencyRates()
    {
        LOGGER.debug("update currencies request");

        try
        {
//            xchangeUpdateService.execute();
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/set-critical-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> setCriticalRequest(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean critical)
    {
        requestRepository.setCriticalRequest(requestId, critical);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/set-expired-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> setExpiredRequest(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean expired)
    {
        requestRepository.setExpiredRequest(requestId, expired);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
