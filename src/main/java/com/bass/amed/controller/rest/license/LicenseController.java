package com.bass.amed.controller.rest.license;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.license.AnexaLaLicenta;
import com.bass.amed.dto.license.DiffLicense;
import com.bass.amed.dto.license.LicenseDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.LicenseProjection;
import com.bass.amed.repository.*;
import com.bass.amed.repository.license.LicenseActivityTypeRepository;
import com.bass.amed.repository.license.LicenseAnnounceMethodsRepository;
import com.bass.amed.repository.license.LicenseMandatedContactRepository;
import com.bass.amed.repository.license.LicensesRepository;
import com.bass.amed.service.LicenseRegistrationRequestService;
import com.bass.amed.service.LicenseService;
import com.bass.amed.service.LocalityService;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/license")
public class LicenseController
{
    private static final Logger logger = LoggerFactory.getLogger(LicenseController.class);

    @Autowired
    private LicensesRepository licensesRepository;

    @Autowired
    private LicenseAnnounceMethodsRepository licenseAnnounceMethodsRepository;


    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Autowired
    private LicenseRegistrationRequestService licenseRegistrationRequestService;

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @Autowired
    private LicenseActivityTypeRepository licenseActivityTypeRepository;

    @Autowired
    private LicenseMandatedContactRepository licenseMandatedContactRepository;

    @Autowired
    private LocalityService localityService;

    @Autowired
    private SysParamsRepository sysParamsRepository;

    @Autowired
    private LicenseService licenseService;
    @Autowired
    private NMEconomicAgentTypeRepository nmEconomicAgentTypeRepository;

    @RequestMapping(value = "/new-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextNewLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Add license" + request);

//        Optional<NmEconomicAgentsEntity> eco = economicAgentsRepository.findById(request.getCompany().getId());
//
//        if (!eco.isPresent())
//        {
//            throw new CustomException("Economic agent not found" + request.getCompany().getId());
//        }
//
//        request.setCompany(eco.get());
//        request.getLicense().setEconomicAgent(eco.get());

        request.setType(requestTypeRepository.findByCode("LICEL").get());
        request.getLicense().setStatus("A");

//        requestRepository.save(request);


