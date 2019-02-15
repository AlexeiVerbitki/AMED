package com.bass.amed.controller.rest.drugs;

import com.bass.amed.dto.ScheduledModuleResponse;
import com.bass.amed.dto.drugs.CompanyDetailsDTO;
import com.bass.amed.dto.drugs.DrugDecisionsFilterDTO;
import com.bass.amed.dto.drugs.DrugDecisionsFilterDetailsDTO;
import com.bass.amed.dto.drugs.OldDrugDecisionDetailsDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.EconomicAgentsRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.repository.RequestTypeRepository;
import com.bass.amed.repository.drugs.*;
import com.bass.amed.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drug-decisions")
public class DrugDecisionsController {

    private static final Logger logger = LoggerFactory.getLogger(DrugDecisionsController.class);

    @Autowired
    DrugDecisionsRepository drugDecisionsRepository;
    @Autowired
    DrugDecisionsFilterRepository drugDecisionsFilterRepository;
    @Autowired
    OldDrugDecisionDetailsRepository oldDrugDecisionDetailsRepository;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private AuthorizedDrugSubstancesRepository authorizedDrugSubstancesRepository;
    @Autowired
    private DrugImportExportDetailsRepository drugImportExportDetailsRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private RequestTypeRepository requestTypeRepository;
    @Autowired
    private DrugCheckDecisionRepository drugCheckDecisionRepository;
    @Autowired
    private DrugUnitsConversionRatesRepository drugUnitsConversionRatesRepository;
    @Autowired
    private SeqDrugAuthorizationNumberRepository seqDrugAuthorizationNumberRepository;
    @Value("${scheduler.rest.api.host}")
    private String schedulerRestApiHost;

