package com.bass.amed.controller.rest;

import com.bass.amed.JobSchedulerComponent;
import com.bass.amed.common.Constants;
import com.bass.amed.dto.*;
import com.bass.amed.dto.annihilation.BonPlataAnihilare1;
import com.bass.amed.dto.annihilation.BonPlataAnihilare2;
import com.bass.amed.dto.annihilation.ListaMedicamentelorPentruComisie;
import com.bass.amed.dto.clinicaltrial.ClinicTrialAmdmOrdinDTO;
import com.bass.amed.dto.clinicaltrial.ClinicTrialMdicamentDTO;
import com.bass.amed.dto.clinicaltrial.ClinicTrialMedInstDTO;
import com.bass.amed.dto.clinicaltrial.ClinicalTrialExpertDTO;
import com.bass.amed.dto.gmp.*;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.AuditLogService;
import com.bass.amed.service.ClinicalTrailsService;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.StorageService;
import com.bass.amed.utils.AmountUtils;
import com.bass.amed.utils.NumberToWordsConverter;
import com.bass.amed.utils.SecurityUtils;
import com.bass.amed.utils.Utils;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DocumentsController {
    private static final Logger logger = LoggerFactory.getLogger(DocumentsController.class);
    @Autowired
    private StorageService storageService;
    @Autowired
    private GenerateDocNumberService generateDocNumberService;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private PaymentOrderNumberRepository paymentOrderNumberRepository;
    @Autowired
    private PaymentOrderRepository paymentOrderRepository;
    @Autowired
    private DocumentsRepository documentsRepository;
    @Autowired
    private SrcUserRepository srcUserRepository;
    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;
    @Autowired
    private SysParamsRepository sysParamsRepository;
    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;
    @Autowired
    private RequestRepository regRequestRepository;
    @Autowired
    private OutputDocumentsRepository outputDocumentsRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private GenerateMedicamentRegistrationNumberRepository generateMedicamentRegistrationNumberRepository;
    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private ClinicalTrailsService clinicalTrailsService;
    @Autowired
    private CtPaymentOrderRepository ctPaymentOrderRepository;

    @Autowired
    private JobSchedulerComponent jobSchedulerComponent;

    @Value("${final.documents.folder}")
    private String folder;

    private static void fillModificareCertificateDTO(String field1, String field2, List<ModificareCertificatFieldsDTO> fields) {
        ModificareCertificatFieldsDTO dto = new ModificareCertificatFieldsDTO();
        dto.setField1(field1);
        dto.setField2(field2);
        fields.add(dto);
    }

    @RequestMapping(value = "/pushFile", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FileResult> pushFileToServer(@RequestParam("file") MultipartFile file, @RequestParam("nrCerere") String nrCerere) throws CustomException {
        logger.debug("Store file with name=" + file.getOriginalFilename());
        StringBuilder sb = new StringBuilder(folder);
        createRootPath(nrCerere, sb);

        storageService.store(sb.toString(), file);
        FileResult fr = new FileResult();
        fr.setPath(sb.append("/").append(file.getOriginalFilename()).toString());
        return new ResponseEntity<>(fr, HttpStatus.OK);

    }

    @RequestMapping(value = "/by-ids", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentsEntity>> getDocumentsByIds(@RequestBody Integer[] ids) {
        logger.debug("getDocumentsByIds");
        List<DocumentsEntity> docs = null;
        if (ids.length > 0) {
            docs = documentsRepository.findAllByIds(Arrays.asList(ids));
        }
        return new ResponseEntity<>(docs, HttpStatus.OK);
    }

    @RequestMapping(value = "/by-request-id", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Set<DocumentsEntity>> getDocumentsByRequestId(@RequestBody Integer id) {
        logger.debug("getDocumentsByRequestId");
        Set<DocumentsEntity> docs = regRequestRepository.findById(id).orElse(new RegistrationRequestsEntity()).getDocuments();
        return new ResponseEntity<>(docs, HttpStatus.OK);
    }

    @RequestMapping(value = "/by-price-ids", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentsEntity>> getDocumentsByPriceIds(@RequestBody Integer[] ids) {
        logger.debug("getDocumentsByPriceIds");
        List<DocumentsEntity> docs = null;
        if (ids.length > 0) {
            docs = documentsRepository.findAllByPriceIds(Arrays.asList(ids));
        }
        return new ResponseEntity<>(docs, HttpStatus.OK);
    }

    @RequestMapping(value = "/removeFile", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeFile(@RequestParam("relativeFolder") String relativeFolder) throws CustomException {
        logger.debug("Remove files for folder=" + relativeFolder);
        storageService.remove(relativeFolder);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-dd", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addDD(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        addOutputDocuments("DD", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-ddm", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addDDM(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        addOutputDocuments("DDM", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-oi", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addOI(@RequestParam("id") Integer id, @RequestParam("file") MultipartFile file) throws CustomException {
        addOutputDocuments("OI", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-oim", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addOIM(@RequestParam("id") Integer id, @RequestParam("file") MultipartFile file) throws CustomException {
        addOutputDocuments("OIM", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-ln", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addLN(@RequestParam("id") Integer id, @RequestParam("file") MultipartFile file) throws CustomException {
        addOutputDocuments("LN", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    void addOutputDocuments(String category, Integer id, MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        storageService.remove(outDocument.getPath());
        if (category.equals("LN")) {

            Optional<String> extensionByStringHandling = getExtensionByStringHandling(file.getOriginalFilename());
            if (!extensionByStringHandling.isPresent()) {
                throw new CustomException("Could not determine extension file.");
            }
            String fileName = outDocument.getName() + new Date().getTime() + "." + extensionByStringHandling.get();
            outDocument.setName(fileName);

            String path = storageService.store(outDocument.getPath().substring(0, outDocument.getPath().lastIndexOf('/')), file, fileName);
            outDocument.setPath(path);
        } else {
            String path = storageService.store(outDocument.getPath().substring(0, outDocument.getPath().lastIndexOf('/')), file, outDocument.getName());
            outDocument.setPath(path);
        }
        outDocument.setAttached(true);
        outputDocumentsRepository.save(outDocument);
        List<RegistrationRequestsEntity> requests = new ArrayList<>();
        switch (category) {
            case "OI":
            case "OIM":
                requests = regRequestRepository.findRequestsByOINumber(outDocument.getNumber());
                break;
            case "DDC":
            case "DDA":
            case "DD":
            case "DDM":
                requests = regRequestRepository.findRequestsByDDNumber(outDocument.getNumber());
                break;
            case "LN":
                requests = regRequestRepository.findAllByOutputDocumentId(outDocument.getId());
                break;
            default:
        }
        for (RegistrationRequestsEntity request : requests) {
            DocumentsEntity d = new DocumentsEntity();
            d.setDocType(outDocument.getDocType());
            d.setPath(outDocument.getPath());
            d.setName(outDocument.getName());
            d.setDate(new Timestamp(new Date().getTime()));
            d.setNumber(outDocument.getNumber());
            d.setRegistrationRequestId(request.getId());
            documentsRepository.save(d);
            if (category.equals("OI")) {
                request.getMedicaments().stream().forEach(t -> t.setStatus("C"));
                closeRequest(request);
            } else if (category.equals("OIM")) {
                closeRequest(request);
            } else if (category.equals("DDC")) {
                clinicalTrailsService.unscheduleClientDetailsDataCT(request.getId());
                clinicalTrailsService.scheduleFinisLimitCT(request.getId(), request.getRequestNumber());
            } else if (category.equals("DDA")) {
                clinicalTrailsService.unscheduleClientDetailsDataAmendCT(request.getId());
                clinicalTrailsService.scheduleFinisLimitAmendmentCT(request.getId(), request.getRequestNumber());
            }
        }
    }

    private void closeRequest(RegistrationRequestsEntity request) {
        request.setCurrentStep("C");
        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(SecurityUtils.getCurrentUser().orElse(""));
        historyEntity.setStep("C");
        historyEntity.setStartDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        request.getRequestHistories().add(historyEntity);
        request.setEndDate(new Timestamp(new Date().getTime()));
        regRequestRepository.save(request);
    }

    @RequestMapping(value = "/add-oa", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addOA(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        storageService.remove(outDocument.getPath());
        storageService.store(outDocument.getPath().substring(0, outDocument.getPath().lastIndexOf('/')), file, outDocument.getName());
        outDocument.setAttached(true);
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        List<Integer> requestIds = medicamentRepository.findRequestsIDByOANumber(outDocument.getNumber());
        for (Integer reqId : requestIds) {
            DocumentsEntity d = new DocumentsEntity();
            d.setDocType(outDocument.getDocType());
            d.setPath(outDocument.getPath());
            d.setName(outDocument.getName());
            d.setDate(new Timestamp(new Date().getTime()));
            d.setNumber(outDocument.getNumber());
            d.setDateOfIssue(outDocument.getDateOfIssue());
            d.setRegistrationRequestId(reqId);
            documentsRepository.save(d);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-om", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addOM(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        storageService.remove(outDocument.getPath());
        storageService.store(outDocument.getPath().substring(0, outDocument.getPath().lastIndexOf('/')), file, outDocument.getName());
        outDocument.setAttached(true);
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        List<Integer> requestIds = medicamentRepository.findRequestsIDByOMNumber(outDocument.getNumber());
        for (Integer reqId : requestIds) {
            DocumentsEntity d = new DocumentsEntity();
            d.setDocType(outDocument.getDocType());
            d.setPath(outDocument.getPath());
            d.setName(outDocument.getName());
            d.setDate(new Timestamp(new Date().getTime()));
            d.setNumber(outDocument.getNumber());
            d.setDateOfIssue(outDocument.getDateOfIssue());
            d.setRegistrationRequestId(reqId);
            documentsRepository.save(d);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-dd", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateDD(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Dispozitie A Guvern.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            RegistrationRequestsEntity firstRequest = requests.stream().findFirst().orElse(new RegistrationRequestsEntity());
            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", firstRequest.getDdNumber());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("date", sdf.format(new Date()));
            parameters.put("nrOrdin", "A07.PS-01.Rg04-12");
            parameters.put("nrOrdinDate", "19.01.2018");
            parameters.put("ordinName", "„Despre aprobarea listei de experţi din cadrul Agenţiei Medicamentului şi Dispozitivelor Medicale”");
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<DispozitieDeDistribuireDTO> ddListDTO = new ArrayList<>();
            List<Integer> ids = new ArrayList<>();
            for (RegistrationRequestsEntity req : requests) {
                ids.add(req.getId());
            }
            //load full info about requests
            List<RegistrationRequestsEntity> fullInfoRequests = regRequestRepository.findRequestWithMedicamentInfo(ids);
            for (RegistrationRequestsEntity req : fullInfoRequests) {
                DispozitieDeDistribuireDTO ddDTO = new DispozitieDeDistribuireDTO();
                MedicamentEntity medicamentEntity = req.getMedicaments().stream().findFirst().orElse(new MedicamentEntity());
                if (medicamentEntity != null && medicamentEntity.getId() != null) {
                    List<MedicamentManufactureEntity> manufactures =
                            medicamentEntity.getManufactures().stream().filter(t -> Boolean.TRUE.equals(t.getProducatorProdusFinit())).collect(Collectors.toList());
                    if (manufactures.isEmpty()) {
                        ddDTO.setAutorizationOwner(medicamentEntity.getAuthorizationHolder().getDescription());
                    } else {
                        ddDTO.setAutorizationOwner(medicamentEntity.getAuthorizationHolder().getDescription() + " / " + manufactures.stream().map(t -> t.getManufacture().getDescription() + " " + t.getManufacture().getAddress() + " " + t.getManufacture().getCountry().getDescription()).collect(Collectors.joining("; ")));
                    }
                    Set<String> expertsSet = req.getExpertList().stream().map(t -> t.getIntern() ? t.getExpert().getName() : t.getExpertName()).collect(Collectors.toSet());
                    ddDTO.setExpertName(expertsSet.stream().collect(Collectors.joining("\n")));
                    ddDTO.setMedicamentNameDosePharmform(medicamentEntity.getCommercialName() + " " + medicamentEntity.getDose() + " " + medicamentEntity.getPharmaceuticalForm().getDescription());
                    ddDTO.setNotes("");
                    ddDTO.setRegistrationNrDate(req.getRequestNumber() + " " + sdf.format(req.getStartDate()));
                    ddListDTO.add(ddDTO);
                }
            }
            JRBeanCollectionDataSource ddListJRBean = new JRBeanCollectionDataSource(ddListDTO);
            parameters.put("dispozitieAGuvern", ddListJRBean);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint, "dispozitii_de_distribuire/Dispozitie de distribuire Nr " + firstRequest.getDdNumber() + ".pdf");

            //update requests
            regRequestRepository.setDDNumber(ids, firstRequest.getDdNumber());

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("DD").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(firstRequest.getDdNumber());
            outputDocumentsEntity.setName("Dispozitie de distribuire Nr " + firstRequest.getDdNumber() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-ddm", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateDDM(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Dispozitie modificari.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            //PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            // paymentOrderNumberRepository.save(seq);
            RegistrationRequestsEntity firstRequest = requests.stream().findFirst().orElse(new RegistrationRequestsEntity());
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("La Nr.", firstRequest.getDdNumber());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("Din:", sdf.format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<DispozitieDeDistribuireDTO> ddListDTO = new ArrayList<>();
            List<Integer> ids = new ArrayList<>();
            for (RegistrationRequestsEntity req : requests) {
                ids.add(req.getId());
            }
            //load full info about requests
            List<NmManufacturesEntity> manufactures = new ArrayList<>();
            List<RegistrationRequestsEntity> fullInfoRequests = regRequestRepository.findRequestWithMedicamentHistoryInfo(ids);
            for (RegistrationRequestsEntity req : fullInfoRequests) {
                DispozitieDeDistribuireDTO ddDTO = new DispozitieDeDistribuireDTO();
                MedicamentHistoryEntity medicamentEntity = req.getMedicamentHistory().stream().findFirst().orElse(new MedicamentHistoryEntity());
                if (medicamentEntity != null && medicamentEntity.getId() != null) {
                    List<MedicamentManufactureHistoryEntity> manufacturesHist =
                            medicamentEntity.getManufacturesHistory().stream().filter(t -> Boolean.TRUE.equals(t.getProducatorProdusFinitTo())).collect(Collectors.toList());
                    if (manufacturesHist.isEmpty()) {
                        ddDTO.setAutorizationOwner(medicamentEntity.getAuthorizationHolderTo().getDescription());
                    } else {
                        ddDTO.setAutorizationOwner(medicamentEntity.getAuthorizationHolderTo().getDescription() + " / " + manufacturesHist.stream().map(t -> t.getManufacture().getDescription() + " " + t.getManufacture().getAddress() + " " + t.getManufacture().getCountry().getDescription()).collect(Collectors.joining("; ")));
                        manufacturesHist.forEach(t -> manufactures.add(t.getManufacture()));
                    }
                    ddDTO.setExpertName(req.getExpertList().stream().map(t -> {
                        return t.getIntern() ? t.getExpert().getName() : t.getExpertName();
                    }).collect(Collectors.joining(";")));
                    ddDTO.setMedicamentNameDosePharmform(medicamentEntity.getCommercialNameTo() + " " + medicamentEntity.getDoseTo() + " " + medicamentEntity.getPharmaceuticalFormTo().getDescription());
                    ddDTO.setNotes("");
                    ddDTO.setRegistrationNrDate(req.getRequestNumber() + " " + sdf.format(req.getStartDate()));
                    Set<String> vars = req.getVariations().stream().map(t -> t.getValue()).collect(Collectors.toSet());
                    List<String> varsList = new ArrayList<String>(vars);
                    Collections.sort(varsList, (p1, p2) -> p1.compareTo(p2));
                    ddDTO.setMedification(varsList.stream().collect(Collectors.joining(",")));
                    ddListDTO.add(ddDTO);
                }
            }
            JRBeanCollectionDataSource ddListJRBean = new JRBeanCollectionDataSource(ddListDTO);
            parameters.put("dsipozitiaModificareDataset", ddListJRBean);
            parameters.put("totalPreparations", String.valueOf(ddListDTO.size()));
            long mdCount = manufactures.stream().filter(t -> t.getCountry().getCode().equals("MD")).count();
            long eurCount = manufactures.stream().filter(t -> t.getCountry().getGroup() != null && t.getCountry().getGroup().getCategory().equals("EUR")).count();
            long csiCount = manufactures.stream().filter(t -> t.getCountry().getGroup() != null && t.getCountry().getGroup().getCategory().equals("CSI")).count();
            parameters.put("europ", String.valueOf(eurCount - mdCount));
            parameters.put("csi", String.valueOf(csiCount));
            parameters.put("autohton", String.valueOf(mdCount));
            parameters.put("others", String.valueOf(manufactures.size() - eurCount - csiCount));
            long variations1 = 0l;
            long variations2 = 0l;
            long transfCert = 0l;
            for (RegistrationRequestsEntity req : requests) {
                if (req.getVariations().size() > 1) {
                    variations1 += req.getVariations().stream().filter(rv -> rv.getValue().startsWith("I") && !rv.getValue().startsWith("II")).collect(Collectors.toList()).stream().count();
                    variations2 += req.getVariations().stream().filter(rv -> rv.getValue().startsWith("II")).collect(Collectors.toList()).stream().count();
                } else if (req.getVariations().size() == 1) {
                    transfCert += req.getVariations().stream().filter(rv -> rv.getVariation().getCode().equals("A.1")).collect(Collectors.toList()).stream().count();
                }
            }
            parameters.put("variations1", String.valueOf(variations1));
            parameters.put("variations2", String.valueOf(variations2));
            parameters.put("transfCert", String.valueOf(transfCert));
            parameters.put("totalVariations", String.valueOf(variations1 + variations2 + transfCert));
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint, "dispozitii_de_distribuire_modificari/Dispozitie de distribuire modificari Nr " + firstRequest.getDdNumber() + ".pdf");

            //update requests
            regRequestRepository.setDDNumber(ids, firstRequest.getDdNumber());

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("DDM").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(firstRequest.getDdNumber());
            outputDocumentsEntity.setName("Dispozitie de distribuire modificari Nr " + firstRequest.getDdNumber() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-oi", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateOI(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Ordin_intrerupere_autorizare.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("orderNumber", String.valueOf(seq.getId()));
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("orderDate", sdf.format(new Date()));
            parameters.put("chiefAccountant", sysParamsRepository.findByCode(Constants.SysParams.ACCOUNTANT).get().getValue());
            parameters.put("generalDirector", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            List<JasperPrint> jasperPrints = new ArrayList<>();
            jasperPrints.add(jasperPrint1);

            ResourceLoader resourceLoader2 = new DefaultResourceLoader();
            Resource res2 = resourceLoader2.getResource("layouts/Anexa_Intrerupere_Autorizare.jrxml");
            JasperReport report2 = JasperCompileManager.compileReport(res2.getInputStream());
            HashMap<String, Object> report2Params = new HashMap<>();
            report2Params.put("registrationNumber", String.valueOf(seq.getId()));
            report2Params.put("registrationDate", sdf.format(new Date()));

            List<Integer> ids = new ArrayList<>();
            for (RegistrationRequestsEntity req : requests) {
                ids.add(req.getId());
            }
            List<MedicamentePentruOrdinDTO> medMD = new ArrayList<>();
            int i = 1;
            List<RegistrationRequestsEntity> fullInfoRequests = regRequestRepository.findRequestWithMedicamentInfo(ids);
            for (RegistrationRequestsEntity req : fullInfoRequests) {
                MedicamentePentruOrdinDTO dto = new MedicamentePentruOrdinDTO();
                MedicamentEntity med = req.getMedicaments().stream().findFirst().orElse(new MedicamentEntity());
                dto.setName(med.getCommercialName());
                dto.setPharmaceuticalForm(med.getPharmaceuticalForm().getDescription());
                dto.setConcentration(med.getDose());
                dto.setDose(req.getMedicaments().stream().map(t -> t.getDivision()).collect(Collectors.joining("; ")));
                List<MedicamentManufactureEntity> manufactures =
                        med.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).collect(Collectors.toList());
                dto.setCompanyName(med.getAuthorizationHolder().getDescription() + "(prod: " + manufactures.stream().map(t -> t.getManufacture().getDescription() + " " + t.getManufacture().getAddress() + " " + t.getManufacture().getCountry().getDescription()).collect(Collectors.joining("; ")) + ")");
                dto.setCountry(med.getAuthorizationHolder().getCountry().getDescription());
                dto.setRowCounter(i++);
                medMD.add(dto);
            }

            Map<String, List<MedicamentePentruOrdinDTO>> mapTest =
                    medMD.stream().collect(Collectors.groupingBy((MedicamentePentruOrdinDTO m) -> {
                        return m.getCountry() + "|" + m.getCompanyName();
                    }));
            Set<Map.Entry<String, List<MedicamentePentruOrdinDTO>>> entries = mapTest.entrySet();
            JasperPrint jasperPrint2 = JasperFillManager.fillReport(report2, report2Params, new JRBeanCollectionDataSource(entries));
            jasperPrints.add(jasperPrint2);

            storageService.initIfNeeded(Paths.get(storageService.getRootFolder()), "ordine_de_intrerupere_autorizare_medicament");
            String outputFile =
                    storageService.getRootFolder() + "/ordine_de_intrerupere_autorizare_medicament/Ordin de intrerupere a procedurii de autorizare medicament Nr " + seq.getId() + ".pdf";
            OutputStream outputStream = new FileOutputStream(new File(outputFile));
            JRPdfExporter jrPdfExporter = new JRPdfExporter();
            jrPdfExporter.setExporterInput(SimpleExporterInput.getInstance(jasperPrints));
            jrPdfExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
            SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
            configuration.setCreatingBatchModeBookmarks(true);
            jrPdfExporter.setConfiguration(configuration);
            jrPdfExporter.exportReport();
            outputStream.close();

            bytes = Files.readAllBytes(new File(outputFile).toPath());

            //update requests
            regRequestRepository.setOINumber(ids, String.valueOf(seq.getId()));


            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("OI").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
            outputDocumentsEntity.setName("Ordin de intrerupere a procedurii de autorizare medicament Nr " + seq.getId() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(outputFile);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=ordinDeIntrerupere.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-oim", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateOIM(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Ordin intrerupere variatii.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", String.valueOf(seq.getId()));
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("date", sdf.format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<MedicamentePentruOrdinDTO> medicamentePentruOrdinDTOS = new ArrayList<>();
            List<Integer> ids = new ArrayList<>();
            for (RegistrationRequestsEntity req : requests) {
                ids.add(req.getId());
            }
            List<RegistrationRequestsEntity> fullInfoRequests = regRequestRepository.findRequestWithMedicamentHistoryInfo(ids);
            int i = 1;
            for (RegistrationRequestsEntity registrationRequestsEntity : fullInfoRequests) {
                MedicamentePentruOrdinDTO medicamentePentruOrdinDTO = new MedicamentePentruOrdinDTO();
                MedicamentHistoryEntity medicamentHistoryEntity = registrationRequestsEntity.getMedicamentHistory().stream().findFirst().orElse(new MedicamentHistoryEntity());
                medicamentePentruOrdinDTO.setId(String.valueOf(i++));
                medicamentePentruOrdinDTO.setCommercialName(medicamentHistoryEntity.getCommercialNameTo());
                medicamentePentruOrdinDTO.setPharmaceuticalForm(medicamentHistoryEntity.getPharmaceuticalFormTo().getDescription() + ", " + medicamentHistoryEntity.getDoseTo() + ", " + medicamentHistoryEntity.getDivisionHistory().stream().map(t -> Utils.getConcatenatedDivisionHistory(t)).collect(Collectors.joining("; ")));
                medicamentePentruOrdinDTO.setModificationType(registrationRequestsEntity.getVariations().stream().findFirst().orElse(new RequestVariationTypeEntity()).getValue());
                medicamentePentruOrdinDTO.setRegistrationNumber(String.valueOf(medicamentHistoryEntity.getRegistrationNumber()));
                medicamentePentruOrdinDTO.setRegistrationNrDate(sdf.format(medicamentHistoryEntity.getRegistrationDate()));
                medicamentePentruOrdinDTOS.add(medicamentePentruOrdinDTO);
            }
            JRBeanCollectionDataSource ordinIntrerupereVariatiiDataSourceJRBean = new JRBeanCollectionDataSource(medicamentePentruOrdinDTOS);
            parameters.put("ordinIntrerupereVariatiiDataSource", ordinIntrerupereVariatiiDataSourceJRBean);
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint1);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint1,
                    "ordine_de_intrerupere_aprobare_modificari_postautorizare/Ordin de intrerupere a procedurii de aprobare a modificarilor postautorizare Nr " + seq.getId() + ".pdf");

            //update requests
            regRequestRepository.setOINumber(ids, String.valueOf(seq.getId()));

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("OIM").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
            outputDocumentsEntity.setName("Ordin de intrerupere a procedurii de aprobare a modificarilor postautorizare Nr " + seq.getId() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=ordinDeIntrerupere.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-lab", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateLab(@RequestBody List<MedicamentEntity> medicamentEntities) throws CustomException {
        byte[] bytes = null;

        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/ActPredarePrimire.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("actNr", String.valueOf(seq.getId()));
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("actDate", sdf.format(new Date()));

            Set<Integer> requestIds = new HashSet<>();
            List<MedicamentePentruOrdinDTO> meds = new ArrayList<>();
            Map<Integer, List<MedicamentEntity>> medicamentEntitiesMap = medicamentEntities.stream().collect(Collectors.groupingBy(t -> t.getRequestId()));
            for (Map.Entry<Integer, List<MedicamentEntity>> medMap : medicamentEntitiesMap.entrySet()) {
                for (MedicamentEntity med : medMap.getValue()) {
                    MedicamentePentruOrdinDTO dto = new MedicamentePentruOrdinDTO();
                    dto.setMedicamentName(med.getCommercialName() + " " + med.getPharmaceuticalForm().getDescription() + " " + med.getDose() + " " + Utils.getConcatenatedDivision(med));
                    List<MedicamentManufactureEntity> manufactures =
                            med.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).collect(Collectors.toList());
                    dto.setCompanyName(med.getAuthorizationHolder().getDescription() + " " + med.getAuthorizationHolder().getCountry().getDescription() + "(prod: "
                            + manufactures.stream().map(t -> t.getManufacture().getDescription() + " " + t.getManufacture().getAddress() + " "
                            + t.getManufacture().getCountry().getDescription()).collect(Collectors.joining("; ")) + ")");
                    dto.setSamples(med.getSamplesNumber() == null ? null : String.valueOf(med.getSamplesNumber()));
                    dto.setMedicamentSeries(med.getSerialNr());
                    if (med.getSamplesExpirationDate() != null) {
                        dto.setExpirationDate(sdf.format(med.getSamplesExpirationDate()));
                    }
                    meds.add(dto);
                    requestIds.add(med.getRequestId());
                }
                MedicamentEntity med = medMap.getValue().stream().findAny().orElse(new MedicamentEntity());
                Set<LaboratorReferenceStandardsEntity> standars = regRequestRepository.getLaboratorStandards(med.getRequestId()).getLaboratorReferenceStandards();
                if (standars != null && !standars.isEmpty()) {
                    MedicamentePentruOrdinDTO dto = new MedicamentePentruOrdinDTO();
                    List<MedicamentManufactureEntity> manufactures =
                            med.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).collect(Collectors.toList());
                    dto.setCompanyName(med.getAuthorizationHolder().getDescription() + " " + med.getAuthorizationHolder().getCountry().getDescription() + "(prod: "
                            + manufactures.stream().map(t -> t.getManufacture().getDescription() + " " + t.getManufacture().getAddress() + " "
                            + t.getManufacture().getCountry().getDescription()).collect(Collectors.joining("; ")) + ")");
                    dto.setReferenceStandards(standars.stream().map(LaboratorReferenceStandardsEntity::getDescription).collect(Collectors.joining("|")));
                    meds.add(dto);
                }
            }

            Map<String, List<MedicamentePentruOrdinDTO>> mapTest =
                    meds.stream().collect(Collectors.groupingBy((MedicamentePentruOrdinDTO m) -> {
                        return m.getCountry() + "|" + m.getCompanyName();
                    }));
            Set<Map.Entry<String, List<MedicamentePentruOrdinDTO>>> entries = mapTest.entrySet();
            JasperPrint jasperPrint2 = JasperFillManager.fillReport(report, parameters, new JRBeanCollectionDataSource(entries));

            bytes = JasperExportManager.exportReportToPdf(jasperPrint2);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint2,
                    "acte_primire_predare_laborator/Act de predare-primire Nr " + seq.getId() + ".pdf");

            //update requests
            regRequestRepository.setLabNumber(requestIds, String.valueOf(seq.getId()));

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("LAB").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
            outputDocumentsEntity.setName("Act de predare-primire Nr " + seq.getId() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (JRException | IOException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=act.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-oa", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateOA(@RequestBody List<MedicamentEntity> medicamentEntities) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader1 = new DefaultResourceLoader();
            Resource res1 = resourceLoader1.getResource("layouts/Ordin autorizare.jrxml");
            JasperReport report1 = JasperCompileManager.compileReport(res1.getInputStream());

            /* Map to hold Jasper report Parameters */
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            Map<String, Object> parameters1 = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters1.put("date", sdf.format(new Date()));
            parameters1.put("nr", String.valueOf(seq.getId()));
            parameters1.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(report1, parameters1, new JREmptyDataSource());

            List<MedicamentePentruOrdinDTO> medMD = new ArrayList<>();
            List<MedicamentePentruOrdinDTO> medImport = new ArrayList<>();
            List<MedicamentePentruOrdinDTO> medRepetatMD = new ArrayList<>();
            List<MedicamentePentruOrdinDTO> medRepetatImport = new ArrayList<>();
            MedicamentRegistrationNumberSequence medicamentRegistrationNumberSequence = new MedicamentRegistrationNumberSequence();
            medicamentEntities.sort(Comparator.comparing(o -> o.getRequestId()));
            List<Integer> ids = new ArrayList<>();
            for (MedicamentEntity med : medicamentEntities) {
                ids.add(med.getId());
            }
            MedicamentEntity temp = new MedicamentEntity();
            Map<Integer, MedicamentEntity> mergedEntities = new HashMap<>();
            for (MedicamentEntity med : medicamentEntities) {
                if (mergedEntities.get(med.getRequestId()) == null) {
                    temp = med;
                    generateMedicamentRegistrationNumberRepository.save(medicamentRegistrationNumberSequence);
                    medicamentRepository.setRegistrationNumber(med.getId(), medicamentRegistrationNumberSequence.getId());
                    temp.setRegistrationNumber(medicamentRegistrationNumberSequence.getId());
                    medicamentRegistrationNumberSequence = new MedicamentRegistrationNumberSequence();
                    temp.setDivision(Utils.getConcatenatedDivision(med));
                    mergedEntities.put(med.getRequestId(), temp);
                } else {
                    temp = mergedEntities.get(med.getRequestId());
                    temp.setDivision(temp.getDivision() + "; " + Utils.getConcatenatedDivision(med));
                    medicamentRepository.setRegistrationNumber(med.getId(), temp.getRegistrationNumber());
                }
            }

            Map<Integer, RegistrationRequestsEntity> requestsMap = new HashMap<>();
            for (MedicamentEntity med : mergedEntities.values()) {
                MedicamentePentruOrdinDTO dto = new MedicamentePentruOrdinDTO();
                dto.setName(med.getCommercialName());
                dto.setPharmaceuticalForm(med.getPharmaceuticalForm().getDescription());
                dto.setConcentration(med.getDose());
                dto.setRegistrationNumber(String.valueOf(med.getRegistrationNumber()));
                dto.setStatus(Boolean.TRUE.equals(med.getOriginale()) ? "Original" : "");
                dto.setDose(med.getDivision());
                List<MedicamentManufactureEntity> manufactures =
                        med.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).collect(Collectors.toList());
                dto.setCompanyName(med.getAuthorizationHolder().getDescription() + "(prod: " + manufactures.stream().map(t -> t.getManufacture().getDescription() + " " + t.getManufacture().getAddress() + " "
                        + t.getManufacture().getCountry().getDescription()).collect(Collectors.joining("; ")) + ")");
                dto.setCountry(med.getAuthorizationHolder().getCountry().getDescription());
                RegistrationRequestsEntity registrationRequestsEntity = requestsMap.get(med.getRequestId());
                if (registrationRequestsEntity == null) {
                    registrationRequestsEntity = regRequestRepository.findById(med.getRequestId()).orElse(new RegistrationRequestsEntity());
                    requestsMap.put(med.getRequestId(), registrationRequestsEntity);
                }
                if (registrationRequestsEntity.getType() != null && (registrationRequestsEntity.getType().getCode().equals("MERG") || registrationRequestsEntity.getType().getCode().equals("MERS"))) {
                    //Repetate moldova
                    if (med.getAuthorizationHolder().getCountry().getCode().equals("MD")) {
                        medRepetatMD.add(dto);
                    }
                    //repetate import
                    else {
                        medRepetatImport.add(dto);
                    }
                } else {
                    // primare moldova
                    if (med.getAuthorizationHolder().getCountry().getCode().equals("MD")) {
                        medMD.add(dto);
                    }
                    // primare import
                    else {
                        medImport.add(dto);
                    }
                }
            }

            List<JasperPrint> jasperPrints = new ArrayList<>();
            jasperPrints.add(jasperPrint1);
            if (!medMD.isEmpty()) {
                ResourceLoader resourceLoader2 = new DefaultResourceLoader();
                Resource res2 = resourceLoader2.getResource("layouts/Anexa_Autorizare_Medicamente.jrxml");
                JasperReport report2 = JasperCompileManager.compileReport(res2.getInputStream());
                HashMap<String, Object> report2Params = new HashMap<>();
                report2Params.put("annexNr", "1");
                report2Params.put("registrationNumber", String.valueOf(seq.getId()));
                report2Params.put("registrationDate", sdf.format(new Date()));
                report2Params.put("annexTitle", "LISTA produselor medicamentoase autohtone autorizate în Republica Moldova");
                Map<String, List<MedicamentePentruOrdinDTO>> mapTest =
                        medMD.stream().collect(Collectors.groupingBy((MedicamentePentruOrdinDTO m) -> {
                            return m.getCountry() + "|" + m.getCompanyName();
                        }));
                Set<Map.Entry<String, List<MedicamentePentruOrdinDTO>>> entries = mapTest.entrySet();
                JasperPrint jasperPrint2 = JasperFillManager.fillReport(report2, report2Params, new JRBeanCollectionDataSource(entries));
                jasperPrints.add(jasperPrint2);
            }

            if (!medImport.isEmpty()) {
                ResourceLoader resourceLoader3 = new DefaultResourceLoader();
                Resource res3 = resourceLoader3.getResource("layouts/Anexa_Autorizare_Medicamente.jrxml");
                JasperReport report3 = JasperCompileManager.compileReport(res3.getInputStream());
                HashMap<String, Object> report3Params = new HashMap<>();
                report3Params.put("annexNr", "2");
                report3Params.put("registrationNumber", String.valueOf(seq.getId()));
                report3Params.put("registrationDate", sdf.format(new Date()));
                report3Params.put("annexTitle", "LISTA produselor medicamentoase de import autorizate în Republica Moldova  ");
                Map<String, List<MedicamentePentruOrdinDTO>> mapTest1 =
                        medImport.stream().collect(Collectors.groupingBy((MedicamentePentruOrdinDTO m) -> {
                            return m.getCountry() + "|" + m.getCompanyName();
                        }));
                Set<Map.Entry<String, List<MedicamentePentruOrdinDTO>>> entries1 = mapTest1.entrySet();
                JasperPrint jasperPrint3 = JasperFillManager.fillReport(report3, report3Params, new JRBeanCollectionDataSource(entries1));
                jasperPrints.add(jasperPrint3);
            }

            if (!medRepetatMD.isEmpty()) {
                ResourceLoader resourceLoader4 = new DefaultResourceLoader();
                Resource res4 = resourceLoader4.getResource("layouts/Anexa_Autorizare_Medicamente.jrxml");
                JasperReport report4 = JasperCompileManager.compileReport(res4.getInputStream());
                HashMap<String, Object> report4Params = new HashMap<>();
                report4Params.put("annexNr", "3");
                report4Params.put("registrationNumber", String.valueOf(seq.getId()));
                report4Params.put("registrationDate", sdf.format(new Date()));
                report4Params.put("annexTitle", "LISTA produselor medicamentoase autohtone autorizate repetat în Republica Moldova  ");
                Map<String, List<MedicamentePentruOrdinDTO>> mapTest2 =
                        medRepetatMD.stream().collect(Collectors.groupingBy((MedicamentePentruOrdinDTO m) -> {
                            return m.getCountry() + "|" + m.getCompanyName();
                        }));
                Set<Map.Entry<String, List<MedicamentePentruOrdinDTO>>> entries2 = mapTest2.entrySet();
                JasperPrint jasperPrint4 = JasperFillManager.fillReport(report4, report4Params, new JRBeanCollectionDataSource(entries2));
                jasperPrints.add(jasperPrint4);
            }

            if (!medRepetatImport.isEmpty()) {
                ResourceLoader resourceLoader5 = new DefaultResourceLoader();
                Resource res5 = resourceLoader5.getResource("layouts/Anexa_Autorizare_Medicamente.jrxml");
                JasperReport report5 = JasperCompileManager.compileReport(res5.getInputStream());
                HashMap<String, Object> report5Params = new HashMap<>();
                report5Params.put("annexNr", "4");
                report5Params.put("registrationNumber", String.valueOf(seq.getId()));
                report5Params.put("registrationDate", sdf.format(new Date()));
                report5Params.put("annexTitle", "LISTA produselor medicamentoase de import autorizate repetat în Republica Moldova");
                Map<String, List<MedicamentePentruOrdinDTO>> mapTest3 =
                        medRepetatImport.stream().collect(Collectors.groupingBy((MedicamentePentruOrdinDTO m) -> {
                            return m.getCountry() + "|" + m.getCompanyName();
                        }));
                Set<Map.Entry<String, List<MedicamentePentruOrdinDTO>>> entries3 = mapTest3.entrySet();
                JasperPrint jasperPrint5 = JasperFillManager.fillReport(report5, report5Params, new JRBeanCollectionDataSource(entries3));
                jasperPrints.add(jasperPrint5);
            }

            storageService.initIfNeeded(Paths.get(storageService.getRootFolder()), "ordine_de_autorizare_medicament");
            String outputFile = storageService.getRootFolder() + "/ordine_de_autorizare_medicament/Ordin de autorizare medicament Nr " + seq.getId() + ".pdf";
            OutputStream outputStream = new FileOutputStream(new File(outputFile));
            JRPdfExporter jrPdfExporter = new JRPdfExporter();
            jrPdfExporter.setExporterInput(SimpleExporterInput.getInstance(jasperPrints));
            jrPdfExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
            SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
            configuration.setCreatingBatchModeBookmarks(true);
            jrPdfExporter.setConfiguration(configuration);
            jrPdfExporter.exportReport();
            outputStream.close();

            bytes = Files.readAllBytes(new File(outputFile).toPath());

            //bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            //String docPath = storageService.storePDFFile(jasperPrint, "ordine_de_autorizare_medicament/Ordin de autorizare medicament Nr " + seq.getId() + ".pdf");

            //update requests
            medicamentRepository.setOANumber(ids, String.valueOf(seq.getId()));

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("OA").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
            outputDocumentsEntity.setName("Ordin de autorizare medicament Nr " + seq.getId() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(outputFile);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=ordinDeAutorizare.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-om", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateOM(@RequestBody List<MedicamentHistoryEntity> medicamentHistoryEntities) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader1 = new DefaultResourceLoader();
            Resource res1 = resourceLoader1.getResource("layouts/Ordin modificari.jrxml");
            JasperReport report1 = JasperCompileManager.compileReport(res1.getInputStream());

            /* Map to hold Jasper report Parameters */
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            Map<String, Object> parameters1 = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters1.put("date", sdf.format(new Date()));
            parameters1.put("nr", String.valueOf(seq.getId()));
            parameters1.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<MedicamentePentruOrdinDTO> anex1 = new ArrayList<>();
            for (MedicamentHistoryEntity history : medicamentHistoryEntities) {
                MedicamentePentruOrdinDTO medicamentePentruOrdinDTO = new MedicamentePentruOrdinDTO();
                medicamentePentruOrdinDTO.setMedicamentName(history.getCommercialNameTo());
                medicamentePentruOrdinDTO.setPharmaceutiFormDoseDivision(history.getPharmaceuticalFormTo().getDescription() + ", " + history.getDoseTo() + ", " + history.getDivisionHistory().stream().map(t -> Utils.getConcatenatedDivisionHistory(t)).collect(Collectors.joining("; ")));
                RegistrationRequestsEntity req = regRequestRepository.findById(history.getRequestId()).orElse(new RegistrationRequestsEntity());
                Set<String> vars = req.getVariations().stream().map(t -> t.getValue()).collect(Collectors.toSet());
                List<String> varsList = new ArrayList<String>(vars);
                Collections.sort(varsList, (p1, p2) -> p1.compareTo(p2));
                medicamentePentruOrdinDTO.setModificationType(varsList.stream().collect(Collectors.joining(",")));
                medicamentePentruOrdinDTO.setRegistrationNrDate(sdf.format(history.getRegistrationDate()));
                anex1.add(medicamentePentruOrdinDTO);
            }
            JRBeanCollectionDataSource ordinModificareAnex1JRBean = new JRBeanCollectionDataSource(anex1);
            parameters1.put("ordinModificareAnex1", ordinModificareAnex1JRBean);

            List<MedicamentePentruOrdinDTO> anex2 = new ArrayList<>();
            for (MedicamentHistoryEntity history : medicamentHistoryEntities) {
                MedicamentePentruOrdinDTO medicamentePentruOrdinDTO = new MedicamentePentruOrdinDTO();
                medicamentePentruOrdinDTO.setMedicamentName(history.getCommercialNameTo());
                medicamentePentruOrdinDTO.setPharmaceutiFormDoseDivision(history.getPharmaceuticalFormTo().getDescription() + ", " + history.getDoseTo() + ", " + history.getDivisionHistory().stream().map(t -> Utils.getConcatenatedDivisionHistory(t)).collect(Collectors.joining("; ")));
                medicamentePentruOrdinDTO.setRegistrationNrDate(sdf.format(history.getRegistrationDate()));
                anex2.add(medicamentePentruOrdinDTO);
            }
            JRBeanCollectionDataSource ordinModificareAnex2JRBean = new JRBeanCollectionDataSource(anex2);
            parameters1.put("ordinModificareAnex2", ordinModificareAnex2JRBean);

            JasperPrint jasperPrint1 = JasperFillManager.fillReport(report1, parameters1, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint1);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint1,
                    "ordine_de_aprobare_modificari_medicament/Ordin de aprobare a modificarilor postautorizare Nr " + seq.getId() + ".pdf");

            //update requests
            List<Integer> ids = new ArrayList<>();
            for (MedicamentHistoryEntity med : medicamentHistoryEntities) {
                ids.add(med.getId());
            }
            medicamentRepository.setOMNumber(ids, String.valueOf(seq.getId()));

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("OM").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
            outputDocumentsEntity.setName("Ordin de aprobare a modificarilor postautorizare Nr " + seq.getId() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (JRException | IOException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=ordinDeAutorizare.pdf").body(bytes);
    }

    @RequestMapping(value = "/remove-dd", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeDD(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByDDNumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
        }
        regRequestRepository.setDDNumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-ddm", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeDDM(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByDDNumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
        }
        regRequestRepository.setDDNumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-oi", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeOI(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByOINumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
        }
        regRequestRepository.setOINumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @RequestMapping(value = "/remove-act", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeAct(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByLabNumber(document.getNumber());
        Set<Integer> ids = new HashSet<>();
        Set<Integer> actIds = new HashSet<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
            Optional<OutputDocumentsEntity> outDocument = req.getOutputDocuments().stream().filter(t->t.getDocType().getCategory().equals("LAB")).findAny();
            if(outDocument.isPresent()) {
                actIds.add(outDocument.get().getId());
            }
        }
        regRequestRepository.setLabNumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        for(Integer id : actIds)
        {
            outputDocumentsRepository.deleteById(id);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-oim", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeOIM(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByOINumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
        }
        regRequestRepository.setOINumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-oa", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeOA(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<MedicamentEntity> medicaments = medicamentRepository.findMedicamentsByOANumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (MedicamentEntity med : medicaments) {
            ids.add(med.getId());
        }
        MedicamentEntity medMin = medicaments.stream().min(Comparator.comparing(MedicamentEntity::getRegistrationNumber)).get();
        generateMedicamentRegistrationNumberRepository.deleteSeq(medMin.getRegistrationNumber());
        generateMedicamentRegistrationNumberRepository.changeAutoIncrementFormMedicamentRegNr(medMin.getRegistrationNumber());
        medicamentRepository.clearOANumber(ids);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-om", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeOM(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<MedicamentHistoryEntity> medicaments = medicamentRepository.findMedicamentsByOMNumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (MedicamentHistoryEntity med : medicaments) {
            ids.add(med.getId());
        }
        medicamentRepository.clearOMNumber(ids);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/view-bon-de-plata", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlata(@RequestBody BonDePlataDTO bonDePlataDTO) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = null;
            Double coeficient = 1d;
            if (!bonDePlataDTO.getCurrency().isEmpty() && !bonDePlataDTO.getCurrency().equals("MDL")) {
                DateFormat formatter = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
                List<NmCurrenciesHistoryEntity> nmCurrenciesHistoryEntities = currencyHistoryRepository.findAllByPeriod(formatter.parse(formatter.format(new Date())));
                if (nmCurrenciesHistoryEntities.isEmpty()) {
                    throw new CustomException("Lipseste cursul valutar pentru astazi.");
                }
                NmCurrenciesHistoryEntity nmCurrenciesHistoryEntity =
                        nmCurrenciesHistoryEntities.stream().filter(t -> t.getCurrency().getShortDescription().equals(bonDePlataDTO.getCurrency())).findFirst().orElse(new NmCurrenciesHistoryEntity());
                if (nmCurrenciesHistoryEntity.getId() <= 0) {
                    throw new CustomException("Nu a fost gasit cursul valutar pentru valuta " + bonDePlataDTO.getCurrency());
                }
                coeficient = AmountUtils.round(nmCurrenciesHistoryEntity.getValue() / nmCurrenciesHistoryEntity.getMultiplicity(), 4);
            }
            switch (bonDePlataDTO.getCurrency()) {
                case "USD":
                    res = resourceLoader.getResource("layouts/Autorizare M Bon de plata USD.jrxml");
                    break;
                case "EUR":
                    res = resourceLoader.getResource("layouts/Autorizare M Bon de plata EUR.jrxml");
                    break;
                default:
                    res = resourceLoader.getResource("layouts/Autorizare M Bon de plata.jrxml");
                    break;
            }
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr_invoice", String.valueOf(seq.getId()));
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("invoice_date", sdf.format(Calendar.getInstance().getTime()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("companyName", bonDePlataDTO.getCompanyName());
            if (bonDePlataDTO.getAddress() != null) {
                parameters.put("companyAddress", bonDePlataDTO.getAddress());
            }
            parameters.put("companyCountry", bonDePlataDTO.getCompanyCountry());
            parameters.put("payer", bonDePlataDTO.getCompanyName());
            parameters.put("payer_address", bonDePlataDTO.getAddress());
            parameters.put("beneficiarBank", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK).get().getValue());
            parameters.put("beneficiarAddress", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_ADDRESS).get().getValue());
            parameters.put("beneficiarBankCode", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK_CODE).get().getValue());
            parameters.put("beneficiarBankAccount", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK_ACCOUNT).get().getValue());
            parameters.put("beneficiarIban", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_IBAN).get().getValue());
            parameters.put("vatCode", sysParamsRepository.findByCode(Constants.SysParams.VAT_CODE).get().getValue());
            parameters.put("beneficiar", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY).get().getValue());
            List<BonDePlataMedicamentDTO> detailsUpdated = new ArrayList<>();
            for (PaymentOrdersEntity paymentOrdersEntity : bonDePlataDTO.getPaymentOrders()) {
                if (!"BS".equals(paymentOrdersEntity.getServiceCharge().getCategory())) {
                    BonDePlataMedicamentDTO b = new BonDePlataMedicamentDTO();
                    b.assign(bonDePlataDTO.getMedicamentDetails().get(0));
                    b.setPrice(AmountUtils.round(paymentOrdersEntity.getQuantity() * paymentOrdersEntity.getAmount() / coeficient, 2));
                    detailsUpdated.add(b);
                }
            }
            Double sum = detailsUpdated.stream().map(t -> t.getPrice()).reduce(0d, Double::sum);
            parameters.put("sum", sum);
            JRBeanCollectionDataSource autorizareMbonDePlataDatasetJRBean = new JRBeanCollectionDataSource(detailsUpdated);
            parameters.put("autorizareMbonDePlataDataset", autorizareMbonDePlataDatasetJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
            saveBonDePlata(seq, jasperPrint);

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(bonDePlataDTO.getRequestId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            for (PaymentOrdersEntity order : details) {
                if (bonDePlataDTO.getPaymentOrders().stream().anyMatch(t -> t.getId().equals(order.getId()))) {
                    order.setDate(now);
                    order.setNumber(String.valueOf(seq.getId()));
                    order.setCurrency(bonDePlataDTO.getCurrency());
                    order.setAmountExchanged(AmountUtils.round(order.getQuantity() * order.getAmount() / coeficient, 2));
                    if("BS".equals(order.getServiceCharge().getCategory())) {
                        order.setNumber(null);
                    }
                    paymentOrderRepository.save(order);
                    jobSchedulerComponent.jobUnschedule("/wait-evaluation-medicament-registration", bonDePlataDTO.getRequestId());
                }
            }
        } catch (IOException | JRException | ParseException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlata.pdf").body(bytes);
    }

    private void saveBonDePlata(PaymentOrderNumberSequence seq, JasperPrint jasperPrint) throws CustomException {
        //save to storage
        String docPath = storageService.storePDFFile(jasperPrint, "bonuri_de_plata/Bon de plata Nr " + String.valueOf(seq.getId()) + ".pdf");

        // save in db
        OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
        outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
        outputDocumentsEntity.setName("Bon de plata Nr " + String.valueOf(seq.getId()) + ".pdf");
        outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("BON").orElse(new NmDocumentTypesEntity()));
        outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
        outputDocumentsEntity.setPath(docPath);
        outputDocumentsRepository.save(outputDocumentsEntity);
    }

    @RequestMapping(value = "/view-bon-de-plata-suplimentar", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlataSuplimentar(@RequestBody BonDePlataDTO bonDePlataDTO) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Cont de plata suplimentar.jrxml");

            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("La Nr.", String.valueOf(seq.getId()));
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("Din: ", sdf.format(Calendar.getInstance().getTime()));
            parameters.put("Contabil-şef", sysParamsRepository.findByCode(Constants.SysParams.ACCOUNTANT).get().getValue());
            parameters.put("Spre plată", bonDePlataDTO.getPaymentOrders().get(0).getAmount());

            parameters.put("companyName", bonDePlataDTO.getCompanyName());
            parameters.put("companyAddress", bonDePlataDTO.getAddress());
            parameters.put("companyCountry", bonDePlataDTO.getCompanyCountry());
            parameters.put("payer", bonDePlataDTO.getCompanyName());
            parameters.put("payer_address", bonDePlataDTO.getAddress());
            parameters.put("beneficiarBank", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK).get().getValue());
            parameters.put("beneficiarAddress", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_ADDRESS).get().getValue());
            parameters.put("beneficiarBankCode", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK_CODE).get().getValue());
            parameters.put("beneficiarBankAccount", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_BANK_ACCOUNT).get().getValue());
            parameters.put("beneficiarIban", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY_IBAN).get().getValue());
            parameters.put("vatCode", sysParamsRepository.findByCode(Constants.SysParams.VAT_CODE).get().getValue());
            parameters.put("beneficiar", sysParamsRepository.findByCode(Constants.SysParams.BENEFICIARY).get().getValue());

            List<ContPlataSuplimentarDTO> contPlataSuplimentarList = new ArrayList<>();
            ContPlataSuplimentarDTO cps = new ContPlataSuplimentarDTO();
            cps.setName(bonDePlataDTO.getMedicamentDetails().get(0).getMedicamentName() + " " + bonDePlataDTO.getMedicamentDetails().get(0).getPharmaceuticForm() +
                    " " + bonDePlataDTO.getMedicamentDetails().get(0).getDose() + " " + bonDePlataDTO.getMedicamentDetails().get(0).getDivision());
            cps.setSumValut(bonDePlataDTO.getPaymentOrders().get(0).getAmount());
            contPlataSuplimentarList.add(cps);
            JRBeanCollectionDataSource contPlataSuplimentarDatasetJRBean = new JRBeanCollectionDataSource(contPlataSuplimentarList);
            parameters.put("contPlataSuplimentarDataset", contPlataSuplimentarDatasetJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            saveBonDePlata(seq, jasperPrint);

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(bonDePlataDTO.getRequestId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            for (PaymentOrdersEntity order : details) {
                if (bonDePlataDTO.getPaymentOrders().stream().anyMatch(t -> t.getId().equals(order.getId()))) {
                    order.setDate(now);
                    order.setNumber(String.valueOf(seq.getId()));
                    order.setCurrency(bonDePlataDTO.getCurrency());
                    order.setAmountExchanged(AmountUtils.round(order.getQuantity() * order.getAmount(), 2));
                    paymentOrderRepository.save(order);
                }
            }
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlata.pdf").body(bytes);
    }

    private void createRootPath(String nrCerere, StringBuilder sb) {
        sb.append("/");
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date date = new Date();
        sb.append(sdf.format(date));
        sb.append("/");
        sb.append(nrCerere);
        sb.append("/");
    }

    @RequestMapping(value = "/view-medicament-authorization-certificate", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewMedicamentAuthorizationCertificate(@RequestBody AuthorizationCertificateDTO certificateDTO) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Autorizare M Certificat de autorizare.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("medName", certificateDTO.getMedName());
            parameters.put("formFarmDosePakageSize", certificateDTO.getPharmaceuticalPhorm() + " " + certificateDTO.getDose() + " " + certificateDTO.getDivisions());
            String composition = "substanţe active: " + certificateDTO.getActiveSubstances().stream().collect(Collectors.joining("; "));
            composition += "\r\nexcipienţi: anexa 1";
            parameters.put("composition", composition);
            parameters.put("marketingAutorizationHolder", certificateDTO.getAuthorizationHolder() + "," + certificateDTO.getAuthorizationHolderCountry());
            parameters.put("manufacturer", certificateDTO.getManufacture() + "," + certificateDTO.getManufactureCountry());
            parameters.put("atcClassification", certificateDTO.getAtcCode());
            parameters.put("shelfLife", certificateDTO.getTermsOfValidity() + " luni");
            SimpleDateFormat sdf = new SimpleDateFormat("dd MMMM yyyy", new Locale("ro", "RO"));
            parameters.put("registrationNumberDateIssue", certificateDTO.getRegistrationNumber() + " din " + sdf.format(certificateDTO.getRegistrationDate()));
            parameters.put("summary", "anexa 1");
            parameters.put("instructions", "anexa 2");
            parameters.put("labeling", "anexa 2");
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("orderNumber", certificateDTO.getOrderNumber());
            parameters.put("orderDateMD", sdf.format(certificateDTO.getOrderDate()));
            SimpleDateFormat sdfEn = new SimpleDateFormat("dd MMMM yyyy", new Locale("en", "EN"));
            parameters.put("orderDateEN", sdfEn.format(certificateDTO.getOrderDate()));

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=medicamentCertificate.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-ordin-de-inspectare-gmp", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewOrdinDeInspectareGMP(@RequestBody GMPDetailsDTO details) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/GMP Ordin.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", details.getOrderNr());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("date", sdf.format(Calendar.getInstance().getTime()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("expertsLeader", details.getExpertsLeader());
            parameters.put("expertsLeaderFuncion", details.getExpertsLeaderFunction());
            parameters.put("fnDate", sdf.format(details.getRequestDate()));
            parameters.put("registredMailNr", details.getRequestNr());
            parameters.put("registredMailDate", sdf.format(details.getRequestDate()));
            parameters.put("distributionCompany", details.getCompanyName());
            parameters.put("distributionCompanyAddress", details.getDistributionCompanyAddress());
            parameters.put("firstInspectionDate", sdf.format(details.getFirstInspectionDate()));
            parameters.put("companyName", details.getCompanyName());
            parameters.put("inspectorsNameFunction", details.getInspectorsName());

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=ordin.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-autorizatie-de-fabricatie-gmp", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAutorizatieDeFabricatieGMP(@RequestBody GMPDetailsDTO details) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader1 = new DefaultResourceLoader();
            Resource res1 = resourceLoader1.getResource("layouts/GMP autorizatie de fabricatie.jrxml");
            JasperReport report1 = JasperCompileManager.compileReport(res1.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters1 = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters1.put("autorizationNr", details.getAutorizationNr());
            parameters1.put("date", sdf.format(Calendar.getInstance().getTime()));
            parameters1.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters1.put("autorizationOwner", details.getCompanyName());
            parameters1.put("fabricationAddress", details.getDistributionCompanyAddress());
            parameters1.put("legalAddress", details.getCompanyAddress());
            if (Boolean.TRUE.equals(details.getMedicamentClinicalInvestigation()) && (Boolean.TRUE.equals(details.getMedicamentHumanUse()) || Boolean.TRUE.equals(details.getMedicamentVeterinary()))) {
                parameters1.put("authorizationSoupe", "Anexa 1 si Anexa 2");
                parameters1.put("mainAnnex", "Anexa 1 si Anexa 2");
            } else if (Boolean.TRUE.equals(details.getMedicamentClinicalInvestigation())) {
                parameters1.put("authorizationSoupe", "Anexa 2");
                parameters1.put("mainAnnex", "Anexa 2");
            } else if (Boolean.TRUE.equals(details.getMedicamentHumanUse()) || Boolean.TRUE.equals(details.getMedicamentVeterinary())) {
                parameters1.put("authorizationSoupe", "Anexa 1");
                parameters1.put("mainAnnex", "Anexa 1");
            }
            Calendar c = Calendar.getInstance();
            c.add(Calendar.YEAR, 5);
            parameters1.put("validUntil", sdf.format(c.getTime()));
            String optionalAnnexes = "Anexa 3 (Adresa locului(lor) de fabricaţie prin contract)|";
            if (details.getLaboratories() != null && !details.getLaboratories().isEmpty()) {
                optionalAnnexes += "Anexa 4 (Adresa laboratoarelor cu analize prin contract)|";
            }
            if (details.getQualifiedPersons() != null && !details.getQualifiedPersons().isEmpty()) {
                optionalAnnexes += "Anexa 5 (Numele Persoanei Calificate)|";
            }
            if ((details.getResponsiblePersons() != null && !details.getResponsiblePersons().isEmpty()) || (details.getQualityControlPersons() != null && !details.getQualityControlPersons().isEmpty())) {
                optionalAnnexes += "Anexa 6 (Numele persoanelor responsabile)|";
            }
            optionalAnnexes += "Anexa 7 (Data inspecţiei în baza căreia a fost eliberată autorizaţia, scopul ultimei inspecţii)|";
            if (details.getAutorizatedMedicamentsForProduction() != null && !details.getAutorizatedMedicamentsForProduction().isEmpty()) {
                optionalAnnexes += "Anexa 8 (Medicamente autorizate pentru a fi fabricate)";
            }
            parameters1.put("optionalAnnexes", optionalAnnexes);
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(report1, parameters1, new JREmptyDataSource());

            List<JasperPrint> jasperPrints = new ArrayList<>();
            jasperPrints.add(jasperPrint1);

            if (Boolean.TRUE.equals(details.getMedicamentHumanUse()) || Boolean.TRUE.equals(details.getMedicamentVeterinary())) {
                fillAnexaI(details, sdf, jasperPrints);
            }
            if (Boolean.TRUE.equals(details.getMedicamentClinicalInvestigation())) {
                fillAnexaII(details, sdf, jasperPrints);
            }
            fillAnexaIII(details, sdf, jasperPrints);
            if (details.getLaboratories() != null && !details.getLaboratories().isEmpty()) {
                fillAnexaIV(details, sdf, jasperPrints);
            }
            if (details.getQualifiedPersons() != null && !details.getQualifiedPersons().isEmpty()) {
                fillAnexaV(details, sdf, jasperPrints);
            }
            if ((details.getResponsiblePersons() != null && !details.getResponsiblePersons().isEmpty()) || (details.getQualityControlPersons() != null && !details.getQualityControlPersons().isEmpty())) {
                fillAnexaVI(details, sdf, jasperPrints);
            }
            fillAnexaVII(details, sdf, jasperPrints);
            if (details.getAutorizatedMedicamentsForProduction() != null && !details.getAutorizatedMedicamentsForProduction().isEmpty()) {
                fillAnexaVIII(details, sdf, jasperPrints);
            }

            storageService.initIfNeeded(Paths.get(storageService.getRootFolder()), "autorizatie_gmp");
            String outputFile = storageService.getRootFolder() + "/autorizatie_gmp/Autorizatie GMP.pdf";
            OutputStream outputStream = new FileOutputStream(new File(outputFile));
            JRPdfExporter jrPdfExporter = new JRPdfExporter();
            jrPdfExporter.setExporterInput(SimpleExporterInput.getInstance(jasperPrints));
            jrPdfExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
            SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
            configuration.setCreatingBatchModeBookmarks(true);
            jrPdfExporter.setConfiguration(configuration);
            jrPdfExporter.exportReport();
            outputStream.close();

            bytes = Files.readAllBytes(new File(outputFile).toPath());
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=autorizatieGMP.pdf").body(bytes);
    }

    private Map<String, Object> fillCommonCertificateGMPDetails(GMPDetailsDTO details) {
        Map<String, Object> parameters1 = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
        parameters1.put("nr", details.getCertificateNr());
        parameters1.put("date", sdf.format(Calendar.getInstance().getTime()));
        parameters1.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
        parameters1.put("amedNr", details.getOrderNr());
        parameters1.put("amedDate", sdf.format(details.getOrderDate()));
        parameters1.put("manufacturer", details.getDistributionCompanyName());
        parameters1.put("manufacturerAddress", details.getDistributionCompanyAddress());
        parameters1.put("licenseSeries", details.getLicenseSeries());
        parameters1.put("licenseNr", details.getLicenseNr());
        parameters1.put("licenseDate", sdf.format(details.getLicenseDate()));
        parameters1.put("productionAuthorizationNr", details.getAutorizationNr());
        parameters1.put("productionAuthorizationDate", sdf.format(details.getAutorizationDate()));
        parameters1.put("lastInspectionDate", sdf.format(details.getInspectionDate()));
        return parameters1;
    }

    @RequestMapping(value = "/view-certificat-gmp", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewCertificatGMP(@RequestBody GMPDetailsDTO details) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader1 = new DefaultResourceLoader();
            Resource res1 = resourceLoader1.getResource("layouts/GMP certificat.jrxml");
            JasperReport report1 = JasperCompileManager.compileReport(res1.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters1 = fillCommonCertificateGMPDetails(details);
            JasperPrint jasperPrint1 = JasperFillManager.fillReport(report1, parameters1, new JREmptyDataSource());

            List<JasperPrint> jasperPrints = new ArrayList<>();
            jasperPrints.add(jasperPrint1);

            ResourceLoader resourceLoader2 = new DefaultResourceLoader();
            Resource res2 = resourceLoader2.getResource("layouts/GMP certificat part 2.jrxml");
            JasperReport report2 = JasperCompileManager.compileReport(res2.getInputStream());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            Map<String, Object> report2Params = fillCommonCertificateGMPDetails(details);
            report2Params.put("humanUse", Boolean.TRUE.equals(details.getMedicamentHumanUse()));
            report2Params.put("veterinaryUse", Boolean.FALSE);

            report2Params.put("clinicalInvestigation", Boolean.TRUE.equals(details.getMedicamentClinicalInvestigation()));
            report2Params.put("nameAndFunctionResponsablePerson", details.getCompanyName() + " " + details.getDistributionCompanyAddress());
            fillCommonListsImport(details, report2Params);
            fillCommonLists(details, jasperPrints, report2, report2Params, true);

            storageService.initIfNeeded(Paths.get(storageService.getRootFolder()), "certificat_gmp");
            String outputFile = storageService.getRootFolder() + "/certificat_gmp/Certificat GMP.pdf";
            OutputStream outputStream = new FileOutputStream(new File(outputFile));
            JRPdfExporter jrPdfExporter = new JRPdfExporter();
            jrPdfExporter.setExporterInput(SimpleExporterInput.getInstance(jasperPrints));
            jrPdfExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
            SimplePdfExporterConfiguration configuration = new SimplePdfExporterConfiguration();
            configuration.setCreatingBatchModeBookmarks(true);
            jrPdfExporter.setConfiguration(configuration);
            jrPdfExporter.exportReport();
            outputStream.close();

            bytes = Files.readAllBytes(new File(outputFile).toPath());
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=autorizatieGMP.pdf").body(bytes);
    }

    private void fillAnexaI(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader2 = new DefaultResourceLoader();
        Resource res2 = resourceLoader2.getResource("layouts/GMP autorizare de fabricatie anexa 1.jrxml");
        JasperReport report2 = JasperCompileManager.compileReport(res2.getInputStream());
        HashMap<String, Object> report2Params = fillCommonAnnexesParameters(details, sdf);
        report2Params.put("humanUse", Boolean.TRUE.equals(details.getMedicamentHumanUse()));
        report2Params.put("veterinaryUse", Boolean.FALSE);
        fillListsMedicinesForHumanUse(details, jasperPrints, report2, report2Params, false);
    }

    private void fillAnexaII(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader3 = new DefaultResourceLoader();
        Resource res3 = resourceLoader3.getResource("layouts/GMP autorizare de fabricatie anexa 2.jrxml");
        JasperReport report3 = JasperCompileManager.compileReport(res3.getInputStream());
        HashMap<String, Object> report3Params = fillCommonAnnexesParameters(details, sdf);
        fillListsClinicalInvestigationMedicines(details, jasperPrints, report3, report3Params, false);
    }

    private void fillAnexaIII(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader4 = new DefaultResourceLoader();
        Resource res4 = resourceLoader4.getResource("layouts/GMP autorizare de fabricatie anexa 3.jrxml");
        JasperReport report4 = JasperCompileManager.compileReport(res4.getInputStream());
        HashMap<String, Object> report4Params = fillCommonAnnexesParameters(details, sdf);
        List<GMPLocDeFabricatieDTO> fabricatiiLocuri = new ArrayList<>();
        GMPLocDeFabricatieDTO loc = new GMPLocDeFabricatieDTO();
        loc.setName(details.getDistributionCompanyName());
        loc.setAddress(details.getDistributionCompanyAddress());
        loc.setStagesOfManufacture(details.getStagesOfManufacture());
        fabricatiiLocuri.add(loc);
        JRBeanCollectionDataSource locJRBean = new JRBeanCollectionDataSource(fabricatiiLocuri);
        report4Params.put("gmpDataset1", locJRBean);
        JasperPrint jasperPrint4 = JasperFillManager.fillReport(report4, report4Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint4);
    }

    private void fillAnexaIV(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader5 = new DefaultResourceLoader();
        Resource res5 = resourceLoader5.getResource("layouts/GMP autorizare de fabricatie anexa 4.jrxml");
        JasperReport report5 = JasperCompileManager.compileReport(res5.getInputStream());
        HashMap<String, Object> report5Params = fillCommonAnnexesParameters(details, sdf);
        List<GMPLaboratorDTO> laboratories = new ArrayList<>();
        details.getLaboratories().stream().forEach(l -> laboratories.add(l));
        JRBeanCollectionDataSource labJRBean = new JRBeanCollectionDataSource(laboratories);
        report5Params.put("gmpDataset1", labJRBean);
        JasperPrint jasperPrint5 = JasperFillManager.fillReport(report5, report5Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint5);
    }

    private void fillAnexaV(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader6 = new DefaultResourceLoader();
        Resource res6 = resourceLoader6.getResource("layouts/GMP autorizare de fabricatie anexa 5.jrxml");
        JasperReport report6 = JasperCompileManager.compileReport(res6.getInputStream());
        HashMap<String, Object> report6Params = fillCommonAnnexesParameters(details, sdf);
        report6Params.put("nameOfcalificationPerson", details.getQualifiedPersons().stream().findAny().orElse(""));
        JasperPrint jasperPrint6 = JasperFillManager.fillReport(report6, report6Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint6);
    }

    private void fillAnexaVI(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader7 = new DefaultResourceLoader();
        Resource res7 = resourceLoader7.getResource("layouts/GMP autorizare de fabricatie anexa 6.jrxml");
        JasperReport report7 = JasperCompileManager.compileReport(res7.getInputStream());
        HashMap<String, Object> report7Params = fillCommonAnnexesParameters(details, sdf);
        report7Params.put("nameOfQualityControl", details.getQualityControlPersons().stream().findAny().orElse(""));
        report7Params.put("manufacturingForResponsiblePerson", details.getResponsiblePersons().stream().findAny().orElse(""));
        JasperPrint jasperPrint7 = JasperFillManager.fillReport(report7, report7Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint7);
    }

    private void fillAnexaVII(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader8 = new DefaultResourceLoader();
        Resource res8 = resourceLoader8.getResource("layouts/GMP autorizare de fabricatie anexa 7.jrxml");
        JasperReport report8 = JasperCompileManager.compileReport(res8.getInputStream());
        HashMap<String, Object> report8Params = fillCommonAnnexesParameters(details, sdf);
        report8Params.put("inspectionDates", sdf.format(details.getInspectionDate()));
        report8Params.put("aplicationDomainOfLastInspection", details.getAplicationDomainOfLastInspection());
        JasperPrint jasperPrint8 = JasperFillManager.fillReport(report8, report8Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint8);
    }

    private void fillAnexaVIII(GMPDetailsDTO details, SimpleDateFormat sdf, List<JasperPrint> jasperPrints) throws JRException, IOException {
        ResourceLoader resourceLoader9 = new DefaultResourceLoader();
        Resource res9 = resourceLoader9.getResource("layouts/GMP autorizare de fabricatie anexa 8.jrxml");
        JasperReport report9 = JasperCompileManager.compileReport(res9.getInputStream());
        HashMap<String, Object> report9Params = fillCommonAnnexesParameters(details, sdf);
        String str = "\t";
        for (GMPAuthorizedMedicamentDTO m : details.getAutorizatedMedicamentsForProduction()) {
            str += m.getName() + " " + m.getCertificateHolder() + "|";
        }
        report9Params.put("autorizatedMedicamentForProduction", str);
        JasperPrint jasperPrint9 = JasperFillManager.fillReport(report9, report9Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint9);
    }

    private void fillCommonListsImport(GMPDetailsDTO details, Map<String, Object> report3Params) throws JRException {
        int i = 0;
        if (details.getQualityControlTestsImport() != null && !details.getQualityControlTestsImport().isEmpty()) {
            fillQualityTestsImport(details, report3Params, ++i);
        }
        if (Boolean.TRUE.equals(details.getPreparateAsepticImport()) || Boolean.TRUE.equals(details.getSterilizateFinalImport()) || Boolean.TRUE.equals(details.getProduseNesterileImport())
                || (details.getMedicamenteBiologice() != null && !details.getMedicamenteBiologice().isEmpty()) || (details.getOtherImports() != null && !details.getOtherImports().isEmpty())) {
            fillImportDetails(details, report3Params, ++i);
        }
    }

    private void fillImportDetails(GMPDetailsDTO details, Map<String, Object> report2Params, int i) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseSterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Certificarea seriei medicamentelor importate|Batch certification of imported medicinal products");
        dataSet.setValue("\t");
        if (Boolean.TRUE.equals(details.getPreparateAsepticImport()) || Boolean.TRUE.equals(details.getSterilizateFinalImport())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Produse sterile|Sterile Products|");
            if (Boolean.TRUE.equals(details.getPreparateAsepticImport())) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ")Preparate aseptic|\tAseptically prepared|");
            }
            if (Boolean.TRUE.equals(details.getSterilizateFinalImport())) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ")Sterilizate final|\tTerminally sterilised|");
            }
        }
        if (Boolean.TRUE.equals(details.getProduseNesterileImport())) {
            dataSet.setValue(dataSet.getValue() + (++j) + ") Produse nesterile|Non-sterile products|");
        }
        if (details.getMedicamenteBiologiceImport() != null && !details.getMedicamenteBiologiceImport().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Medicamente biologice|Biological medicinal products|");
            for (GMPMedDTO p : details.getMedicamenteBiologiceImport()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getOtherImports() != null && !details.getOtherImports().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Alte activităţi de import|Other importation activities|");
            for (GMPMedDTO p : details.getOtherImports()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpProduseSterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseSterileJRBean = new JRBeanCollectionDataSource(gmpProduseSterile);
        report2Params.put("gmpDataset8", gmpProduseSterileJRBean);
    }

    private void fillCommonLists(GMPDetailsDTO details, List<JasperPrint> jasperPrints, JasperReport report3, Map<String, Object> report3Params,
                                 boolean displayEnglish) throws JRException {
        int i = 0;
        if ((details.getPreparateAseptic() != null && !details.getPreparateAseptic().isEmpty()) || (details.getSterilizateFinal() != null && !details.getSterilizateFinal().isEmpty())
                || (details.getCertificareaSeriei() != null && !details.getCertificareaSeriei().isEmpty())
                || (details.getPreparateAsepticMedicamenteClinice() != null && !details.getPreparateAsepticMedicamenteClinice().isEmpty())
                || (details.getSterilizateFinalMedicamenteClinice() != null && !details.getSterilizateFinalMedicamenteClinice().isEmpty())
                || (details.getCertificareaSerieiMedicamenteClinice() != null && !details.getCertificareaSerieiMedicamenteClinice().isEmpty())) {
            fillCommonProduseSterile(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getProduseNesterile() != null && !details.getProduseNesterile().isEmpty()) || (details.getProduseNesterileNumaiCertificareaSeriei() != null && !details.getProduseNesterileNumaiCertificareaSeriei().isEmpty())
                || (details.getProduseNesterileMedicamenteClinice() != null && !details.getProduseNesterileMedicamenteClinice().isEmpty())
                || (details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice() != null && !details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice().isEmpty())) {
            fillCommonProduseNesterile(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getMedicamenteBiologice() != null && !details.getMedicamenteBiologice().isEmpty()) || (details.getMedicamenteBiologiceNumaiCertificareaSeriei() != null && !details.getMedicamenteBiologiceNumaiCertificareaSeriei().isEmpty())
                || (details.getMedicamenteBiologiceMedicamenteClinice() != null && !details.getMedicamenteBiologiceMedicamenteClinice().isEmpty())
                || (details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice() != null && !details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice().isEmpty())) {
            fillCommonMedicamenteBiologice(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getManufactures() != null && !details.getManufactures().isEmpty()) || (details.getSubstanceSterilization() != null && !details.getSubstanceSterilization().isEmpty())
                || (details.getOtherManufactures() != null && !details.getOtherManufactures().isEmpty())
                || (details.getManufacturesMedicamenteClinice() != null && !details.getManufacturesMedicamenteClinice().isEmpty())
                || (details.getSubstanceSterilizationMedicamenteClinice() != null && !details.getSubstanceSterilizationMedicamenteClinice().isEmpty())
                || (details.getOtherManufacturesMedicamenteClinice() != null && !details.getOtherManufacturesMedicamenteClinice().isEmpty())) {
            fillCommonManufactures(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getAmbalarePrimara() != null && !details.getAmbalarePrimara().isEmpty()) || (details.getAmbalareSecundara() != null && !details.getAmbalareSecundara().isEmpty())
                || (details.getAmbalarePrimaraMedicamenteClinice() != null && !details.getAmbalarePrimaraMedicamenteClinice().isEmpty()) ||
                (details.getAmbalareSecundaraMedicamenteClinice() != null && !details.getAmbalareSecundaraMedicamenteClinice().isEmpty())) {
            fillCommonAmbalare(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getQualityControlTests() != null && !details.getQualityControlTests().isEmpty())
                || (details.getQualityControlTestsMedicamenteClinice() != null && !details.getQualityControlTestsMedicamenteClinice().isEmpty())) {
            fillCommonQualityTests(details, report3Params, ++i, displayEnglish);
        }
        JasperPrint jasperPrint3 = JasperFillManager.fillReport(report3, report3Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint3);
    }

    private void fillListsMedicinesForHumanUse(GMPDetailsDTO details, List<JasperPrint> jasperPrints, JasperReport report3, Map<String, Object> report3Params,
                                               boolean displayEnglish) throws JRException {
        int i = 0;
        if ((details.getPreparateAseptic() != null && !details.getPreparateAseptic().isEmpty()) || (details.getSterilizateFinal() != null && !details.getSterilizateFinal().isEmpty())
                || (details.getCertificareaSeriei() != null && !details.getCertificareaSeriei().isEmpty())) {
            fillProduseSterile(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getProduseNesterile() != null && !details.getProduseNesterile().isEmpty()) || (details.getProduseNesterileNumaiCertificareaSeriei() != null && !details.getProduseNesterileNumaiCertificareaSeriei().isEmpty())) {
            fillProduseNesterile(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getMedicamenteBiologice() != null && !details.getMedicamenteBiologice().isEmpty()) || (details.getMedicamenteBiologiceNumaiCertificareaSeriei() != null && !details.getMedicamenteBiologiceNumaiCertificareaSeriei().isEmpty())) {
            fillMedicamenteBiologice(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getManufactures() != null && !details.getManufactures().isEmpty()) || (details.getSubstanceSterilization() != null && !details.getSubstanceSterilization().isEmpty())
                || (details.getOtherManufactures() != null && !details.getOtherManufactures().isEmpty())) {
            fillManufactures(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getAmbalarePrimara() != null && !details.getAmbalarePrimara().isEmpty()) || (details.getAmbalareSecundara() != null && !details.getAmbalareSecundara().isEmpty())) {
            fillAmbalare(details, report3Params, ++i, displayEnglish);
        }
        if (details.getQualityControlTests() != null && !details.getQualityControlTests().isEmpty()) {
            fillQualityTests(details, report3Params, ++i, displayEnglish);
        }
        JasperPrint jasperPrint3 = JasperFillManager.fillReport(report3, report3Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint3);
    }

    private void fillListsClinicalInvestigationMedicines(GMPDetailsDTO details, List<JasperPrint> jasperPrints, JasperReport report3, Map<String, Object> report3Params,
                                                         boolean displayEnglish) throws JRException {
        int i = 0;
        if ((details.getPreparateAsepticMedicamenteClinice() != null && !details.getPreparateAsepticMedicamenteClinice().isEmpty()) || (details.getSterilizateFinalMedicamenteClinice() != null && !details.getSterilizateFinalMedicamenteClinice().isEmpty())
                || (details.getCertificareaSerieiMedicamenteClinice() != null && !details.getCertificareaSerieiMedicamenteClinice().isEmpty())) {
            fillProduseSterileClinicalInvestigationMedicines(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getProduseNesterile() != null && !details.getProduseNesterile().isEmpty()) || (details.getProduseNesterileNumaiCertificareaSeriei() != null && !details.getProduseNesterileNumaiCertificareaSeriei().isEmpty())) {
            fillProduseNesterileClinicalInvestigationMedicines(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getMedicamenteBiologice() != null && !details.getMedicamenteBiologice().isEmpty()) || (details.getMedicamenteBiologiceNumaiCertificareaSeriei() != null && !details.getMedicamenteBiologiceNumaiCertificareaSeriei().isEmpty())) {
            fillMedicamenteBiologiceClinicalInvestigationMedicines(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getManufactures() != null && !details.getManufactures().isEmpty()) || (details.getSubstanceSterilization() != null && !details.getSubstanceSterilization().isEmpty())
                || (details.getOtherManufactures() != null && !details.getOtherManufactures().isEmpty())) {
            fillManufacturesClinicalInvestigationMedicines(details, report3Params, ++i, displayEnglish);
        }
        if ((details.getAmbalarePrimara() != null && !details.getAmbalarePrimara().isEmpty()) || (details.getAmbalareSecundara() != null && !details.getAmbalareSecundara().isEmpty())) {
            fillAmbalareClinicalInvestigationMedicines(details, report3Params, ++i, displayEnglish);
        }
        if (details.getQualityControlTests() != null && !details.getQualityControlTests().isEmpty()) {
            fillQualityTestsClinicalInvestigationMedicines(details, report3Params, ++i, displayEnglish);
        }
        JasperPrint jasperPrint3 = JasperFillManager.fillReport(report3, report3Params, new JREmptyDataSource());
        jasperPrints.add(jasperPrint3);
    }


    private HashMap<String, Object> fillCommonAnnexesParameters(GMPDetailsDTO details, SimpleDateFormat sdf) {
        HashMap<String, Object> report2Params = new HashMap<>();
        report2Params.put("nr", details.getAutorizationNr());
        report2Params.put("date", sdf.format(Calendar.getInstance().getTime()));
        report2Params.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
        report2Params.put("amedNr", details.getAutorizationNr());
        report2Params.put("amedDate", sdf.format(Calendar.getInstance().getTime()));
        report2Params.put("applicantNameAndAddres", details.getCompanyName() + " " + details.getDistributionCompanyAddress());
        return report2Params;
    }

    private void fillQualityTests(GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        List<GMPDataSetDTO> gmpTests = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Teste pentru controlul calităţii" + (displayEnglish ? "|Quality control testing" : ""));
        dataSet.setValue("\t");
        if (details.getQualityControlTests() != null && !details.getQualityControlTests().isEmpty()) {
            int j = 0;
            for (GMPMedDTO p : details.getQualityControlTests()) {
                dataSet.setValue(dataSet.getValue() + " " + (++j) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? p.getValueEn() + "|" : ""));
            }
        }
        gmpTests.add(dataSet);
        JRBeanCollectionDataSource gmpTestsJRBean = new JRBeanCollectionDataSource(gmpTests);
        report2Params.put("gmpDataset6", gmpTestsJRBean);
    }

    private void fillCommonQualityTests(GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        List<GMPDataSetDTO> gmpTests = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Teste pentru controlul calităţii" + (displayEnglish ? "|Quality control testing" : ""));
        dataSet.setValue("\t");
        if ((details.getQualityControlTests() != null && !details.getQualityControlTests().isEmpty())
                || (details.getQualityControlTestsMedicamenteClinice() != null && !details.getQualityControlTestsMedicamenteClinice().isEmpty())) {
            int j = 0;
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getQualityControlTests() != null) {
                for (GMPMedDTO p : details.getQualityControlTests()) {
                    meds.add(p);
                }
            }
            if (details.getQualityControlTestsMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getQualityControlTestsMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " " + (++j) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? p.getValueEn() + "|" : ""));
            }
        }
        gmpTests.add(dataSet);
        JRBeanCollectionDataSource gmpTestsJRBean = new JRBeanCollectionDataSource(gmpTests);
        report2Params.put("gmpDataset6", gmpTestsJRBean);
    }

    private void fillQualityTestsClinicalInvestigationMedicines(GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        List<GMPDataSetDTO> gmpTests = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Teste pentru controlul calităţii" + (displayEnglish ? "|Quality control testing" : ""));
        dataSet.setValue("\t");
        if (details.getQualityControlTestsMedicamenteClinice() != null && !details.getQualityControlTestsMedicamenteClinice().isEmpty()) {
            int j = 0;
            for (GMPMedDTO p : details.getQualityControlTestsMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " " + (++j) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? p.getValueEn() + "|" : ""));
            }
        }
        gmpTests.add(dataSet);
        JRBeanCollectionDataSource gmpTestsJRBean = new JRBeanCollectionDataSource(gmpTests);
        report2Params.put("gmpDataset6", gmpTestsJRBean);
    }

    private void fillQualityTestsImport(GMPDetailsDTO details, Map<String, Object> report2Params, int i) {
        List<GMPDataSetDTO> gmpTests = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Teste pentru controlul calităţii medicamentelor importate|Quality control testing of imported medicinal products");
        dataSet.setValue("\t");
        if (details.getQualityControlTestsImport() != null && !details.getQualityControlTestsImport().isEmpty()) {
            int j = 0;
            for (GMPMedDTO p : details.getQualityControlTestsImport()) {
                dataSet.setValue(dataSet.getValue() + " " + (++j) + ") " + p.getValue() + "|" + p.getValueEn() + "|");
            }
        }
        gmpTests.add(dataSet);
        JRBeanCollectionDataSource gmpTestsJRBean = new JRBeanCollectionDataSource(gmpTests);
        report2Params.put("gmpDataset7", gmpTestsJRBean);
    }

    private void fillProduseSterile(GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseSterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Produse sterile" + (displayEnglish ? "|Sterile Products" : ""));
        dataSet.setValue("\t");
        if (details.getPreparateAseptic() != null && !details.getPreparateAseptic().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Preparate aseptic (lista formelor farmaceutice)|" + (displayEnglish ? "Aseptically prepared (list of dosage forms)|" : ""));
            for (GMPMedDTO p : details.getPreparateAseptic()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getSterilizateFinal() != null && !details.getSterilizateFinal().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Sterilizate final (lista formelor farmaceutice)|" + (displayEnglish ? "Terminally sterilised (list of dosage forms)|" : ""));
            for (GMPMedDTO p : details.getSterilizateFinal()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getCertificareaSeriei() != null && !details.getCertificareaSeriei().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei|" + (displayEnglish ? "Batch certification only|" : ""));
            for (GMPMedDTO p : details.getCertificareaSeriei()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpProduseSterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseSterileJRBean = new JRBeanCollectionDataSource(gmpProduseSterile);
        report2Params.put("gmpDataset1", gmpProduseSterileJRBean);
    }

    private void fillCommonProduseSterile(GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseSterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Produse sterile" + (displayEnglish ? "|Sterile Products" : ""));
        dataSet.setValue("\t");
        if ((details.getPreparateAseptic() != null && !details.getPreparateAseptic().isEmpty())
                || (details.getPreparateAsepticMedicamenteClinice() != null && !details.getPreparateAsepticMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Preparate aseptic (lista formelor farmaceutice)|" + (displayEnglish ? "Aseptically prepared (list of dosage forms)|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getPreparateAseptic() != null) {
                for (GMPMedDTO p : details.getPreparateAseptic()) {
                    meds.add(p);
                }
            }
            if (details.getPreparateAsepticMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getPreparateAsepticMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO med : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + med.getValue() + "|" + (displayEnglish && med.getValueEn() != null ? "\t" + med.getValueEn() + "|" : ""));
            }
        }
        if ((details.getSterilizateFinal() != null && !details.getSterilizateFinal().isEmpty())
                || (details.getSterilizateFinalMedicamenteClinice() != null && !details.getSterilizateFinalMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Sterilizate final (lista formelor farmaceutice)|" + (displayEnglish ? "Terminally sterilised (list of dosage forms)|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getSterilizateFinal() != null) {
                for (GMPMedDTO p : details.getSterilizateFinal()) {
                    meds.add(p);
                }
            }
            if (details.getSterilizateFinalMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getSterilizateFinalMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO med : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + med.getValue() + "|" + (displayEnglish && med.getValueEn() != null ? "\t" + med.getValueEn() + "|" : ""));
            }
        }
        if ((details.getCertificareaSeriei() != null && !details.getCertificareaSeriei().isEmpty())
                || (details.getCertificareaSerieiMedicamenteClinice() != null && !details.getCertificareaSerieiMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei|" + (displayEnglish ? "Batch certification only|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getCertificareaSeriei() != null) {
                for (GMPMedDTO p : details.getCertificareaSeriei()) {
                    meds.add(p);
                }
            }
            if (details.getCertificareaSerieiMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getCertificareaSerieiMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO med : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + med.getValue() + "|" + (displayEnglish && med.getValueEn() != null ? "\t" + med.getValueEn() + "|" : ""));
            }
        }
        gmpProduseSterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseSterileJRBean = new JRBeanCollectionDataSource(gmpProduseSterile);
        report2Params.put("gmpDataset1", gmpProduseSterileJRBean);
    }

    private void fillProduseSterileClinicalInvestigationMedicines(GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseSterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Produse sterile" + (displayEnglish ? "|Sterile Products" : ""));
        dataSet.setValue("\t");
        if (details.getPreparateAsepticMedicamenteClinice() != null && !details.getPreparateAsepticMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Preparate aseptic (lista formelor farmaceutice)|" + (displayEnglish ? "Aseptically prepared (list of dosage forms)|" : ""));
            for (GMPMedDTO p : details.getPreparateAsepticMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getSterilizateFinalMedicamenteClinice() != null && !details.getSterilizateFinalMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Sterilizate final (lista formelor farmaceutice)|" + (displayEnglish ? "Terminally sterilised (list of dosage forms)|" : ""));
            for (GMPMedDTO p : details.getSterilizateFinalMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getCertificareaSerieiMedicamenteClinice() != null && !details.getCertificareaSerieiMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei|" + (displayEnglish ? "Batch certification only|" : ""));
            for (GMPMedDTO p : details.getCertificareaSerieiMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpProduseSterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseSterileJRBean = new JRBeanCollectionDataSource(gmpProduseSterile);
        report2Params.put("gmpDataset1", gmpProduseSterileJRBean);
    }

    private void fillProduseNesterile(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseNesterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Produse nesterile" + (displayEnglish ? "|Non-sterile products" : ""));
        dataSet.setValue("\t");
        if (details.getProduseNesterile() != null && !details.getProduseNesterile().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Produse nesterile (lista formelor farmaceutice)|" + (displayEnglish ? "Non-sterile products (list of dosage forms)|" : ""));
            for (GMPMedDTO p : details.getProduseNesterile()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getProduseNesterileNumaiCertificareaSeriei() != null && !details.getProduseNesterileNumaiCertificareaSeriei().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei|" + (displayEnglish ? "Batch certification only|" : ""));
            for (GMPMedDTO p : details.getProduseNesterileNumaiCertificareaSeriei()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpProduseNesterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseNesterileJRBean = new JRBeanCollectionDataSource(gmpProduseNesterile);
        report2Params.put("gmpDataset2", gmpProduseNesterileJRBean);
    }

    private void fillCommonProduseNesterile(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseNesterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Produse nesterile" + (displayEnglish ? "|Non-sterile products" : ""));
        dataSet.setValue("\t");
        if ((details.getProduseNesterile() != null && !details.getProduseNesterile().isEmpty())
                || (details.getProduseNesterileMedicamenteClinice() != null && !details.getProduseNesterileMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Produse nesterile (lista formelor farmaceutice)|" + (displayEnglish ? "Non-sterile products (list of dosage forms)|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getProduseNesterile() != null) {
                for (GMPMedDTO p : details.getProduseNesterile()) {
                    meds.add(p);
                }
            }
            if (details.getProduseNesterileMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getProduseNesterileMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if ((details.getProduseNesterileNumaiCertificareaSeriei() != null && !details.getProduseNesterileNumaiCertificareaSeriei().isEmpty())
                || (details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice() != null && !details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei|" + (displayEnglish ? "Batch certification only|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getProduseNesterileNumaiCertificareaSeriei() != null) {
                for (GMPMedDTO p : details.getProduseNesterileNumaiCertificareaSeriei()) {
                    meds.add(p);
                }
            }
            if (details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpProduseNesterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseNesterileJRBean = new JRBeanCollectionDataSource(gmpProduseNesterile);
        report2Params.put("gmpDataset2", gmpProduseNesterileJRBean);
    }

    private void fillProduseNesterileClinicalInvestigationMedicines(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpProduseNesterile = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Produse nesterile" + (displayEnglish ? "|Non-sterile products" : ""));
        dataSet.setValue("\t");
        if (details.getProduseNesterileMedicamenteClinice() != null && !details.getProduseNesterileMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Produse nesterile (lista formelor farmaceutice)|" + (displayEnglish ? "Non-sterile products (list of dosage forms)|" : ""));
            for (GMPMedDTO p : details.getProduseNesterileMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice() != null && !details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei|" + (displayEnglish ? "Batch certification only|" : ""));
            for (GMPMedDTO p : details.getProduseNesterileNumaiCertificareaSerieiMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpProduseNesterile.add(dataSet);
        JRBeanCollectionDataSource gmpProduseNesterileJRBean = new JRBeanCollectionDataSource(gmpProduseNesterile);
        report2Params.put("gmpDataset2", gmpProduseNesterileJRBean);
    }

    private void fillMedicamenteBiologice(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpMedicamenteBiologice = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Medicamente biologice" + (displayEnglish ? "|Biological medicinal products" : ""));
        dataSet.setValue("\t");
        if (details.getMedicamenteBiologice() != null && !details.getMedicamenteBiologice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Medicamente biologice|" + (displayEnglish ? "Biological medicinal products|" : ""));
            for (GMPMedDTO p : details.getMedicamenteBiologice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getMedicamenteBiologiceNumaiCertificareaSeriei() != null && !details.getMedicamenteBiologiceNumaiCertificareaSeriei().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei (lista tipurilor de produse)|" + (displayEnglish ? "Batch certification only (list of product " +
                    "types)|" : ""));
            for (GMPMedDTO p : details.getMedicamenteBiologiceNumaiCertificareaSeriei()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpMedicamenteBiologice.add(dataSet);
        JRBeanCollectionDataSource gmpMedicamenteBiologiceJRBean = new JRBeanCollectionDataSource(gmpMedicamenteBiologice);
        report2Params.put("gmpDataset3", gmpMedicamenteBiologiceJRBean);
    }

    private void fillCommonMedicamenteBiologice(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpMedicamenteBiologice = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Medicamente biologice" + (displayEnglish ? "|Biological medicinal products" : ""));
        dataSet.setValue("\t");
        if ((details.getMedicamenteBiologice() != null && !details.getMedicamenteBiologice().isEmpty())
                || (details.getMedicamenteBiologiceMedicamenteClinice() != null && !details.getMedicamenteBiologiceMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Medicamente biologice|" + (displayEnglish ? "Biological medicinal products|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getMedicamenteBiologice() != null) {
                for (GMPMedDTO p : details.getMedicamenteBiologice()) {
                    meds.add(p);
                }
            }
            if (details.getMedicamenteBiologiceMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getMedicamenteBiologiceMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if ((details.getMedicamenteBiologiceNumaiCertificareaSeriei() != null && !details.getMedicamenteBiologiceNumaiCertificareaSeriei().isEmpty())
                || (details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice() != null && !details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei (lista tipurilor de produse)|" + (displayEnglish ? "Batch certification only (list of product " +
                    "types)|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getMedicamenteBiologiceNumaiCertificareaSeriei() != null) {
                for (GMPMedDTO p : details.getMedicamenteBiologiceNumaiCertificareaSeriei()) {
                    meds.add(p);
                }
            }
            if (details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpMedicamenteBiologice.add(dataSet);
        JRBeanCollectionDataSource gmpMedicamenteBiologiceJRBean = new JRBeanCollectionDataSource(gmpMedicamenteBiologice);
        report2Params.put("gmpDataset3", gmpMedicamenteBiologiceJRBean);
    }

    private void fillMedicamenteBiologiceClinicalInvestigationMedicines(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpMedicamenteBiologice = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Medicamente biologice" + (displayEnglish ? "|Biological medicinal products" : ""));
        dataSet.setValue("\t");
        if (details.getMedicamenteBiologiceMedicamenteClinice() != null && !details.getMedicamenteBiologiceMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Medicamente biologice|" + (displayEnglish ? "Biological medicinal products|" : ""));
            for (GMPMedDTO p : details.getMedicamenteBiologiceMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice() != null && !details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Numai certificarea seriei (lista tipurilor de produse)|" + (displayEnglish ? "Batch certification only (list of product " +
                    "types)|" : ""));
            for (GMPMedDTO p : details.getMedicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpMedicamenteBiologice.add(dataSet);
        JRBeanCollectionDataSource gmpMedicamenteBiologiceJRBean = new JRBeanCollectionDataSource(gmpMedicamenteBiologice);
        report2Params.put("gmpDataset3", gmpMedicamenteBiologiceJRBean);
    }

    private void fillAmbalare(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpAmbalare = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Numai ambalare" + (displayEnglish ? "|Packaging only" : ""));
        dataSet.setValue("\t");
        if (details.getAmbalarePrimara() != null && !details.getAmbalarePrimara().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Ambalare primară|" + (displayEnglish ? "Primary packing|" : ""));
            for (GMPMedDTO p : details.getAmbalarePrimara()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getAmbalareSecundara() != null && !details.getAmbalareSecundara().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Ambalare secundară|" + (displayEnglish ? "Secondary packing|" : ""));
            for (GMPMedDTO p : details.getAmbalareSecundara()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpAmbalare.add(dataSet);
        JRBeanCollectionDataSource gmpAmbalareJRBean = new JRBeanCollectionDataSource(gmpAmbalare);
        report2Params.put("gmpDataset5", gmpAmbalareJRBean);
    }

    private void fillCommonAmbalare(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpAmbalare = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Numai ambalare" + (displayEnglish ? "|Packaging only" : ""));
        dataSet.setValue("\t");
        if ((details.getAmbalarePrimara() != null && !details.getAmbalarePrimara().isEmpty())
                || (details.getAmbalarePrimaraMedicamenteClinice() != null && !details.getAmbalarePrimaraMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Ambalare primară|" + (displayEnglish ? "Primary packing|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getAmbalarePrimara() != null) {
                for (GMPMedDTO p : details.getAmbalarePrimara()) {
                    meds.add(p);
                }
            }
            if (details.getAmbalarePrimaraMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getAmbalarePrimaraMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if ((details.getAmbalareSecundara() != null && !details.getAmbalareSecundara().isEmpty())
                || (details.getAmbalareSecundaraMedicamenteClinice() != null && !details.getAmbalareSecundaraMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Ambalare secundară|" + (displayEnglish ? "Secondary packing|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getAmbalareSecundara() != null) {
                for (GMPMedDTO p : details.getAmbalareSecundara()) {
                    meds.add(p);
                }
            }
            if (details.getAmbalareSecundaraMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getAmbalareSecundaraMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpAmbalare.add(dataSet);
        JRBeanCollectionDataSource gmpAmbalareJRBean = new JRBeanCollectionDataSource(gmpAmbalare);
        report2Params.put("gmpDataset5", gmpAmbalareJRBean);
    }

    private void fillAmbalareClinicalInvestigationMedicines(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpAmbalare = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Numai ambalare" + (displayEnglish ? "|Packaging only" : ""));
        dataSet.setValue("\t");
        if (details.getAmbalarePrimaraMedicamenteClinice() != null && !details.getAmbalarePrimaraMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Ambalare primară|" + (displayEnglish ? "Primary packing|" : ""));
            for (GMPMedDTO p : details.getAmbalarePrimaraMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getAmbalareSecundaraMedicamenteClinice() != null && !details.getAmbalareSecundaraMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Ambalare secundară|" + (displayEnglish ? "Secondary packing|" : ""));
            for (GMPMedDTO p : details.getAmbalareSecundaraMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpAmbalare.add(dataSet);
        JRBeanCollectionDataSource gmpAmbalareJRBean = new JRBeanCollectionDataSource(gmpAmbalare);
        report2Params.put("gmpDataset5", gmpAmbalareJRBean);
    }

    private void fillManufactures(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpManufactures = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Alte produse sau activităţi de fabricaţie" + (displayEnglish ? "|Other products or manufacturing activity" : ""));
        dataSet.setValue("\t");
        if (details.getManufactures() != null && !details.getManufactures().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Fabricaţie|" + (displayEnglish ? "Manufacture of|" : ""));
            for (GMPMedDTO p : details.getManufactures()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getSubstanceSterilization() != null && !details.getSubstanceSterilization().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Sterilizarea substanţelor active/excipienţilor/produselor finite|" + (displayEnglish ? "Sterilisation of active substances/excipients/finished product|" : ""));
            for (GMPMedDTO p : details.getSubstanceSterilization()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getOtherManufactures() != null && !details.getOtherManufactures().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Altele|" + (displayEnglish ? "Other|" : ""));
            for (GMPMedDTO p : details.getOtherManufactures()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpManufactures.add(dataSet);
        JRBeanCollectionDataSource gmpManufacturesJRBean = new JRBeanCollectionDataSource(gmpManufactures);
        report2Params.put("gmpDataset4", gmpManufacturesJRBean);
    }

    private void fillCommonManufactures(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpManufactures = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Alte produse sau activităţi de fabricaţie" + (displayEnglish ? "|Other products or manufacturing activity" : ""));
        dataSet.setValue("\t");
        if ((details.getManufactures() != null && !details.getManufactures().isEmpty())
                || (details.getManufacturesMedicamenteClinice() != null && !details.getManufacturesMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Fabricaţie|" + (displayEnglish ? "Manufacture of|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getManufactures() != null) {
                for (GMPMedDTO p : details.getManufactures()) {
                    meds.add(p);
                }
            }
            if (details.getManufacturesMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getManufacturesMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if ((details.getSubstanceSterilization() != null && !details.getSubstanceSterilization().isEmpty())
                || (details.getSubstanceSterilizationMedicamenteClinice() != null && !details.getSubstanceSterilizationMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Sterilizarea substanţelor active/excipienţilor/produselor finite|" + (displayEnglish ? "Sterilisation of active substances/excipients/finished product|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getSubstanceSterilization() != null) {
                for (GMPMedDTO p : details.getSubstanceSterilization()) {
                    meds.add(p);
                }
            }
            if (details.getSubstanceSterilizationMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getSubstanceSterilizationMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if ((details.getOtherManufactures() != null && !details.getOtherManufactures().isEmpty())
                || (details.getOtherManufacturesMedicamenteClinice() != null && !details.getOtherManufacturesMedicamenteClinice().isEmpty())) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Altele|" + (displayEnglish ? "Other|" : ""));
            Set<GMPMedDTO> meds = new HashSet<>();
            if (details.getOtherManufactures() != null) {
                for (GMPMedDTO p : details.getOtherManufactures()) {
                    meds.add(p);
                }
            }
            if (details.getOtherManufacturesMedicamenteClinice() != null) {
                for (GMPMedDTO p : details.getOtherManufacturesMedicamenteClinice()) {
                    meds.add(p);
                }
            }
            for (GMPMedDTO p : meds) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpManufactures.add(dataSet);
        JRBeanCollectionDataSource gmpManufacturesJRBean = new JRBeanCollectionDataSource(gmpManufactures);
        report2Params.put("gmpDataset4", gmpManufacturesJRBean);
    }

    private void fillManufacturesClinicalInvestigationMedicines(@RequestBody GMPDetailsDTO details, Map<String, Object> report2Params, int i, boolean displayEnglish) {
        int j = 0;
        List<GMPDataSetDTO> gmpManufactures = new ArrayList<>();
        GMPDataSetDTO dataSet = new GMPDataSetDTO();
        dataSet.setNr(String.valueOf(i));
        dataSet.setTitle("Alte produse sau activităţi de fabricaţie" + (displayEnglish ? "|Other products or manufacturing activity" : ""));
        dataSet.setValue("\t");
        if (details.getManufacturesMedicamenteClinice() != null && !details.getManufacturesMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Fabricaţie|" + (displayEnglish ? "Manufacture of|" : ""));
            for (GMPMedDTO p : details.getManufacturesMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getSubstanceSterilizationMedicamenteClinice() != null && !details.getSubstanceSterilizationMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Sterilizarea substanţelor active/excipienţilor/produselor finite|" + (displayEnglish ? "Sterilisation of active substances/excipients/finished product|" : ""));
            for (GMPMedDTO p : details.getSubstanceSterilizationMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        if (details.getOtherManufacturesMedicamenteClinice() != null && !details.getOtherManufacturesMedicamenteClinice().isEmpty()) {
            char ch = (char) 97;
            dataSet.setValue(dataSet.getValue() + (++j) + ") Altele|" + (displayEnglish ? "Other|" : ""));
            for (GMPMedDTO p : details.getOtherManufacturesMedicamenteClinice()) {
                dataSet.setValue(dataSet.getValue() + " \t" + (ch++) + ") " + p.getValue() + "|" + (displayEnglish && p.getValueEn() != null ? "\t" + p.getValueEn() + "|" : ""));
            }
        }
        gmpManufactures.add(dataSet);
        JRBeanCollectionDataSource gmpManufacturesJRBean = new JRBeanCollectionDataSource(gmpManufactures);
        report2Params.put("gmpDataset4", gmpManufacturesJRBean);
    }

    @RequestMapping(value = "/view-medicament-modification-certificate", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewMedicamentModificationCertificate(@RequestBody AuthorizationCertificateDTO certificateDTO) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Modificare la certificat.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("La Nr.", certificateDTO.getRequestNumber());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("regDate", sdf.format(certificateDTO.getRegistrationDate()));
            parameters.put("reqDate", sdf.format(certificateDTO.getRequestDate()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            RegistrationRequestsEntity registrationRequestsEntity = regRequestRepository.findById(certificateDTO.getRequestId()).orElse(new RegistrationRequestsEntity());
            List<MedicamentEntity> medicamentEntities = medicamentRepository.findByRegistrationNumber(registrationRequestsEntity.getMedicamentPostauthorizationRegisterNr());
            MedicamentEntity med = medicamentEntities.stream().filter(t -> t.getStatus().equals("F")).findAny().orElse(new MedicamentEntity());
            RegistrationRequestsEntity certificatOldRequest = regRequestRepository.findById(med.getRequestId()).orElse(new RegistrationRequestsEntity());
            DocumentsEntity certificatOldDoc =
                    certificatOldRequest.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("CA")).collect(Collectors.toList()).stream().findAny().orElse(new DocumentsEntity());
            parameters.put("regRequest", certificatOldDoc.getNumber());
            parameters.put("medicamentName", certificateDTO.getMedName());
            parameters.put("variationTip", certificateDTO.getVariationTip());
            parameters.put("amedOrderNr", certificateDTO.getOrderNumber());

            MedicamentHistoryEntity medicamentHistoryEntity = registrationRequestsEntity.getMedicamentHistory().stream().findFirst().orElse(new MedicamentHistoryEntity());
            List<ModificareCertificatFieldsDTO> modificari = new ArrayList<>();
            if (medicamentHistoryEntity.getInternationalMedicamentNameFrom().getId() != medicamentHistoryEntity.getInternationalMedicamentNameTo().getId()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getInternationalMedicamentNameFrom().getDescription(),
                        medicamentHistoryEntity.getInternationalMedicamentNameTo().getDescription(), modificari);
            }
            if (!medicamentHistoryEntity.getDoseFrom().equals(medicamentHistoryEntity.getDoseTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getDoseFrom(),
                        medicamentHistoryEntity.getDoseTo(), modificari);
            }
            if (medicamentHistoryEntity.getPharmaceuticalFormFrom().getId() != medicamentHistoryEntity.getPharmaceuticalFormTo().getId()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getPharmaceuticalFormFrom().getDescription(),
                        medicamentHistoryEntity.getPharmaceuticalFormTo().getDescription(), modificari);
            }
            if (medicamentHistoryEntity.getAuthorizationHolderFrom().getId() != medicamentHistoryEntity.getAuthorizationHolderTo().getId()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getAuthorizationHolderFrom().getDescription(),
                        medicamentHistoryEntity.getAuthorizationHolderTo().getDescription(), modificari);
            }
            if (medicamentHistoryEntity.getPrescriptionFrom() != medicamentHistoryEntity.getPrescriptionTo()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getPrescriptionFrom() == 1 ? "Cu prescripţie" : "Fără prescripţie",
                        medicamentHistoryEntity.getPrescriptionTo() == 1 ? "Cu prescripţie" : "Fără prescripţie", modificari);
            }
            if (!medicamentHistoryEntity.getTermsOfValidityFrom().equals(medicamentHistoryEntity.getTermsOfValidityTo())) {
                fillModificareCertificateDTO(String.valueOf(medicamentHistoryEntity.getTermsOfValidityFrom()),
                        String.valueOf(medicamentHistoryEntity.getTermsOfValidityTo()), modificari);
            }
            if (!medicamentHistoryEntity.getAtcCodeFrom().equals(medicamentHistoryEntity.getAtcCodeTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getAtcCodeFrom(),
                        medicamentHistoryEntity.getAtcCodeTo(), modificari);
            }
            if (!medicamentHistoryEntity.getCommercialNameFrom().equals(medicamentHistoryEntity.getCommercialNameTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getCommercialNameFrom(),
                        medicamentHistoryEntity.getCommercialNameTo(), modificari);
            }
            if (!medicamentHistoryEntity.getOriginaleFrom().equals(medicamentHistoryEntity.getOriginaleTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getOriginaleFrom() ? "Original" : "Generic",
                        medicamentHistoryEntity.getOriginaleTo() ? "Original" : "Generic", modificari);
            }
            if (!medicamentHistoryEntity.getVitaleFrom().equals(medicamentHistoryEntity.getVitaleTo()) ||
                    !medicamentHistoryEntity.getEsentialeFrom().equals(medicamentHistoryEntity.getEsentialeTo()) ||
                    !medicamentHistoryEntity.getNonesentialeFrom().equals(medicamentHistoryEntity.getNonesentialeTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getVitaleFrom() ? "Vitale" : (medicamentHistoryEntity.getEsentialeFrom() ? "Esenţiale" :
                                (medicamentHistoryEntity.getNonesentialeFrom() ? "Nonesenţiale" : "")),
                        medicamentHistoryEntity.getVitaleTo() ? "Vitale" : (medicamentHistoryEntity.getEsentialeTo() ? "Esenţiale" :
                                (medicamentHistoryEntity.getNonesentialeTo() ? "Nonesenţiale" : "")), modificari);
            }

            JRBeanCollectionDataSource mJRBean = new JRBeanCollectionDataSource(modificari);
            parameters.put("modificationTableDataset", mJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=certificate.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-scrisoare-de-aprobare", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewScrisoareDeAprobare(@RequestBody AuthorizationCertificateDTO certificateDTO) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Scrisoare de aprobare.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("La Nr.", certificateDTO.getSrisoareDeAprobareNumber());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("Din: ", sdf.format(Calendar.getInstance().getTime()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            RegistrationRequestsEntity registrationRequestsEntity = regRequestRepository.findById(certificateDTO.getRequestId()).orElse(new RegistrationRequestsEntity());
            List<MedicamentEntity> medicamentEntities = medicamentRepository.findByRegistrationNumber(registrationRequestsEntity.getMedicamentPostauthorizationRegisterNr());
            MedicamentEntity med = medicamentEntities.stream().filter(t -> t.getStatus().equals("F")).findAny().orElse(new MedicamentEntity());
            RegistrationRequestsEntity certificatOldRequest = regRequestRepository.findById(med.getRequestId()).orElse(new RegistrationRequestsEntity());
            DocumentsEntity certificatOldDoc =
                    certificatOldRequest.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("CA")).collect(Collectors.toList()).stream().findAny().orElse(new DocumentsEntity());
            parameters.put("regRequest", certificatOldDoc.getNumber());
            parameters.put("orderRequest", certificateDTO.getOrderNumber());
            parameters.put("medicamentName", certificateDTO.getMedName());

            MedicamentHistoryEntity medicamentHistoryEntity = registrationRequestsEntity.getMedicamentHistory().stream().findFirst().orElse(new MedicamentHistoryEntity());
            List<ModificareCertificatFieldsDTO> modificari = new ArrayList<>();
            if (medicamentHistoryEntity.getInternationalMedicamentNameFrom().getId() != medicamentHistoryEntity.getInternationalMedicamentNameTo().getId()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getInternationalMedicamentNameFrom().getDescription(),
                        medicamentHistoryEntity.getInternationalMedicamentNameTo().getDescription(), modificari);
            }
            if (!medicamentHistoryEntity.getDoseFrom().equals(medicamentHistoryEntity.getDoseTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getDoseFrom(),
                        medicamentHistoryEntity.getDoseTo(), modificari);
            }
            if (medicamentHistoryEntity.getPharmaceuticalFormFrom().getId() != medicamentHistoryEntity.getPharmaceuticalFormTo().getId()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getPharmaceuticalFormFrom().getDescription(),
                        medicamentHistoryEntity.getPharmaceuticalFormTo().getDescription(), modificari);
            }
            if (medicamentHistoryEntity.getAuthorizationHolderFrom().getId() != medicamentHistoryEntity.getAuthorizationHolderTo().getId()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getAuthorizationHolderFrom().getDescription(),
                        medicamentHistoryEntity.getAuthorizationHolderTo().getDescription(), modificari);
            }
            if (medicamentHistoryEntity.getPrescriptionFrom() != medicamentHistoryEntity.getPrescriptionTo()) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getPrescriptionFrom() == 1 ? "Cu prescripţie" : "Fără prescripţie",
                        medicamentHistoryEntity.getPrescriptionTo() == 1 ? "Cu prescripţie" : "Fără prescripţie", modificari);
            }
            if (!medicamentHistoryEntity.getTermsOfValidityFrom().equals(medicamentHistoryEntity.getTermsOfValidityTo())) {
                fillModificareCertificateDTO(String.valueOf(medicamentHistoryEntity.getTermsOfValidityFrom()),
                        String.valueOf(medicamentHistoryEntity.getTermsOfValidityTo()), modificari);
            }
            if (!medicamentHistoryEntity.getAtcCodeFrom().equals(medicamentHistoryEntity.getAtcCodeTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getAtcCodeFrom(),
                        medicamentHistoryEntity.getAtcCodeTo(), modificari);
            }
            if (!medicamentHistoryEntity.getCommercialNameFrom().equals(medicamentHistoryEntity.getCommercialNameTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getCommercialNameFrom(),
                        medicamentHistoryEntity.getCommercialNameTo(), modificari);
            }
            if (!medicamentHistoryEntity.getOriginaleFrom().equals(medicamentHistoryEntity.getOriginaleTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getOriginaleFrom() ? "Original" : "Generic",
                        medicamentHistoryEntity.getOriginaleTo() ? "Original" : "Generic", modificari);
            }
            if (!medicamentHistoryEntity.getVitaleFrom().equals(medicamentHistoryEntity.getVitaleTo()) ||
                    !medicamentHistoryEntity.getEsentialeFrom().equals(medicamentHistoryEntity.getEsentialeTo()) ||
                    !medicamentHistoryEntity.getNonesentialeFrom().equals(medicamentHistoryEntity.getNonesentialeTo())) {
                fillModificareCertificateDTO(medicamentHistoryEntity.getVitaleFrom() ? "Vitale" : (medicamentHistoryEntity.getEsentialeFrom() ? "Esenţiale" :
                                (medicamentHistoryEntity.getNonesentialeFrom() ? "Nonesenţiale" : "")),
                        medicamentHistoryEntity.getVitaleTo() ? "Vitale" : (medicamentHistoryEntity.getEsentialeTo() ? "Esenţiale" :
                                (medicamentHistoryEntity.getNonesentialeTo() ? "Nonesenţiale" : "")), modificari);
            }

            JRBeanCollectionDataSource mJRBean = new JRBeanCollectionDataSource(modificari);
            parameters.put("modificationTableDataset", mJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=certificate.pdf").body(bytes);
    }


    @RequestMapping(value = "/view-request-additional-data", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewRAD(@RequestParam(value = "nrDocument") String nrDocument,
                                          @RequestParam(value = "content") String content,
                                          @RequestParam(value = "title") String title,
                                          @RequestParam(value = "type") String type
    ) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            String classPath = "";
            switch (type) {
                case "NL":
                    classPath = "layouts\\notificationLetter.jrxml";
                    break;
                case "SL":
                    classPath = "layouts\\requestAdditionalData.jrxml";
                    break;
                case "LA":
                    classPath = "layouts\\laboratoryAnalysis.jrxml";
                    break;
            }

            Resource res = resourceLoader.getResource(classPath);
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<RequestAdditionalDataDTO> dataList = fillRequestAdditionalDataDTO(nrDocument, content, title);

            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=request.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-medicament-authorization-order", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewMedicamentAuthorizationOrder(@RequestParam(value = "nrDocument") String nrDocument) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();

            Resource res = resourceLoader.getResource("layouts\\medicamentAuthorizationOrder.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            //            List<DistributionDispositionDTO> dataList = new ArrayList();
            //            DistributionDispositionDTO obj = new DistributionDispositionDTO();
            //            obj.setDispositionDate(Calendar.getInstance().getTime());
            //            obj.setNrDisposition(nrDocument);
            //            obj.setPath(res.getFile().getAbsolutePath());
            //            dataList.add(obj);
            //
            //            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);

            //            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, null);
            //            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=request.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-request-additional-data-new", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewRequestAdditionalData(@RequestBody RequestAdditionalDataDTO requestData) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Notificare.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("vicDir", requestData.getSignerName());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("date", sdf.format(requestData.getRequestDate()));
            parameters.put("nr", requestData.getNrDoc());
            parameters.put("name", requestData.getResponsiblePerson());
            parameters.put("representant", requestData.getCompanyName());
            parameters.put("country", requestData.getCountry());
            parameters.put("address", requestData.getAddress());
            parameters.put("phone", requestData.getPhoneNumber());
            parameters.put("email", requestData.getEmail());
            parameters.put("NotificationText", requestData.getMessage());
            parameters.put("function", requestData.getFunction());
            ScrUserEntity userEntity = srcUserRepository.findOneWithAuthoritiesByUsername(SecurityUtils.getCurrentUser().orElse("")).orElse(new ScrUserEntity());
            parameters.put("executor", userEntity.getFullname());
            parameters.put("executorPhone", userEntity.getPhoneNumber());

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=solicitareDateAditionale.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-interrupt-order-of-medicament-registration", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewInterruptOrderMR(@RequestParam(value = "nrDocument") String nrDocument) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts\\interruptOrderOfMedicamentRegistration.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<RequestAdditionalDataDTO> dataList = new ArrayList();
            RequestAdditionalDataDTO obj = new RequestAdditionalDataDTO();
            obj.setRequestDate(Calendar.getInstance().getTime());
            obj.setNrRequest(nrDocument);
            dataList.add(obj);

            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=interruptOrder.pdf").body(bytes);
    }

    private List<RequestAdditionalDataDTO> fillRequestAdditionalDataDTO(@RequestParam("nrDocument") String nrDocument, @RequestParam("content") String content, @RequestParam("title") String title) {
        List<RequestAdditionalDataDTO> dataList = new ArrayList();
        RequestAdditionalDataDTO obj = new RequestAdditionalDataDTO();
        obj.setRequestDate(Calendar.getInstance().getTime());
        obj.setContent(content);
        obj.setNrRequest(nrDocument);
        obj.setTitle(title);
        dataList.add(obj);
        return dataList;
    }

    @RequestMapping(value = "/view-document", method = RequestMethod.GET)
    public ResponseEntity<InputStreamResource> generateBon(@RequestParam(value = "relativePath") String relativePath, HttpServletRequest request) throws FileNotFoundException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + relativePath.substring(relativePath.lastIndexOf("/") + 1));

        File file = storageService.loadFile(relativePath);

        InputStreamResource isr = new InputStreamResource(new FileInputStream(file));

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(file.getAbsolutePath());
        } catch (Exception ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(contentType)).body(isr);
    }

    @GetMapping(value = "/get-document-types")
    public ResponseEntity<List<NmDocumentTypesEntity>> getDocumentTypes() {
        return new ResponseEntity<>(documentTypeRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/view-bon-de-plata-nimicire", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlataNimicire(@RequestBody RegistrationRequestsEntity request) throws CustomException {
        logger.debug("Generare bon pentru nimicire" + request.getId());
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module8/BonPlataNimicireMedicamente.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(request.getId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            for (PaymentOrdersEntity order : details) {
                order.setDate(now);
                order.setNumber(String.valueOf(seq.getId()));
                paymentOrderRepository.save(order);
            }

            List<BonPlataAnihilare1> bonNimicire = new ArrayList<>();

            double quantitySum = 0.0;
            double totalSum = 0.0;

            for (MedicamentAnnihilationMedsEntity mm : request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds()) {
                BonPlataAnihilare1 b = new BonPlataAnihilare1();
                double tax = mm.getTax() != null ? mm.getTax() : 0.0;
                double round = AmountUtils.round(mm.getQuantity() * tax, 2);
                b.setAmount(round);
                b.setFutilityCause(mm.getUselessReason());
                b.setNameDoseDivision(mm.getMedicamentName());
                b.setPrice(tax);
                b.setSeries(mm.getSeria());
                b.setQuantity(mm.getQuantity());

                quantitySum += mm.getQuantity();
                totalSum += round;

                bonNimicire.add(b);
            }

            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsBonAnihilareMedicamenteJRBean = new JRBeanCollectionDataSource(bonNimicire);

            double totalAbsolut = totalSum;

            List<BonPlataAnihilare2> bon2List = new ArrayList<>();

            for (PaymentOrdersEntity order : details) {
                if (!("BN").equals(order.getServiceCharge().getCategory())) {
                    BonPlataAnihilare2 bon = new BonPlataAnihilare2();
                    bon.setType(order.getServiceCharge().getDescription());
                    bon.setTypeAmount(order.getServiceCharge().getAmount());

                    totalAbsolut += order.getServiceCharge().getAmount();
                    bon2List.add(bon);
                }
            }


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsBonAnihilare2MedicamenteJRBean = new JRBeanCollectionDataSource(bon2List);


            NmEconomicAgentsEntity ecAgent = economicAgentsRepository.findFirstByIdnoEquals(request.getMedicamentAnnihilation().getIdno()).get();

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("invoice_date", new SimpleDateFormat(Constants.Layouts.POINT_DATE_FORMAT).format(new Date()));
            parameters.put("nr_invoice", seq.getId().toString());
            parameters.put("payer", ecAgent.getLongName());
            parameters.put("payer_address", ecAgent.getLegalAddress());
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("accountant", sysParamsRepository.findByCode(Constants.SysParams.ACCOUNTANT).get().getValue());

            parameters.put("bonDePlataAnihilareMedicamenteDataset", itemsBonAnihilareMedicamenteJRBean);
            parameters.put("bonDePlataAnihilareMedicamenteDataset2", itemsBonAnihilare2MedicamenteJRBean);
            parameters.put("totalQuantity", quantitySum);
            parameters.put("totalAmount", totalSum);
            parameters.put("totalPrice", totalAbsolut);
            parameters.put("totalPriceLetters", NumberToWordsConverter.convert(totalAbsolut));

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            saveBonDePlata(seq, jasperPrint);
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlataNimicire.pdf").body(bytes);

    }


    @RequestMapping(value = "/view-bon-de-plata-comun", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlataComun(@RequestBody BonDePlataDTO bonDePlata) throws CustomException {
        logger.debug("Generare bon comun" + bonDePlata.getRequestId());
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/BonPlataComun.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(bonDePlata.getRequestId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            for (PaymentOrdersEntity order : details) {
                if (bonDePlata.getPaymentOrders().stream().anyMatch(t -> t.getId().equals(order.getId()))) {
                    order.setDate(now);
                    order.setNumber(String.valueOf(seq.getId()));
                    paymentOrderRepository.save(order);
                }
            }

            List<BonDePlataComunDTO> bonList = new ArrayList<>();

            for (PaymentOrdersEntity order : details) {
                if (bonDePlata.getPaymentOrders().stream().anyMatch(t -> t.getId().equals(order.getId()))) {
                    BonDePlataComunDTO bon = new BonDePlataComunDTO();
                    bon.setScope(order.getServiceCharge().getDescription());
                    bon.setAmount(order.getAmount());
                    bon.setPrice(order.getServiceCharge().getAmount());
                    bon.setQuantity(order.getAmount());

                    bonList.add(bon);
                }
            }


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsBonJRBean = new JRBeanCollectionDataSource(bonList);

            RegistrationRequestsEntity req = regRequestRepository.findById(bonDePlata.getRequestId()).get();

            NmEconomicAgentsEntity ecAgent = null;
            if (req.getLicense() != null) {
                ecAgent = economicAgentsRepository.findFirstByIdnoEquals(req.getLicense().getIdno()).get();
            } else if (req.getCompany() != null) {
                ecAgent = economicAgentsRepository.findFirstByIdnoEquals(req.getCompany().getIdno()).get();
            }

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("requestNr", req.getRequestNumber());
            parameters.put("invoice_date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date()));
            parameters.put("nr_invoice", seq.getId().toString());
            parameters.put("payer", ecAgent.getLongName());

            if (ecAgent.getLongName() != null) {
                parameters.put("payer", ecAgent.getLongName());
            } else {
                parameters.put("payer", ecAgent.getName());
            }

            parameters.put("payer_address", ecAgent.getLegalAddress());
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("accountant", sysParamsRepository.findByCode(Constants.SysParams.ACCOUNTANT).get().getValue());

            parameters.put("bonDePlataAnihilareMedicamenteDataset", itemsBonJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            saveBonDePlata(seq, jasperPrint);

        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlataComun.pdf").body(bytes);

    }

    @Transactional
    @RequestMapping(value = "/save-docs", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> saveDocuments(@RequestBody List<DocumentsEntity> documents) {
        try {
            documentsRepository.saveAll(documents);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.CREATED);
        }
    }


    @RequestMapping(value = "/view-table-pdf", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewTablePdf(@RequestBody TableData tableData) throws CustomException {
        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        byte[] bytes = null;
        try {
            PdfPTable table = new PdfPTable(tableData.getColumns().size());
            table.setWidthPercentage(90);

            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

            for (String cols : tableData.getColumns()) {
                PdfPCell hcell;
                hcell = new PdfPCell(new Phrase(cols, headFont));
                hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
                hcell.setBackgroundColor(new BaseColor(0xF0, 0xF8, 0xFF));
                table.addCell(hcell);
            }

            for (Object o : tableData.getData()) {
                Map<String, Object> map = (Map<String, Object>) o;

                for (Object o1 : map.values()) {
                    PdfPCell cell;

                    cell = new PdfPCell(new Phrase(String.valueOf(o1)));
                    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(cell);
                }
            }

            PdfWriter.getInstance(document, out);

            document.open();
            document.add(table);

            document.close();

            bytes = out.toByteArray();

        } catch (DocumentException e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=tableData.pdf").body(bytes);

    }

    @RequestMapping(value = "/generate-dd-ct", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateDDCt(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Dispozitia SC cm.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            RegistrationRequestsEntity firstRequest = requests.stream().findFirst().orElse(new RegistrationRequestsEntity());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", firstRequest.getDdNumber());
            parameters.put("date", sdf.format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<ClinicalTrialExpertDTO> ctExpDTO = requests.stream().map(reg -> {
                ClinicalTrialExpertDTO dto = new ClinicalTrialExpertDTO();
                dto.setTitleClinicalStudyPhases(reg.getClinicalTrails().getTitle());
                if (reg.getCompany() == null) {
                    RegistrationRequestMandatedContactEntity contact = reg.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());
                    dto.setApplicant(contact.getMandatedFirstname().concat(" ").concat(contact.getMandatedLastname()));
                } else {
                    dto.setApplicant(reg.getCompany().getName());

                }
                dto.setInvestigatedProduct(String.join("\n", reg.getClinicalTrails().getMedicaments().stream().map(med -> med.getName()).collect(Collectors.toList())));
                dto.setExpertName(String.join("|", reg.getExpertList().stream().map(exp -> exp.getExpert().getName()).collect(Collectors.toList())));

                StringBuilder builder = new StringBuilder();
                reg.getClinicalTrails().getMedicalInstitutions().forEach(inst -> {
                            builder.append(inst.getNmMedicalInstitution().getName());
                            builder.append("`");
                            inst.getSubdivisionsList().forEach(subdiv -> {
                                builder.append(subdiv.getNmSubdivision().getName());
                                CtInvestigatorEntity mainInvestigator = subdiv.getInvestigatorsList().stream().filter(investig -> investig.getIsMain()).findAny().get();
                                String investigatorName = mainInvestigator.getNmInvestigator().getFirstName().concat(" ").concat(mainInvestigator.getNmInvestigator().getLastName());
                                builder.append("^");
                                builder.append(investigatorName);
                                builder.append("|");
                            });
                            builder.deleteCharAt(builder.length() - 1);
                            builder.append("\\\\");
                        }
                );
                builder.delete(builder.length() - 3, builder.length() - 1);
                String isntitution = builder.toString();

                dto.setInstitution(isntitution);
                return dto;
            }).collect(Collectors.toList());

            JRBeanCollectionDataSource ddListJRBean = new JRBeanCollectionDataSource(ctExpDTO);
            parameters.put("dispositionScDataSource", ddListJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint, "dispozitii_de_distribuire/Dispozitie de distribuire studiu clinic Nr " + firstRequest.getDdNumber() + ".pdf");
            //update requests
            regRequestRepository.setDDCtNumber(requests.stream().map(requestsEntity -> requestsEntity.getId()).collect(Collectors.toList()), firstRequest.getDdNumber());

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("DDC").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(firstRequest.getDdNumber());
            outputDocumentsEntity.setName("Dispozitie de distribuire studiu clinic Nr " + firstRequest.getDdNumber() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (IOException |
                JRException e)

        {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().

                header("Content-Type", "application/pdf")
                .

                        header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").

                        body(bytes);
    }

    @RequestMapping(value = "/generate-dd-amd-ct", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateDDACt(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {
        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Dispozitia amendamente.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            RegistrationRequestsEntity firstRequest = requests.stream().findFirst().orElse(new RegistrationRequestsEntity());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", firstRequest.getDdNumber());
            parameters.put("date", sdf.format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<ClinicalTrialExpertDTO> ctExpDTO = requests.stream().map(reg -> {
                ClinicalTrialExpertDTO dto = new ClinicalTrialExpertDTO();
                if (reg.getCompany() == null) {
                    RegistrationRequestMandatedContactEntity contact = reg.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());
                    dto.setApplicant(contact.getMandatedFirstname().concat(" ").concat(contact.getMandatedLastname()));
                } else {
                    dto.setApplicant(reg.getCompany().getName());

                }
                dto.setExpertName(String.join("|", reg.getExpertList().stream().map(exp -> exp.getExpert().getName()).collect(Collectors.toList())));
                dto.setTitleClinicalStudyCode(reg.getClinicalTrails().getTitle().concat(" ").concat(reg.getClinicalTrails().getCode()));

                ClinicTrialAmendEntity amendEntity = reg.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(amend -> amend.getRegistrationRequestId().equals(reg.getId())).findFirst().orElse(new ClinicTrialAmendEntity());
                dto.setInvestigatedProduct(String.join("\n", amendEntity.getMedicaments().stream().map(med -> med.getName()).collect(Collectors.toList())));

                StringBuilder builder = new StringBuilder();
                amendEntity.getMedicalInstitutions().forEach(inst -> {
                            builder.append(inst.getNmMedicalInstitution().getName());
                            builder.append("`");
                            inst.getSubdivisionsList().forEach(subdiv -> {
                                builder.append(subdiv.getNmSubdivision().getName());
                                CtAmendInvestigatorEntity mainInvestigator = subdiv.getInvestigatorsList().stream().filter(investig -> investig.getIsMain()).findAny().get();
                                String investigatorName = mainInvestigator.getNmInvestigator().getFirstName().concat(" ").concat(mainInvestigator.getNmInvestigator().getLastName());
                                builder.append("^");
                                builder.append(investigatorName);
                                builder.append("|");
                            });
                            builder.deleteCharAt(builder.length() - 1);
                            builder.append("\\\\");
                        }
                );
                builder.delete(builder.length() - 3, builder.length() - 1);
                String isntitution = builder.toString();

                dto.setInstitution(isntitution);
                return dto;
            }).collect(Collectors.toList());
            JRBeanCollectionDataSource ddListJRBean = new JRBeanCollectionDataSource(ctExpDTO);
            parameters.put("dispositionAmendamentDataSource", ddListJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint, "dispozitii_de_distribuire/Dispozitie de distribuire amendament la studiu clinic Nr " + firstRequest.getDdNumber() + ".pdf");
            //update requests
            regRequestRepository.setDDCtNumber(requests.stream().map(requestsEntity -> requestsEntity.getId()).collect(Collectors.toList()), firstRequest.getDdNumber());

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("DDA").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(firstRequest.getDdNumber());
            outputDocumentsEntity.setName("Dispozitie de distribuire amendament la studiu clinic Nr " + firstRequest.getDdNumber() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        } catch (JRException | IOException e) {
            throw new CustomException(e.getMessage());
        }
        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    @RequestMapping(value = "/add-ddc", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addDDC(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        addOutputDocuments("DDC", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-ddac", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addDDAC(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        addOutputDocuments("DDA", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/remove-ddc", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeDDC(@RequestBody OutputDocumentsEntity document) throws CustomException {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByDDNumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
        }
        regRequestRepository.setDDNumber(ids, null);
        regRequestRepository.setDDIncluded(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @RequestMapping(value = "/generate-anihMedM", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateAnihMedM(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException {

        byte[] bytes = null;
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module8/ListaMedicamentelorPentruComisie.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<ListaMedicamentelorPentruComisie> listaMeds = new ArrayList<>();

            requests.forEach(request -> request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(
                    m -> {
                        if (m.getMedicamentId() != null) {
                            Optional<MedicamentEntity> med = medicamentRepository.findById(m.getMedicamentId());
                            if (med.isPresent()) {
                                ListaMedicamentelorPentruComisie l = new ListaMedicamentelorPentruComisie();
                                l.setCompanyName(request.getMedicamentAnnihilation().getCompanyName());
                                l.setAnihilationMethod(m.getDestructionMethod().getDescription());
                                l.setFutilityCause(m.getUselessReason());
                                l.setMedicamentName(med.get().getCommercialName());
                                l.setPharmaceuticForm(m.getPharmaceuticalForm() != null ? m.getPharmaceuticalForm().getDescription() : "");
                                l.setPrimaryPackage(m.getPrimaryPackage());
                                l.setQuantety(String.valueOf(AmountUtils.round(m.getQuantity(), 2)) + " " + String.valueOf(m.getUnitsOfMeasurement() != null ? m.getUnitsOfMeasurement().getDescription() : ""));
                                l.setSeries(m.getSeria());
                                l.setDose(med.get().getDose());

                                listaMeds.add(l);
                            }
                        } else {
                            ListaMedicamentelorPentruComisie l = new ListaMedicamentelorPentruComisie();

                            l.setCompanyName(request.getMedicamentAnnihilation().getCompanyName());
                            l.setAnihilationMethod(m.getDestructionMethod().getDescription());
                            l.setFutilityCause(m.getUselessReason());
                            l.setMedicamentName(m.getNotRegisteredName());
                            l.setPharmaceuticForm(m.getPharmaceuticalForm() != null ? m.getPharmaceuticalForm().getDescription() : "");
                            l.setPrimaryPackage(m.getPrimaryPackage());
                            l.setQuantety(String.valueOf(AmountUtils.round(m.getQuantity(), 2)) + " " + String.valueOf(m.getUnitsOfMeasurement() != null ? m.getUnitsOfMeasurement().getDescription() : ""));
                            l.setSeries(m.getSeria());
                            l.setDose(m.getNotRegisteredDose());

                            listaMeds.add(l);
                        }
                    }
            ));


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(listaMeds);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            parameters.put("listaMedicamentelorPentruComisieDataset", itemsJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint, "lista-medicamente-comisie/Lista-comisie" + new Date().getTime() + ".pdf");
            //
            //            //update requests
            //            // save in db

            NmDocumentTypesEntity ln = documentTypeRepository.findByCategory("LN").orElse(new NmDocumentTypesEntity());


            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(ln);
            outputDocumentsEntity.setName("Lista medicamentelor pentru comisia de nimicire");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);

            outputDocumentsRepository.save(outputDocumentsEntity);


            regRequestRepository.setOutputDocumentId(requests.stream().map(r -> r.getId()).collect(Collectors.toList()), outputDocumentsEntity.getId());
        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=listaPentruComisie.pdf").body(bytes);
    }


    @RequestMapping(value = "/remove-anih-med", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeAnihMed(@RequestBody OutputDocumentsEntity document) {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findAllByOutputDocumentId(document.getId());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests) {
            ids.add(req.getId());
        }
        if (!ids.isEmpty()) {
            regRequestRepository.setOutputDocumentId(ids, null);
        }
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/add-sl", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OutputDocumentsEntity> addSL(@RequestBody OutputDocumentsEntity document) throws CustomException {
        outputDocumentsRepository.save(document);
        return new ResponseEntity<>(document, HttpStatus.OK);
    }

    @RequestMapping(value = "/delete-sl-by-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OutputDocumentsEntity> deleteSLById(@RequestParam("id") Integer id) throws CustomException {
        outputDocumentsRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-aviz-amdm-ct", method = RequestMethod.GET)
    public ResponseEntity<byte[]> generateAvizAC(@RequestParam(value = "id") Integer id,
                                                 @RequestParam(value = "docCategory") String docCategory) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = regRequestRepository.findClinicalTrailstRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }
        RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();

        ClinicTrialAmendEntity clinicTrialAmendEntity = registrationRequestsEntity.getClinicalTrails().getClinicTrialAmendEntities().stream().filter(entity ->
                entity.getRegistrationRequestId().equals(registrationRequestsEntity.getId())
        ).findFirst().orElse(null);

        if (clinicTrialAmendEntity == null) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }

        if (clinicTrialAmendEntity.getComissionNr() == null || clinicTrialAmendEntity.getComissionNr().isEmpty()) {
            throw new CustomException("Numarul comisiei medicamentului nu este introdusa");
        }
        if (clinicTrialAmendEntity.getComissionDate() == null) {
            throw new CustomException("Data comisiei medicamentului nu este introdusa");
        }

        OutputDocumentsEntity documentsEntity = registrationRequestsEntity.getOutputDocuments().stream().filter(docum -> docum.getDocType().getCategory().equals(docCategory)).findFirst().get();

        byte[] bytes = null;

        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = null;
            if (documentsEntity.getDocType().getCategory().equals("AAS")) {
                res = resourceLoader.getResource("layouts/aviz amend.jrxml");
            } else {
                res = resourceLoader.getResource("layouts/Ordin amendamente aprobate.jrxml");
            }
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", documentsEntity.getNumber());
            parameters.put("date", sdf.format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("amdmDate", sdf.format(clinicTrialAmendEntity.getComissionDate()));
            parameters.put("protocolClinic", clinicTrialAmendEntity.getCodeTo());
            if (registrationRequestsEntity.getCompany() == null) {
                RegistrationRequestMandatedContactEntity contact = registrationRequestsEntity.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());
                parameters.put("applicant", contact.getMandatedFirstname().concat(" ").concat(contact.getMandatedLastname()));
            } else {
                parameters.put("applicant", registrationRequestsEntity.getCompany().getName());
            }

            parameters.put("sponsor", clinicTrialAmendEntity.getSponsorTo());
//            parameters.put("institution", String.join("|", clinicTrialAmendEntity.getMedicalInstitutionsTo().stream().map(inst -> inst.getName()).collect(Collectors.toList())));
            parameters.put("studyCode", clinicTrialAmendEntity.getCodeTo());
            parameters.put("eudra", clinicTrialAmendEntity.getEudraCtNrTo());
            parameters.put("studyType", clinicTrialAmendEntity.getProvenanceTo().getDescription().concat(" ").concat(clinicTrialAmendEntity.getTreatmentTo().getDescription()));
            parameters.put("phase", clinicTrialAmendEntity.getPhaseTo().getName());
            parameters.put("avizAmdmNr", documentsEntity.getNumber());

            DocumentsEntity avizEtica = registrationRequestsEntity.getDocuments().stream().filter(docum -> docum.getDocType().getCategory().equals("AC")).findFirst().get();
            parameters.put("avizComitetEticNr", avizEtica.getNumber());
            if (clinicTrialAmendEntity.getAmendCode() == null || clinicTrialAmendEntity.getAmendCode().isEmpty()) {
                throw new CustomException("Codul amendamentului studiului clinic nu este introdus");
            }
            parameters.put("amdmIdentification", clinicTrialAmendEntity.getAmendCode());
            parameters.put("clinicalStudyName", clinicTrialAmendEntity.getTitleTo());

            if (documentsEntity.getDocType().getCategory().equals("OAS")) {
                parameters.put("clinicStudyNr", clinicTrialAmendEntity.getCodeTo());
                parameters.put("ordinDate", documentsEntity.getDate());
                parameters.put("ordinNr", documentsEntity.getNumber());

                ClinicTrialAmdmOrdinDTO dtoDataSource = new ClinicTrialAmdmOrdinDTO();
                if (registrationRequestsEntity.getCompany() == null) {
                    RegistrationRequestMandatedContactEntity contact = registrationRequestsEntity.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());
                    dtoDataSource.setApplicant(contact.getMandatedFirstname().concat(" ").concat(contact.getMandatedLastname()));
                } else {
                    dtoDataSource.setApplicant(registrationRequestsEntity.getCompany().getName());
                }
                dtoDataSource.setClinicalStudy(clinicTrialAmendEntity.getTitleTo());
                dtoDataSource.setPhases(clinicTrialAmendEntity.getPhaseTo().getName());

                List<CtPaymentOrdersEntity> payOrders = ctPaymentOrderRepository.findByregistrationRequestId(id);
                dtoDataSource.setInvoiceNr(String.join("|", payOrders.stream().map(inst -> inst.getNumber().toString().concat("_").concat(sdf.format(inst.getDate()))).collect(Collectors.toList())));

                List<ClinicTrialAmdmOrdinDTO> dtoList = new ArrayList<>();
                dtoList.add(dtoDataSource);
                JRBeanCollectionDataSource ordiJRBean = new JRBeanCollectionDataSource(dtoList);
                parameters.put("ordinAmendamenteAprobateDataSource", ordiJRBean);
            } else {
                List<ClinicTrialMedInstDTO> trialMedInstDTOS = new ArrayList<>();
                clinicTrialAmendEntity.getMedicalInstitutions().forEach(medInst -> {
                    ClinicTrialMedInstDTO medInstDTO = new ClinicTrialMedInstDTO();
                    medInstDTO.setInstitution(medInst.getNmMedicalInstitution().getName());

                    List<CtAmendMedInstSubdivisionsEntity> subdivisions = medInst.getSubdivisionsList().stream().map(subdivision -> subdivision).collect(Collectors.toList());
                    medInstDTO.setSubdivision(String.join("|", subdivisions.stream().map(nmSubdiv -> nmSubdiv.getNmSubdivision().getName()).collect(Collectors.toList())));

                    List<String> investigatorsString = subdivisions.stream().map(nmSubdivision -> nmSubdivision.getInvestigatorsList().stream()
                            .filter(investigator -> investigator.getIsMain().equals(Boolean.TRUE)).findFirst().get().getNmInvestigator())
                            .map(invest -> invest.getFirstName().concat(" ").concat(invest.getLastName())).collect(Collectors.toList());
                    medInstDTO.setInvestigators(String.join("|", investigatorsString));
                    trialMedInstDTOS.add(medInstDTO);
                });

                JRBeanCollectionDataSource institutionSubdivisionInestigatorDataSource = new JRBeanCollectionDataSource(
                        trialMedInstDTOS);
                parameters.put("institutionSubdivisionInestigator", institutionSubdivisionInestigatorDataSource);

                List<ClinicTrialMdicamentDTO> medInstDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getMedicaments().forEach(medicament -> {
                    ClinicTrialMdicamentDTO medDTO = new ClinicTrialMdicamentDTO();
                    medDTO.setProduct(medicament.getName());
                    medDTO.setManufactures(medicament.getManufacture().getDescription());
                    medInstDTOS.add(medDTO);
                });
                JRBeanCollectionDataSource medicamentsDataSource = new JRBeanCollectionDataSource(
                        medInstDTOS);
                parameters.put("prodInvest", medicamentsDataSource);

                List<ClinicTrialMdicamentDTO> refProdDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getReferenceProducts().forEach(refProd -> {
                    ClinicTrialMdicamentDTO medDTO = new ClinicTrialMdicamentDTO();
                    medDTO.setProduct(refProd.getName());
                    medDTO.setManufactures(refProd.getManufacture().getDescription());
                    refProdDTOS.add(medDTO);
                });
                JRBeanCollectionDataSource refProdDataSource = new JRBeanCollectionDataSource(
                        refProdDTOS);
                parameters.put("prodRef", refProdDataSource);

                List<ClinicTrialMdicamentDTO> placeboDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getPlacebos().forEach(placebo -> {
                    ClinicTrialMdicamentDTO medDTO = new ClinicTrialMdicamentDTO();
                    medDTO.setProduct(placebo.getName());
                    medDTO.setManufactures(placebo.getManufacture().getDescription());
                    placeboDTOS.add(medDTO);
                });
                JRBeanCollectionDataSource placeboDataSource = new JRBeanCollectionDataSource(
                        placeboDTOS);
                parameters.put("prodPlac", placeboDataSource);

            }
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException | IOException e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-aviz-ct", method = RequestMethod.GET)
    public ResponseEntity<byte[]> generateAvizC(@RequestParam(value = "id") Integer id,
                                                @RequestParam(value = "docCategory") String docCategory) throws CustomException {
        Optional<RegistrationRequestsEntity> regOptional = regRequestRepository.findClinicalTrailstRequestById(id);
        if (!regOptional.isPresent()) {
            throw new CustomException("Inregistrarea nu a fost gasita");
        }

        byte[] bytes = null;

        RegistrationRequestsEntity registrationRequestsEntity = regOptional.get();
        OutputDocumentsEntity documentsEntity = registrationRequestsEntity.getOutputDocuments().stream().filter(docum -> docum.getDocType().getCategory().equals(docCategory)).findFirst().get();

        if (registrationRequestsEntity.getClinicalTrails().getComissionNr() == null || registrationRequestsEntity.getClinicalTrails().getComissionNr().isEmpty()) {
            throw new CustomException("Numarul comisiei medicamentului nu este introdusa");
        }
        if (registrationRequestsEntity.getClinicalTrails().getComissionDate() == null) {
            throw new CustomException("Data comisiei medicamentului nu este introdusa");
        }
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = null;
            if (documentsEntity.getDocType().getCategory().equals("AS")) {
                res = resourceLoader.getResource("layouts/aviz studiu.jrxml");
            } else {
                res = resourceLoader.getResource("layouts/Ordin Studiu Clinic.jrxml");
            }
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", documentsEntity.getNumber());
            parameters.put("date", sdf.format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
            parameters.put("amdmDate", sdf.format(registrationRequestsEntity.getClinicalTrails().getComissionDate()));
            if (registrationRequestsEntity.getCompany() != null) {
                parameters.put("applicant", registrationRequestsEntity.getCompany().getName());
            }
            parameters.put("sponsor", registrationRequestsEntity.getClinicalTrails().getSponsor());

            parameters.put("studyCode", registrationRequestsEntity.getClinicalTrails().getCode());
            parameters.put("eudra", registrationRequestsEntity.getClinicalTrails().getEudraCtNr());
            parameters.put("studyType", registrationRequestsEntity.getClinicalTrails().getProvenance().getDescription().concat(" ").concat(
                    registrationRequestsEntity.getClinicalTrails().getTreatment().getDescription()));
            parameters.put("phase", registrationRequestsEntity.getClinicalTrails().getPhase().getName());
            parameters.put("clinicalStudyName", registrationRequestsEntity.getClinicalTrails().getTitle());
            parameters.put("clinicStudyNr", registrationRequestsEntity.getClinicalTrails().getEudraCtNr());
            parameters.put("ordinNr", documentsEntity.getNumber());
            parameters.put("ordinDate", sdf.format(new Date()));

            parameters.put("procesVerbalNr", registrationRequestsEntity.getClinicalTrails().getComissionNr());
            parameters.put("procesVerbalDate", sdf.format(registrationRequestsEntity.getClinicalTrails().getComissionDate()));
            if (documentsEntity.getDocType().getCategory().equals("OS")) {
                DocumentsEntity documentAviz = registrationRequestsEntity.getDocuments().stream().filter(document -> document.getDocType().getCategory().equals("AS")).findFirst()
                        .orElse(null);
                if (documentAviz == null) {
                    throw new CustomException("Avizul pentru desfasurarea studiului clinic nu a fost incarcat");
                }
                parameters.put("avizAmdmNr", documentAviz.getNumber());
                parameters.put("avizAmdmDate", sdf.format(documentAviz.getDate()));
                DocumentsEntity documentEtica = registrationRequestsEntity.getDocuments().stream().filter(document -> document.getDocType().getCategory().equals("AC")).findFirst().get();
                parameters.put("hcneescNr", documentEtica.getNumber());
                parameters.put("hcneescDate", sdf.format(documentEtica.getDate()));

                StringBuilder sb = new StringBuilder();
                registrationRequestsEntity.getClinicalTrails().getMedicalInstitutions().forEach(medInst -> {
                    sb.append("Investigator al ").append(medInst.getNmMedicalInstitution().getName());
                    sb.append(" ");
                    List<String> investigators =
                            medInst.getSubdivisionsList().stream().map(subdiv ->
                                    subdiv.getInvestigatorsList().stream().filter(invest ->
                                            invest.getIsMain() == Boolean.TRUE).findAny().get())
                                    .map(mainInvestig -> mainInvestig.getNmInvestigator().getFirstName().concat(" ").concat(mainInvestig.getNmInvestigator().getLastName()))
                                    .collect(Collectors.toList());
                    sb.append(String.join(" si ", investigators));
                    sb.append("|");
                });
                sb.deleteCharAt(sb.lastIndexOf("|"));
                if(registrationRequestsEntity.getClinicalTrails().getMedicalInstitutions().size()==1
                        && registrationRequestsEntity.getClinicalTrails().getMedicalInstitutions().stream().findAny().get().getSubdivisionsList().size() == 1 ){
                    sb.append("| va organiza studiul clinic:|");
                } else {
                    sb.append("| vor organiza studiul clinic:|");
                }
                sb.append("\"");
                sb.append(registrationRequestsEntity.getClinicalTrails().getTitle());
                sb.append("\"");
                sb.append(" în conformitate cu Protocolul studiului ");
                sb.append(registrationRequestsEntity.getClinicalTrails().getCode());
                parameters.put("ordinDetails", sb.toString());

                parameters.put("farmacoVigilentaChef", sysParamsRepository.findByCode(Constants.SysParams.STUD_CLIN_SERVICE).get().getValue());
                parameters.put("informationalTechnologyChef", sysParamsRepository.findByCode(Constants.SysParams.INFORM_TEHNOLOGY_SERVICE).get().getValue());
            } else {
                List<ClinicTrialMedInstDTO> trialMedInstDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getMedicalInstitutions().forEach(medInst -> {
                    ClinicTrialMedInstDTO medInstDTO = new ClinicTrialMedInstDTO();
                    medInstDTO.setInstitution(medInst.getNmMedicalInstitution().getName());

                    List<CtMedInstSubdivisionsEntity> subdivisions = medInst.getSubdivisionsList().stream().map(subdivision -> subdivision).collect(Collectors.toList());
                    medInstDTO.setSubdivision(String.join("|", subdivisions.stream().map(nmSubdiv -> nmSubdiv.getNmSubdivision().getName()).collect(Collectors.toList())));

                    List<String> investigatorsString = subdivisions.stream().map(nmSubdivision -> nmSubdivision.getInvestigatorsList().stream()
                            .filter(investigator -> investigator.getIsMain().equals(Boolean.TRUE)).findFirst().get().getNmInvestigator())
                            .map(invest -> invest.getFirstName().concat(" ").concat(invest.getLastName())).collect(Collectors.toList());
                    medInstDTO.setInvestigators(String.join("|", investigatorsString));
                    trialMedInstDTOS.add(medInstDTO);
                });

                JRBeanCollectionDataSource institutionSubdivisionInestigatorDataSource = new JRBeanCollectionDataSource(
                        trialMedInstDTOS);
                parameters.put("institutionSubdivisionInestigator", institutionSubdivisionInestigatorDataSource);

                List<ClinicTrialMdicamentDTO> medInstDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getMedicaments().forEach(medicament -> {
                    ClinicTrialMdicamentDTO medDTO = new ClinicTrialMdicamentDTO();
                    medDTO.setProduct(medicament.getName());
                    medDTO.setManufactures(medicament.getManufacture().getDescription());
                    medInstDTOS.add(medDTO);
                });
                JRBeanCollectionDataSource medicamentsDataSource = new JRBeanCollectionDataSource(
                        medInstDTOS);
                parameters.put("prodInvest", medicamentsDataSource);

                List<ClinicTrialMdicamentDTO> refProdDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getReferenceProducts().forEach(refProd -> {
                    ClinicTrialMdicamentDTO medDTO = new ClinicTrialMdicamentDTO();
                    medDTO.setProduct(refProd.getName());
                    medDTO.setManufactures(refProd.getManufacture().getDescription());
                    refProdDTOS.add(medDTO);
                });
                JRBeanCollectionDataSource refProdDataSource = new JRBeanCollectionDataSource(
                        refProdDTOS);
                parameters.put("prodRef", refProdDataSource);

                List<ClinicTrialMdicamentDTO> placeboDTOS = new ArrayList<>();
                registrationRequestsEntity.getClinicalTrails().getPlacebos().forEach(placebo -> {
                    ClinicTrialMdicamentDTO medDTO = new ClinicTrialMdicamentDTO();
                    medDTO.setProduct(placebo.getName());
                    medDTO.setManufactures(placebo.getManufacture().getDescription());
                    placeboDTOS.add(medDTO);
                });
                JRBeanCollectionDataSource placeboDataSource = new JRBeanCollectionDataSource(
                        placeboDTOS);
                parameters.put("prodPlac", placeboDataSource);

            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);


        } catch (IOException | JRException e) {
            throw new CustomException(e.getMessage());
        }
        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    public Optional<String> getExtensionByStringHandling(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1));
    }

    public static class TableData {
        private List<String> columns;
        private List data;

        public TableData() {
        }

        public List<String> getColumns() {
            return columns;
        }

        public void setColumns(List<String> columns) {
            this.columns = columns;
        }

        public List getData() {
            return data;
        }

        public void setData(List data) {
            this.data = data;
        }
    }

    static class FileResult {

        private String path;

        public String getPath() {
            return path;
        }

        public FileResult setPath(String path) {
            this.path = path;
            return this;
        }
    }

}