        licenseRegistrationRequestService.saveNewLicense(request);


        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }


    @RequestMapping(value = "/save-evaluation-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> saveEvaluationLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Save evaluation license" + request);

        licenseRegistrationRequestService.updateRegistrationLicense(request, false);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }

    @RequestMapping(value = "/next-evaluation-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextEvaluationLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Save evaluation license" + request);

        licenseRegistrationRequestService.updateRegistrationLicense(request, true);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }


    @RequestMapping(value = "/finish-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> finishLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Finish license" + request);
        request.setEndDate(new Timestamp(new Date().getTime()));

        licenseRegistrationRequestService.finishLicense(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-issue-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> confirmIssueLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm issue license" + request);

        licenseRegistrationRequestService.finishLicense(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @RequestMapping(value = "/stop-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> stopLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Cancel request license" + request);

        licenseRegistrationRequestService.stopLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-modify-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmModifyLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm modify license" + request);

        request.setType(requestTypeRepository.findByCode("LICM").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-duplicate-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmDuplicateLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm duplicate license" + request);

        request.setType(requestTypeRepository.findByCode("LICD").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }

    @RequestMapping(value = "/confirm-prelungire-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmPrelungireLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm prelungire license" + request);

        request.setType(requestTypeRepository.findByCode("LICP").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }

    @RequestMapping(value = "/confirm-anulare-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmAnulareLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm anulare license" + request);

        request.setType(requestTypeRepository.findByCode("LICA").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-suspendare-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmSuspendareLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm anulare license" + request);

        request.setType(requestTypeRepository.findByCode("LICS").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }


    @RequestMapping(value = "/confirm-reluare-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmReluareLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm reluare license" + request);

        request.setType(requestTypeRepository.findByCode("LICRL").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }

    @RequestMapping(value = "/confirm-cesionare-license", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmCesionareLicense(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Confirm cesionare license" + request);

        request.setType(requestTypeRepository.findByCode("LICC").get());

        licenseRegistrationRequestService.updateModifyLicense(request);
        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-license-by-request-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadLicenseById(@RequestParam("id") String id) throws CustomException
    {
        logger.debug("Retrieve license by request id", id);
        RegistrationRequestsEntity r = licenseRegistrationRequestService.findLicenseRegistrationById(Integer.valueOf(id), false);
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-license-by-request-id-completed", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadLicenseByIdCompleted(@RequestParam("id") String id) throws CustomException
    {
        logger.debug("Retrieve license by request id", id);
        RegistrationRequestsEntity r = licenseRegistrationRequestService.findLicenseRegistrationById(Integer.valueOf(id), true);
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-license-by-idno", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LicensesEntity> loadLicenseByCompany(@RequestParam("idno") String idno) throws CustomException
    {
        logger.debug("Retrieve license by company id idno", idno);
        Optional<NmEconomicAgentsEntity> firstChoice = economicAgentsRepository.findFirstByIdnoEqualsAndLicenseIdIsNotNull(idno);
        Optional<LicensesEntity> r = Optional.empty();
        if (firstChoice.isPresent())
        {
            r = licensesRepository.getActiveLicenseById(firstChoice.get().getLicenseId(), new Date());
        }
        return new ResponseEntity<>(r.isPresent() ? r.get() : null, HttpStatus.OK);
    }


    @RequestMapping(value = "/retrieve-suspended-license-by-idno", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LicensesEntity> loadSuspendedLicenseByCompany(@RequestParam("idno") String idno) throws CustomException
    {
        logger.debug("Retrieve suspended license by company id idno", idno);
        Optional<NmEconomicAgentsEntity> firstChoice = economicAgentsRepository.findFirstByIdnoEqualsAndLicenseIdIsNotNull(idno);
        Optional<LicensesEntity> r = Optional.empty();
        if (firstChoice.isPresent())
        {
            r = licensesRepository.getSuspendedLicenseById(firstChoice.get().getLicenseId(), new Date());
        }
        return new ResponseEntity<>(r.isPresent() ? r.get() : null, HttpStatus.OK);
    }


    @RequestMapping(value = "/retrieve-agents-by-idno-without-license", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmEconomicAgentsEntity>> loadAgentsByIdnoWitouhtLicense(@RequestParam("idno") String idno) throws CustomException
    {
        logger.debug("Retrieve agents by idno", idno);
        List<NmEconomicAgentsEntity> all = economicAgentsRepository.findAllByIdnoEndsWithAndLicenseIdIsNull(idno);
        for (NmEconomicAgentsEntity ece : all)
        {
            Optional<LicenseAgentPharmaceutistEntity> selectedPharmaceutist = ece.getAgentPharmaceutist().stream().filter(af -> af.getSelectionDate() != null).max(Comparator.comparing(LicenseAgentPharmaceutistEntity::getSelectionDate));
            ece.setSelectedPharmaceutist(selectedPharmaceutist.isPresent() ? selectedPharmaceutist.get() : null);
        }

        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-announce-methods", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LicenseAnnounceMethodsEntity>> loadAnnounceMethods()
    {
        logger.debug("Retrieve announce metthods");
        return new ResponseEntity<>(licenseAnnounceMethodsRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-activities", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LicenseActivityTypeEntity>> loadActivities()
    {
        logger.debug("Retrieve all activities");
        return new ResponseEntity<>(licenseActivityTypeRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/get-filtered-licenses", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LicenseProjection>> getLicenseByFilter(@RequestBody LicenseDTO filter)
    {
        logger.debug("Get processes by filter: ", filter.toString());
        List<LicenseProjection> licenseProjections = licenseService.retrieveLicenseByFilter(filter);
        return new ResponseEntity<>(licenseProjections, HttpStatus.OK);
    }

    @RequestMapping(value = "/find-license-by-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LicensesEntity> getLicenseById(@RequestParam("licenseId") String licenseId) throws  CustomException
    {
        logger.debug("Get license by id: ", licenseId);
        LicensesEntity le = licenseService.findLicenseById(Integer.valueOf(licenseId));
        return new ResponseEntity<>(le, HttpStatus.OK);
    }

    @RequestMapping(value = "/find-requests-by-license-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegistrationRequestsEntity>> getRequestsForLicense(@RequestParam("licenseId") String licenseId) throws  CustomException
    {
        logger.debug("Get requests for license id: ", licenseId);
        return new ResponseEntity<>(requestRepository.getRequestsForLicense(Integer.valueOf(licenseId)), HttpStatus.OK);
    }


    @RequestMapping(value = "/compare-with-previous-rev", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DiffLicense>> compareRevisions(@RequestParam("licenseId") String licenseId, @RequestParam("reqId") String requestId) throws  CustomException
    {
        logger.debug("Compare revision with previous: ", requestId);
        return new ResponseEntity<>(licenseRegistrationRequestService.compareRevisions(Integer.valueOf(licenseId), Integer.valueOf(requestId)), HttpStatus.OK);
    }


    @RequestMapping(value = "/retrieve-economic-agent-type", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NmTypesOfEconomicAgentsEntity>> loadEconomicAgentsType()
    {
        logger.debug("Retrieve economic agents type");
        return new ResponseEntity<>(nmEconomicAgentTypeRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/view-anexa-licenta", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAnexaLicenta(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module5/AnexaLicenta.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<AnexaLaLicenta> filiale = new ArrayList<>();
            final AtomicInteger i = new AtomicInteger(1);

            request.getLicense().getEconomicAgents().forEach(
                    m -> {
                        AnexaLaLicenta p = new AnexaLaLicenta();
                        p.setNr(i.getAndIncrement());

                        StringBuilder sb = new StringBuilder();
                        sb.append(m.getLocality().getStateName()).append(", ");
                        sb.append(m.getLocality().getDescription()).append(", ");
                        sb.append(m.getStreet());
                        p.setAddress(sb.toString());

                        p.setPharmacist((m.getType().getRepresentant() + ": " + m.getSelectedPharmaceutist().getFullName()));
                        p.setPharmType(m.getType().getDescription());

                        p.setPsychotropicSubstances(false);
                        for (LicenseActivityTypeEntity type : m.getActivities())
                        {
                            if (type.getCanUsePsihotropicDrugs().equals(1))
                            {
                                p.setPsychotropicSubstances(true);
                                break;
                            }
                        }
                        filiale.add(p);

                    }
            );


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(filiale);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("licenseSeries", request.getLicense().getSerialNr());
            parameters.put("licenseNumber", request.getLicense().getNr());
            parameters.put("companyName", request.getLicense().getEconomicAgents().stream().findFirst().get().getLongName());
            List<RegistrationRequestsEntity> listOfModifications = requestRepository.findAllLicenseModifications(request.getLicense().getId());

            StringBuilder sb1 = new StringBuilder();
            SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
            listOfModifications.forEach(lm ->
                    {
                        if (sb1.length() > 0)
                        {
                            sb1.append(";");
                        }
                        sb1.append(sdf.format(lm.getEndDate()));
                    }

            );

            parameters.put("updatedDates", sb1.toString());
            parameters.put("parameterAnexaLaLicenta", itemsJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //Export to word

//            ByteArrayOutputStream xlsReport = new ByteArrayOutputStream();
//
//            JRDocxExporter docxExporter = new JRDocxExporter();
//            docxExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
//            docxExporter.setExporterOutput( new SimpleOutputStreamExporterOutput( xlsReport));
//            SimpleDocxReportConfiguration config = new SimpleDocxReportConfiguration();
//            docxExporter.setConfiguration(config);
//            docxExporter.exportReport();
//            bytes = xlsReport.toByteArray();
//
//
//            if (xlsReport != null)
//            {
//                xlsReport.close();
//            }

        } catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=anexaLicenta.docx").body(bytes);
    }


    @RequestMapping(value = "/view-licenta", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewLicenta(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module5/Licenta.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            Date releaseDate = request.getLicense().getReleaseDate();
            Date expirationDate = request.getLicense().getExpirationDate();
            if (request.getType().getCode().equals("LICEL"))
            {
                releaseDate = new Date();

                Calendar c = Calendar.getInstance();
                c.setTime(releaseDate);
                c.add(Calendar.YEAR, 5);

                expirationDate = c.getTime();
            }

            if (request.getType().getCode().equals("LICP"))
            {
                Date curExpirationDate = request.getLicense().getExpirationDate();

                Calendar c = Calendar.getInstance();
                c.setTime(curExpirationDate);
                c.add(Calendar.YEAR, 5);

                expirationDate = c.getTime();
            }


            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("companyName", request.getLicense().getEconomicAgents().stream().findFirst().get().getLongName());
            parameters.put("companyAddress", request.getLicense().getEconomicAgents().stream().findFirst().get().getLegalAddress());
            parameters.put("companyIdno", request.getLicense().getIdno());
            parameters.put("startDate", new SimpleDateFormat(Constants.Layouts.POINT_DATE_FORMAT).format(releaseDate ));
            parameters.put("endDate", new SimpleDateFormat(Constants.Layouts.POINT_DATE_FORMAT).format(expirationDate));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("dateOfApprovalOfDecision", new SimpleDateFormat(Constants.Layouts.POINT_DATE_FORMAT).format(request.getLicense().getEconomicAgents().stream().findFirst().get().getRegistrationDate()));

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e)
        {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=anexaLicenta.pdf").body(bytes);
    }
}