    @PostMapping(value = "/by-filter")
    public ResponseEntity<List<DrugDecisionsFilterDetailsDTO>> getDrugDecisionsByFilter(@RequestBody DrugDecisionsFilterDetailsDTO filter) {
        logger.debug("get drug decisions by filter");
        List<DrugDecisionsFilterDetailsDTO> dtos = drugDecisionsFilterRepository.getDrugDecisionsByFilter(filter.getProtocolNr(),
                filter.getProtocolDate(),
                filter.getDrugSubstanceTypesId(),
                filter.getCompanyId()
        );

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @RequestMapping(value = "/by-id")
    public ResponseEntity<List<DrugDecisionsFilterDTO>> getDrugDecisionsById(String id) {
        logger.debug("Get drug decisions by id");
        List<DrugDecisionsFilterDTO> dtos = drugDecisionsRepository.getDrugDecisionsById(id);

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @RequestMapping(value = "/search-last-act-auth")
    public ResponseEntity<DrugCheckDecisionsEntity> searchLastDrug(String filialId) {
        logger.debug("Get old drug details");
        Optional<DrugCheckDecisionsEntity> result = drugCheckDecisionRepository.searchLastEntryForAuthAct(Integer.valueOf(filialId));

        return new ResponseEntity<>(result.orElse(null), HttpStatus.OK);
    }


    @RequestMapping("/search-companies-by-name-or-code-and-idno")
    public ResponseEntity<List<NmEconomicAgentsEntity>> getCompaniesByNameCodeAndIdno(@RequestBody CompanyDetailsDTO filter) {
        logger.debug("Retrieve companies by name or code and idno");
        return new ResponseEntity<>(economicAgentsRepository.getCompaniesByNameCodeAndIdno(filter.getName(), filter.getCode(), filter.getIdno()), HttpStatus.OK);
    }

    @RequestMapping(value = "/search-substances-by-name-or-code")
    public ResponseEntity<List<AuthorizedDrugSubstancesEntity>> getAuthorizedSubstancesByNameOrCode(String term) {
        logger.debug("Retrieve substances by name or code");
        List<AuthorizedDrugSubstancesEntity> substances = authorizedDrugSubstancesRepository.getAuthorizedSubstancesByNameOrCode(term, term);

        return new ResponseEntity<>(substances, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-import-export-details-by-substance-id")
    public ResponseEntity<List<DrugImportExportDetailsEntity>> getImportExportDetailsBySubstanceId(Integer id) {
        logger.debug("Get import export details by substance id");
        List<DrugImportExportDetailsEntity> details = drugImportExportDetailsRepository.findAllByAuthorizedDrugSubstance(id);

        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    @RequestMapping(value = "/get-import-export-details-by-decision-id")
    public ResponseEntity<List<DrugImportExportDetailsEntity>> getImportExportDetailsByDecisionId(Integer id) {
        logger.debug("Get import export details by decision id");
        List<DrugImportExportDetailsEntity> details = drugImportExportDetailsRepository.findALLByDrugCheckDecisionsId(id);

        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    @RequestMapping(value = "/save-import-export-details", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DrugImportExportDetailsEntity> saveImportExportDetails(@RequestBody DrugImportExportDetailsEntity details) {
        logger.debug("Save import export details");
        drugImportExportDetailsRepository.save(details);

        return new ResponseEntity<>(details, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/load-request", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> getRequestDetailById(@RequestParam(value = "id") Integer id) throws CustomException
    {
        Optional<RegistrationRequestsEntity> regOptional = requestRepository.findRequestCPCDById(id);
        if (regOptional.isPresent())
        {
            return new ResponseEntity<>(regOptional.get(), HttpStatus.OK);
        }
        throw new CustomException("Request was not found");
    }

    @RequestMapping(value = "/add-authorization-details", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> addAuthorizationDetails(@RequestBody RegistrationRequestsEntity request) throws CustomException {
        logger.debug("Add authorization import export details");
        Optional<RequestTypesEntity> type = requestTypeRepository.findByCode(request.getType().getCode());
        request.getType().setId(type.get().getId());

        requestRepository.save(request);

        if (request.getType() != null && request.getType().getCode() != null && request.getType().getCode().equals("DACPS")) {

            if (request.getCurrentStep() != null && (request.getCurrentStep().equals("F") || request.getCurrentStep().equals("I"))) {
                logger.debug("Start jobUnschedule method...");
                Utils.jobUnschedule(schedulerRestApiHost, "/set-expired-request", request.getId());
                logger.debug("Finished jobUnschedule method.");
//                logger.debug("Start jobUnschedule method...");
//                Utils.jobUnschedule(schedulerRestApiHost, "/set-critical-request", request.getId());
//                logger.debug("Finished jobUnschedule method.");
            } else {
                logger.debug("Start jobSchedule method...");
                ResponseEntity<ScheduledModuleResponse> result = null;
                result = Utils.jobSchedule(3, "/set-critical-request", "/set-expired-request", request.getId(), request.getRequestNumber(), null, schedulerRestApiHost);
                if (result != null && !result.getBody().isSuccess()) {
                    logger.debug("The method jobSchedule, was not successful.");
                    throw new CustomException("Nu a putut fi setat termenul de eliberare al certificatului.");
                } else {
                    logger.debug("Finished jobSchedule method.");
                }
            }
        }

        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/get-units-by-reference-code")
    public ResponseEntity<List<DrugUnitsConversionRatesEntity>> getUnityRatesByRefCode(String refCode) throws CustomException {
        logger.debug("Get all units codes by reference unit code");
        Optional<List<DrugUnitsConversionRatesEntity>> units = drugUnitsConversionRatesRepository.findByRefUnitCode(refCode);

        return new ResponseEntity<>(units.orElseThrow(() -> new CustomException("No result was found")), HttpStatus.OK);
    }

    @RequestMapping(value = "/get-old-details-by-company-code")
    public ResponseEntity<List<OldDrugDecisionDetailsDTO>> getOldDetailsByCompanyCode(String code) {
        logger.debug("Get old details by company code");
        List<OldDrugDecisionDetailsDTO> dtos = oldDrugDecisionDetailsRepository.getDetailsByCompanyCode(code);

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/generate-registration-request-number")
    public ResponseEntity<List<String>> generateRegistrationRequestNumber()
    {
        SeqDrugAuthorizationNumberEntity seq = new SeqDrugAuthorizationNumberEntity();
        seqDrugAuthorizationNumberRepository.save(seq);
        return new ResponseEntity<>(Arrays.asList("Rg10-"+ Utils.intToString(6, seq.getId())), HttpStatus.OK);
    }
}
