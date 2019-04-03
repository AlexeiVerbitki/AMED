package com.bass.amed.controller.rest;

import com.bass.amed.repository.RequestRepository;
import com.bass.amed.service.XchangeUpdateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
    public ResponseEntity<Void> getNewCurrencyRates()
    {
        LOGGER.debug("update currencies request");

        try
        {
            xchangeUpdateService.execute();
        }
        catch (Exception e)
        {
            LOGGER.error(e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/set-critical-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> setCriticalRequest(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean critical)
    {
        LOGGER.debug("set critical request");
        try
        {
            requestRepository.setCriticalRequest(requestId, critical);
        }
        catch (Exception e)
        {
            LOGGER.error(e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value = "/set-expired-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> setExpiredRequest(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean expired)
    {
        LOGGER.debug("set expired request");
        try
        {
            requestRepository.setExpiredRequest(requestId, expired);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Succes!!!", HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-evaluation-medicament-registration", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> waitEvaluationMedicamentRegistration(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-evaluation-medicament-registration");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-request-additional-data-response", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> waitRequestAdditionalDataResponse(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-request-additional-data-response");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-payment-order-issue-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> waitPaymentOrderIssueCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-payment-order-issue-ct");
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-client-details-data-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> waitClientDetailsDataCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-payment-order-issue-ct");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/limit-finish-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> LimitFinishCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("limit-finish-ct");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-payment-order-issue-amend-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> waitPaymentOrderIssueAmendCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("waitPaymentOrderIssueAmendCt");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-client-details-data-amend-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> waitClientDetailsDataAmendCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("waitClientDetailsDataAmendCt");
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
