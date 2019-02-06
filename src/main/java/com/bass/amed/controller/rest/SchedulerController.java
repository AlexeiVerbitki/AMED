package com.bass.amed.controller.rest;

import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.service.XchangeUpdateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.ldap.LdapUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.naming.directory.DirContext;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/communication/triggers")
public class SchedulerController
{

    @Autowired
    private XchangeUpdateService xchangeUpdateService;
    @Autowired
    private RequestRepository    requestRepository;

    //    ##################
    @Autowired
    private LdapContextSource contextSource;
    @Autowired
    private LdapTemplate      ldapTemplate;
    private DirContext        ctx = null;

    @RequestMapping(value = "/currency-updating", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    public ResponseEntity<Void> getNewCurrencyRates()
    {
        LOGGER.debug("update currencies request");

        try
        {
//            xchangeUpdateService.execute();
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
            return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
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
        return new ResponseEntity<>("Succes!!!", HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-request-additional-data-response", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> waitRequestAdditionalDataResponse(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-request-additional-data-response");
        return new ResponseEntity<>("Succes!!!", HttpStatus.OK);
    }

    public List getAllPersonNames()
    {
        return ldapTemplate.search("OU=DEV,OU=BASS", "(objectclass=person)",
                //                (AttributesMapper) attrs -> attrs.get("cn").);
                (AttributesMapper) attrs -> attrs.getAll());
    }

    @GetMapping("/getUserDetails")
    void getUserDetails() throws CustomException
    {
        try
        {
            String filterStr = new EqualsFilter("userPrincipalName", "dumitru.ginu@bass.md").encode();

            contextSource.setUserDn("dumitru.ginu@bass.md");
            contextSource.setPassword("parola treb pusa");

            SecurityContextHolder.getContext().getAuthentication();

            boolean authed = ldapTemplate.authenticate("OU=BASS", filterStr, "parola treb pusa");
            System.out.println("Authenticated: " + authed);
            System.out.println(filterStr);

            List list = getAllPersonNames();
            System.out.println(list.toString());

            LOGGER.info("Login success");
        }
        catch (Exception e)
        {
            LOGGER.error("Login failed", e.getMessage());
            throw new CustomException(e.getMessage());
        }
        finally
        {
            LdapUtils.closeContext(ctx);
        }

    }

    @RequestMapping(value = "/wait-payment-order-issue-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> waitPaymentOrderIssueCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-payment-order-issue-ct");
        return new ResponseEntity<String>("Succes!!!",HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-client-details-data-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> waitClientDetailsDataCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("wait-payment-order-issue-ct");
        return new ResponseEntity<String>("Succes!!!",HttpStatus.OK);
    }

    @RequestMapping(value = "/limit-finish-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> LimitFinishCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("limit-finish-ct");
        return new ResponseEntity<String>("Succes!!!",HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-payment-order-issue-amend-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> waitPaymentOrderIssueAmendCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("waitPaymentOrderIssueAmendCt");
        return new ResponseEntity<String>("Succes!!!",HttpStatus.OK);
    }

    @RequestMapping(value = "/wait-client-details-data-amend-ct", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> waitClientDetailsDataAmendCt(@RequestParam(value = "requestId") Integer requestId, @RequestParam(value = "value") Boolean value)
    {
        LOGGER.debug("waitClientDetailsDataAmendCt");
        return new ResponseEntity<String>("Succes!!!",HttpStatus.OK);
    }
}
