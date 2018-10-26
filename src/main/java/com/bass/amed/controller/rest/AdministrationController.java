package com.bass.amed.controller.rest;

import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.GetCountriesMinimalProjection;
import com.bass.amed.projection.GetMinimalCompanyProjection;
import com.bass.amed.projection.LicenseCompanyProjection;
import com.bass.amed.repository.*;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.GenerateReceiptNumberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/administration")
public class AdministrationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdministrationController.class);

    @Autowired
    private GenerateDocNumberService generateDocNumberService;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private NmStatesRepository nmStatesRepository;
    @Autowired
    private NmLocalitiesRepository nmLocalitiesRepository;
    @Autowired
    private PharmaceuticalFormsRepository pharmaceuticalFormsRepository;
    @Autowired
    private PharmaceuticalFormTypesRepository pharmaceuticalFormTypesRepository;
    @Autowired
    private ActiveSubstancesRepository activeSubstancesRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private UnitsOfMeasurementRepository unitsOfMeasurementRepository;
    @Autowired
    private InternationalMedicamentNameRepository internationalMedicamentNameRepository;
    @Autowired
    private MedicamentTypeRepository medicamentTypeRepository;
    @Autowired
    private ManufactureRepository manufactureRepository;
    @Autowired
    private GenerateReceiptNumberService generateReceiptNumberService;
    @Autowired
    private NmCountriesRepository nmCountriesRepository;
    @Autowired
    MailSender mailSender;

    @RequestMapping(value = "/generate-doc-nr")
    public ResponseEntity<Integer> generateDocNr() {
        return new ResponseEntity<>(generateDocNumberService.getDocumentNumber(), HttpStatus.OK);
    }

    @GetMapping("/all-companies")
    public ResponseEntity<List<NmEconomicAgentsEntity>> retrieveAllEconomicAgents() {
        LOGGER.debug("Retrieve all economic agents");
        List<NmEconomicAgentsEntity> allCompanies = economicAgentsRepository.findAll();

        return new ResponseEntity<>(allCompanies, HttpStatus.OK);
    }

    @GetMapping("/all-companies-details")
    public ResponseEntity<List<GetMinimalCompanyProjection>> retrieveAllEconomicAgentsDetails() {
        LOGGER.debug("Retrieve all economic agents");
        List<GetMinimalCompanyProjection> allCompanies = economicAgentsRepository.getMinimalDetails();

        return new ResponseEntity<>(allCompanies, HttpStatus.OK);
    }

    @RequestMapping("/all-companies-for-license")
    public ResponseEntity<List<LicenseCompanyProjection>> retrieveAllLicenseCompanies() {
        LOGGER.debug("Retrieve all license companies");
        return new ResponseEntity<>(economicAgentsRepository.getLicenseDetails(), HttpStatus.OK);
    }

    @RequestMapping("/all-states")
    public ResponseEntity<List<NmStatesEntity>> retrieveAllStates() {
        LOGGER.debug("Retrieve all states");
        return new ResponseEntity<>(nmStatesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-localities-by-state")
    public ResponseEntity<Set<NmLocalitiesEntity>> retrieveLocalitiesByState(@RequestParam(value = "stateId") String stateIso) {
        LOGGER.debug("Retrieve localities by state" + stateIso);
        return new ResponseEntity<>(nmLocalitiesRepository.findByStateId(Integer.valueOf(stateIso)), HttpStatus.OK);
    }

    @RequestMapping("/all-pharamceutical-form-types")
    public ResponseEntity<List<NmPharmaceuticalFormTypesEntity>> retrieveAllPharmaceuticalFormTypes() {
        LOGGER.debug("Retrieve all pharmaceutical form types");
        return new ResponseEntity<>(pharmaceuticalFormTypesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-pharamceutical-forms")
    public ResponseEntity<List<NmPharmaceuticalFormsEntity>> retrieveAllPharmaceuticalFormsByTypeId(@RequestParam(value = "typeId") Integer typeId) {
        LOGGER.debug("Retrieve all pharmaceutical forms by type");
        NmPharmaceuticalFormTypesEntity typesEntity = new NmPharmaceuticalFormTypesEntity();
        typesEntity.setId(typeId);
        return new ResponseEntity<>(pharmaceuticalFormsRepository.findByType(typesEntity), HttpStatus.OK);
    }


    @RequestMapping("/all-doc-types")
    public ResponseEntity<List<NmDocumentTypesEntity>> retrieveAllDocTypes() {
        LOGGER.debug("Retrieve all doc types");
        return new ResponseEntity<>(documentTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-active-substances")
    public ResponseEntity<List<NmActiveSubstancesEntity>> retrieveAllActiveSubstances() {
        LOGGER.debug("Retrieve all active substances");
        return new ResponseEntity<>(activeSubstancesRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-units-of-measurement")
    public ResponseEntity<List<NmUnitsOfMeasurementEntity>> retrieveAllUnitsOfMeasurement()
    {
        LOGGER.debug("Retrieve all units of measurement");
        return new ResponseEntity<>(unitsOfMeasurementRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-receipt-nr")
    public ResponseEntity<Integer> generateReceiptNr() {
        return new ResponseEntity<>(generateReceiptNumberService.getReceiptNr(), HttpStatus.OK);
    }

    @RequestMapping("/all-international-names")
    public ResponseEntity<List<NmInternationalMedicamentNameEntity>> retrieveAllInternationalNames()
    {
        LOGGER.debug("Retrieve all international medicament names");
        return new ResponseEntity<>(internationalMedicamentNameRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-medicament-types")
    public ResponseEntity<List<NmMedicamentTypeEntity>> retrieveAllMedicamentTypes()
    {
        LOGGER.debug("Retrieve all medicament types");
        return new ResponseEntity<>(medicamentTypeRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/all-manufactures")
    public ResponseEntity<List<NmManufacturesEntity>> retrieveAllManufactures()
    {
        LOGGER.debug("Retrieve all manufactures");
        return new ResponseEntity<>(manufactureRepository.findAll(), HttpStatus.OK);
    }
    
    @GetMapping("/countries")
    public ResponseEntity<List<GetCountriesMinimalProjection>> retrieveCountries() {
        LOGGER.debug("Retrieve all Countries");
        return new ResponseEntity<>(nmCountriesRepository.findAllOnlyIdAndAndDescriptionBy(), HttpStatus.OK);
    }

    @RequestMapping("/send-email")
    public ResponseEntity<Void> sendEmail(@RequestParam(value = "title") String title,@RequestParam(value = "content") String content,
                                          @RequestParam(value = "mailAddress") String mailAddress) throws CustomException
    {
        LOGGER.debug("send email");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(title);
        message.setText(content);
        message.setTo(mailAddress);

        try {
            mailSender.send(message);
        }
        catch (Exception e)
        {
            throw new CustomException("Could not send message" + e.getMessage());
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
