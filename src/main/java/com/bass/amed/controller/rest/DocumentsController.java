package com.bass.amed.controller.rest;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.*;
import com.bass.amed.dto.annihilation.BonPlataAnihilare1;
import com.bass.amed.dto.annihilation.BonPlataAnihilare2;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.StorageService;
import com.bass.amed.utils.AmountUtils;
import com.bass.amed.utils.NumberToWordsConverter;
import com.bass.amed.utils.SecurityUtils;
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
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DocumentsController
{
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

    @Value("${final.documents.folder}")
    private String folder;

    @RequestMapping(value = "/pushFile", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FileResult> pushFileToServer(@RequestParam("file") MultipartFile file, @RequestParam("nrCerere") String nrCerere) throws CustomException
    {
        logger.debug("Store file with name=" + file.getOriginalFilename());
        StringBuilder sb = new StringBuilder(folder);
        createRootPath(nrCerere, sb);

        storageService.store(sb.toString(), file);
        FileResult fr = new FileResult();
        fr.setPath(sb.append("/").append(file.getOriginalFilename()).toString());
        return new ResponseEntity<>(fr, HttpStatus.OK);

    }

    @RequestMapping(value = "/by-ids", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentsEntity>> getDocumentsByIds(@RequestBody Integer[] ids)
    {
        logger.debug("getDocumentsByIds");
        List<DocumentsEntity> docs = null;
        if (ids.length > 0)
        {
            docs = documentsRepository.findAllByIds(Arrays.asList(ids));
        }
        return new ResponseEntity<>(docs, HttpStatus.OK);
    }

    @RequestMapping(value = "/by-price-ids", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentsEntity>> getDocumentsByPriceIds(@RequestBody Integer[] ids)
    {
        logger.debug("getDocumentsByPriceIds");
        List<DocumentsEntity> docs = null;
        if (ids.length > 0)
        {
            docs = documentsRepository.findAllByPriceIds(Arrays.asList(ids));
        }
        return new ResponseEntity<>(docs, HttpStatus.OK);
    }

    @RequestMapping(value = "/removeFile", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeFile(@RequestParam("relativeFolder") String relativeFolder) throws CustomException
    {
        logger.debug("Remove files for folder=" + relativeFolder);
        storageService.remove(relativeFolder);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-dd", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addDD(@RequestParam("id") Integer id, @RequestParam("file") MultipartFile file) throws CustomException
    {
        addOutputDocuments("DD", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/add-oi", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addOI(@RequestParam("id") Integer id, @RequestParam("file") MultipartFile file) throws CustomException
    {
        addOutputDocuments("OI", id, file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    void addOutputDocuments(String category, Integer id, MultipartFile file) throws CustomException
    {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        storageService.remove(outDocument.getPath());
        storageService.store(outDocument.getPath().substring(0, outDocument.getPath().lastIndexOf('/')), file, outDocument.getName());
        outDocument.setAttached(true);
        outputDocumentsRepository.save(outDocument);
        List<RegistrationRequestsEntity> requests = new ArrayList<>();
        switch (category)
        {
            case "OI":
                requests = regRequestRepository.findRequestsByOINumber(outDocument.getNumber());
                break;
            case "DD":
                requests = regRequestRepository.findRequestsByDDNumber(outDocument.getNumber());
                break;
            default:
        }
        for (RegistrationRequestsEntity request : requests)
        {
            DocumentsEntity d = new DocumentsEntity();
            d.setDocType(outDocument.getDocType());
            d.setPath(outDocument.getPath());
            d.setName(outDocument.getName());
            d.setDate(new Timestamp(new Date().getTime()));
            d.setNumber(outDocument.getNumber());
            d.setRegistrationRequestId(request.getId());
            documentsRepository.save(d);
            if (category.equals("OI"))
            {
                request.getMedicaments().stream().forEach(t -> t.setStatus("C"));
                request.setCurrentStep("C");
                RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
                historyEntity.setUsername(SecurityUtils.getCurrentUser().orElse(""));
                historyEntity.setStep("C");
                historyEntity.setStartDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
                request.getRequestHistories().add(historyEntity);
                request.setEndDate(new Timestamp(new Date().getTime()));
                regRequestRepository.save(request);
            }
        }
    }

    @RequestMapping(value = "/add-oa", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> addOA(@RequestParam("id") Integer id, @RequestParam("dateOfIssue") Date dateOfIssue, @RequestParam("file") MultipartFile file) throws CustomException
    {
        Optional<OutputDocumentsEntity> outputDocumentsEntityOpt = outputDocumentsRepository.findById(id);
        OutputDocumentsEntity outDocument = outputDocumentsEntityOpt.orElse(new OutputDocumentsEntity());
        storageService.remove(outDocument.getPath());
        storageService.store(outDocument.getPath().substring(0, outDocument.getPath().lastIndexOf('/')), file, outDocument.getName());
        outDocument.setAttached(true);
        outDocument.setDateOfIssue(new Timestamp(dateOfIssue.getTime()));
        outputDocumentsRepository.save(outDocument);
        List<Integer> requestIds = medicamentRepository.findRequestsIDByOANumber(outDocument.getNumber());
        for (Integer reqId : requestIds)
        {
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
    public ResponseEntity<byte[]> generateDD(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException
    {

        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/Dispozitie A Guvern.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            /* Map to hold Jasper report Parameters */
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", String.valueOf(seq.getId()));
            SimpleDateFormat sdf = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
            parameters.put("date", sdf.format(new Date()));
            parameters.put("nrOrdin", "A07.PS-01.Rg04-12");
            parameters.put("nrOrdinDate", "19.01.2018");
            parameters.put("ordinName", "„Despre aprobarea listei de experţi din cadrul Agenţiei Medicamentului şi Dispozitivelor Medicale”");
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            List<DispozitieDeDistribuireDTO> ddListDTO = new ArrayList<>();
            List<Integer> ids = new ArrayList<>();
            for (RegistrationRequestsEntity req : requests)
            {
                ids.add(req.getId());
            }
            //load full info about requests
            List<RegistrationRequestsEntity> fullInfoRequests = regRequestRepository.findRequestWithMedicamentInfo(ids);
            for (RegistrationRequestsEntity req : fullInfoRequests)
            {
                DispozitieDeDistribuireDTO ddDTO = new DispozitieDeDistribuireDTO();
                MedicamentEntity medicamentEntity = req.getMedicaments().stream().findFirst().orElse(new MedicamentEntity());
                if (medicamentEntity != null && medicamentEntity.getId() != null)
                {
                    NmManufacturesEntity manufacture =
                            medicamentEntity.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).findFirst().orElse(new MedicamentManufactureEntity()).getManufacture();
                    if (manufacture == null)
                    {
                        ddDTO.setAutorizationOwner(medicamentEntity.getAuthorizationHolder().getDescription());
                    }
                    else
                    {
                        ddDTO.setAutorizationOwner(medicamentEntity.getAuthorizationHolder().getDescription() + "/" + manufacture.getDescription() + " " + manufacture.getCountry().getDescription());
                    }
                    ddDTO.setExpertName(medicamentEntity.getExperts().getChairman().getName() + "; " + medicamentEntity.getExperts().getFarmacolog().getName() + "; "
                            + medicamentEntity.getExperts().getFarmacist().getName() + "; " + medicamentEntity.getExperts().getMedic().getName());
                    ddDTO.setMedicamentNameDosePharmform(medicamentEntity.getCommercialName() + " " + medicamentEntity.getDose() + " " + medicamentEntity.getPharmaceuticalForm().getDescription());
                    ddDTO.setNotes(medicamentEntity.getExperts().getComment());
                    ddDTO.setRegistrationNrDate(medicamentEntity.getExperts().getNumber() + " " + sdf.format(medicamentEntity.getExperts().getDate()));
                    ddListDTO.add(ddDTO);
                }
            }
            JRBeanCollectionDataSource ddListJRBean = new JRBeanCollectionDataSource(ddListDTO);
            parameters.put("dispozitieAGuvern", ddListJRBean);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            //save to storage
            String docPath = storageService.storePDFFile(jasperPrint, "dispozitii_de_distribuire/Dispozitie de distribuire Nr " + seq.getId() + ".pdf");

            //update requests
            regRequestRepository.setDDNumber(ids, String.valueOf(seq.getId()));

            // save in db
            OutputDocumentsEntity outputDocumentsEntity = new OutputDocumentsEntity();
            outputDocumentsEntity.setDocType(documentTypeRepository.findByCategory("DD").orElse(new NmDocumentTypesEntity()));
            outputDocumentsEntity.setNumber(String.valueOf(seq.getId()));
            outputDocumentsEntity.setName("Dispozitie de distribuire Nr " + seq.getId() + ".pdf");
            outputDocumentsEntity.setDate(new Timestamp(new Date().getTime()));
            outputDocumentsEntity.setPath(docPath);
            outputDocumentsRepository.save(outputDocumentsEntity);
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-oi", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateOI(@RequestBody List<RegistrationRequestsEntity> requests) throws CustomException
    {

        byte[] bytes = null;
        try
        {
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
            for (RegistrationRequestsEntity req : requests)
            {
                ids.add(req.getId());
            }
            List<MedicamentePentruOrdinDTO> medMD = new ArrayList<>();
            int i = 1;
            List<RegistrationRequestsEntity> fullInfoRequests = regRequestRepository.findRequestWithMedicamentInfo(ids);
            for (RegistrationRequestsEntity req : fullInfoRequests)
            {
                MedicamentePentruOrdinDTO dto = new MedicamentePentruOrdinDTO();
                MedicamentEntity med = req.getMedicaments().stream().findFirst().orElse(new MedicamentEntity());
                dto.setName(med.getCommercialName());
                dto.setPharmaceuticalForm(med.getPharmaceuticalForm().getDescription());
                dto.setConcentration(med.getDose());
                dto.setDose(req.getMedicaments().stream().map(t -> t.getDivision()).collect(Collectors.joining("; ")));
                MedicamentManufactureEntity manufacture =
                        med.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).findFirst().orElse(new MedicamentManufactureEntity());
                dto.setCompanyName(med.getAuthorizationHolder().getDescription() + "(prod: " + manufacture.getManufacture().getDescription() + " " + manufacture.getManufacture().getAddress() + " " +
                        manufacture.getManufacture().getCountry().getDescription() + ")");
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dispozitieDeDistribuire.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-oa", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> generateOA(@RequestBody List<MedicamentEntity> medicamentEntities) throws CustomException
    {

        byte[] bytes = null;
        try
        {
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
            for (MedicamentEntity med : medicamentEntities)
            {
                ids.add(med.getId());
            }
            List<MedicamentEntity> mergedEntities = new ArrayList<>();
            Integer requestId = 0;
            MedicamentEntity temp = new MedicamentEntity();
            for (MedicamentEntity med : medicamentEntities)
            {
                if (!requestId.equals(med.getRequestId()))
                {
                    generateMedicamentRegistrationNumberRepository.save(medicamentRegistrationNumberSequence);
                    if (temp.getId() != null)
                    {
                        mergedEntities.add(temp);
                    }
                    temp = med;
                }
                else
                {
                    temp.setDivision(temp.getDivision() + "; " + med.getDivision());
                }
                medicamentRepository.setRegistrationNumber(med.getId(), medicamentRegistrationNumberSequence.getId());
                med.setRegistrationNumber(medicamentRegistrationNumberSequence.getId());
            }
            if (temp.getId() != null)
            {
                mergedEntities.add(temp);
            }
            for (MedicamentEntity med : mergedEntities)
            {
                MedicamentePentruOrdinDTO dto = new MedicamentePentruOrdinDTO();
                dto.setName(med.getCommercialName());
                dto.setPharmaceuticalForm(med.getPharmaceuticalForm().getDescription());
                dto.setConcentration(med.getDose());
                dto.setRegistrationNumber(String.valueOf(med.getRegistrationNumber()));
                dto.setStatus(med.getMedicamentType().getCode().equals("1") ? "Original" : "");
                dto.setDose(med.getDivision());
                MedicamentManufactureEntity manufacture =
                        med.getManufactures().stream().filter(t -> t.getProducatorProdusFinit()).findFirst().orElse(new MedicamentManufactureEntity());
                dto.setCompanyName(med.getAuthorizationHolder().getDescription() + "(prod: " + manufacture.getManufacture().getDescription() + " " + manufacture.getManufacture().getAddress() + " " +
                        manufacture.getManufacture().getCountry().getDescription() + ")");
                dto.setCountry(med.getAuthorizationHolder().getCountry().getDescription());
                if (med.getStatus().equals("R"))
                {
                    //Repetate moldova
                    if (med.getAuthorizationHolder().getCountry().getCode().equals("MD"))
                    {
                        medRepetatMD.add(dto);
                    }
                    //repetate import
                    else
                    {
                        medRepetatImport.add(dto);
                    }
                }
                else
                {
                    // primare moldova
                    if (med.getAuthorizationHolder().getCountry().getCode().equals("MD"))
                    {
                        medMD.add(dto);
                    }
                    // primare import
                    else
                    {
                        medImport.add(dto);
                    }
                }
            }

            List<JasperPrint> jasperPrints = new ArrayList<>();
            jasperPrints.add(jasperPrint1);
            if (!medMD.isEmpty())
            {
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

            if (!medImport.isEmpty())
            {
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

            if (!medRepetatMD.isEmpty())
            {
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

            if (!medRepetatImport.isEmpty())
            {
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=ordinDeAutorizare.pdf").body(bytes);
    }

    @RequestMapping(value = "/remove-dd", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeDD(@RequestBody OutputDocumentsEntity document) throws CustomException
    {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByDDNumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests)
        {
            ids.add(req.getId());
        }
        regRequestRepository.setDDNumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-oi", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeOI(@RequestBody OutputDocumentsEntity document) throws CustomException
    {
        storageService.remove(document.getPath());
        List<RegistrationRequestsEntity> requests = regRequestRepository.findRequestsByOINumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (RegistrationRequestsEntity req : requests)
        {
            ids.add(req.getId());
        }
        regRequestRepository.setOINumber(ids, null);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/remove-oa", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Void> removeOA(@RequestBody OutputDocumentsEntity document) throws CustomException
    {
        storageService.remove(document.getPath());
        List<MedicamentEntity> medicaments = medicamentRepository.findMedicamentsByOANumber(document.getNumber());
        List<Integer> ids = new ArrayList<>();
        for (MedicamentEntity med : medicaments)
        {
            ids.add(med.getId());
        }
        MedicamentEntity medMin = medicaments.stream().min(Comparator.comparing(MedicamentEntity::getRegistrationNumber)).get();
        generateMedicamentRegistrationNumberRepository.deleteSeq(medMin.getRegistrationNumber());
        generateMedicamentRegistrationNumberRepository.changeAutoIncrementFormMedicamentRegNr(medMin.getRegistrationNumber());
        medicamentRepository.clearOANumber(ids);
        outputDocumentsRepository.deleteById(document.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/view-bon-de-plata", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlata(@RequestBody BonDePlataDTO bonDePlataDTO) throws CustomException
    {

        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = null;
            Double coeficient = 1d;
            if (!bonDePlataDTO.getCurrency().isEmpty() && !bonDePlataDTO.getCurrency().equals("MDL"))
            {
                DateFormat formatter = new SimpleDateFormat(Constants.Layouts.DATE_FORMAT);
                List<NmCurrenciesHistoryEntity> nmCurrenciesHistoryEntities = currencyHistoryRepository.findAllByPeriod(formatter.parse(formatter.format(new Date())));
                if (nmCurrenciesHistoryEntities.isEmpty())
                {
                    throw new CustomException("Lipseste cursul valutar pentru astazi.");
                }
                NmCurrenciesHistoryEntity nmCurrenciesHistoryEntity =
                        nmCurrenciesHistoryEntities.stream().filter(t -> t.getCurrency().getShortDescription().equals(bonDePlataDTO.getCurrency())).findFirst().orElse(new NmCurrenciesHistoryEntity());
                if (nmCurrenciesHistoryEntity.getId() <= 0)
                {
                    throw new CustomException("Nu a fost gasit cursul valutar pentru valuta " + bonDePlataDTO.getCurrency());
                }
                coeficient = AmountUtils.round(nmCurrenciesHistoryEntity.getValue() / nmCurrenciesHistoryEntity.getMultiplicity(), 4);
            }
            switch (bonDePlataDTO.getCurrency())
            {
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
            List<BonDePlataMedicamentDTO> detailsUpdated = new ArrayList<>();
            for (PaymentOrdersEntity paymentOrdersEntity : bonDePlataDTO.getPaymentOrders())
            {
                if (!"BS".equals(paymentOrdersEntity.getServiceCharge().getCategory()))
                {
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

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(bonDePlataDTO.getRequestId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            for (PaymentOrdersEntity order : details)
            {
                if (bonDePlataDTO.getPaymentOrders().stream().anyMatch(t -> t.getId().equals(order.getId())))
                {
                    order.setDate(now);
                    order.setNumber(String.valueOf(seq.getId()));
                    order.setCurrency(bonDePlataDTO.getCurrency());
                    order.setAmountExchanged(AmountUtils.round(order.getQuantity() * order.getAmount() / coeficient, 2));
                    paymentOrderRepository.save(order);
                }
            }
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlata.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-bon-de-plata-suplimentar", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlataSuplimentar(@RequestBody BonDePlataDTO bonDePlataDTO) throws CustomException
    {

        byte[] bytes = null;
        try
        {
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

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(bonDePlataDTO.getRequestId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            for (PaymentOrdersEntity order : details)
            {
                if (bonDePlataDTO.getPaymentOrders().stream().anyMatch(t -> t.getId().equals(order.getId())))
                {
                    order.setDate(now);
                    order.setNumber(String.valueOf(seq.getId()));
                    order.setCurrency(bonDePlataDTO.getCurrency());
                    order.setAmountExchanged(AmountUtils.round(order.getQuantity() * order.getAmount(), 2));
                    paymentOrderRepository.save(order);
                }
            }
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlata.pdf").body(bytes);
    }

    private void createRootPath(String nrCerere, StringBuilder sb)
    {
        sb.append("/");
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        Date date = new Date();
        sb.append(sdf.format(date));
        sb.append("/");
        sb.append(nrCerere);
        sb.append("/");
    }

    @RequestMapping(value = "/view-medicament-authorization-certificate", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewMedicamentAuthorizationCertificate(@RequestBody AuthorizationCertificateDTO certificateDTO) throws CustomException
    {
        byte[] bytes = null;
        try
        {
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=solicitareDateAditionale.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-request-additional-data", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewRAD(@RequestParam(value = "nrDocument") String nrDocument,
                                          @RequestParam(value = "content") String content,
                                          @RequestParam(value = "title") String title,
                                          @RequestParam(value = "type") String type
    ) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            String classPath = "";
            switch (type)
            {
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=request.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-medicament-authorization-order", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewMedicamentAuthorizationOrder(@RequestParam(value = "nrDocument") String nrDocument) throws CustomException
    {
        byte[] bytes = null;
        try
        {
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=request.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-request-additional-data-new", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewRequestAdditionalData(@RequestBody RequestAdditionalDataDTO requestData) throws CustomException
    {
        byte[] bytes = null;
        try
        {
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=solicitareDateAditionale.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-interrupt-order-of-medicament-registration", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewInterruptOrderMR(@RequestParam(value = "nrDocument") String nrDocument) throws CustomException
    {
        byte[] bytes = null;
        try
        {
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=interruptOrder.pdf").body(bytes);
    }

    private List<RequestAdditionalDataDTO> fillRequestAdditionalDataDTO(@RequestParam("nrDocument") String nrDocument, @RequestParam("content") String content, @RequestParam("title") String title)
    {
        List<RequestAdditionalDataDTO> dataList = new ArrayList();
        RequestAdditionalDataDTO obj = new RequestAdditionalDataDTO();
        obj.setRequestDate(Calendar.getInstance().getTime());
        obj.setContent(content);
        obj.setNrRequest(nrDocument);
        obj.setTitle(title);
        dataList.add(obj);
        return dataList;
    }

    //    @RequestMapping(value = "/generate-request-additional-data", method = RequestMethod.GET)
    //    public ResponseEntity<String> generateRequestAdditionalData(@RequestParam(value = "nrCerere") String nrCerere,
    //                                                                @RequestParam(value = "nrDocument") String nrDocument,
    //                                                                @RequestParam(value = "content") String content,
    //                                                                @RequestParam(value = "title") String title,
    //                                                                @RequestParam(value = "type") String type
    //                                                               ) throws CustomException, IOException
    //    {
    //        logger.debug("Generate Request Additional Data");
    //
    //        ResourceLoader resourceLoader = new DefaultResourceLoader();
    //        Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
    //
    //        List<RequestAdditionalDataDTO> dataList = fillRequestAdditionalDataDTO(nrDocument, content, title);
    //
    //        StringBuilder sb = new StringBuilder(folder);
    //        createRootPath(nrCerere, sb);
    //        if(type.equals("NOTIFICATION"))
    //        {
    //            sb.append("Scrisoare de informare Nr " + nrDocument + ".pdf");
    //        }
    //        else
    //        {
    //            sb.append("Scrisoare de solicitare date aditionale Nr " + nrDocument + ".pdf");
    //        }
    //
    //        if(type.equals("NOTIFICATION"))
    //        {
    //            storageService.storePDFFile(dataList, sb.toString(), "classpath:..\\resources\\layouts\\notificationLetter.jrxml");
    //        }
    //        else
    //        {
    //            storageService.storePDFFile(dataList, sb.toString(), "classpath:..\\resources\\layouts\\requestAdditionalData.jrxml");
    //        }
    //
    //        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    //    }
    //
    //    @RequestMapping(value = "/generate-interrupt-order-of-medicament-registration", method = RequestMethod.GET)
    //    public ResponseEntity<String> generateInterruptOrderOfMR(@RequestParam(value = "nrCerere") String nrCerere,
    //                                                                @RequestParam(value = "nrDocument") String nrDocument
    //    ) throws CustomException, IOException
    //    {
    //        logger.debug("Generate Interrupt Order of MR");
    //
    //        ResourceLoader resourceLoader = new DefaultResourceLoader();
    //        Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
    //
    //        List<RequestAdditionalDataDTO> dataList = new ArrayList();
    //        RequestAdditionalDataDTO obj = new RequestAdditionalDataDTO();
    //        obj.setRequestDate(Calendar.getInstance().getTime());
    //        obj.setNrRequest(nrDocument);
    //        dataList.add(obj);
    //
    //        StringBuilder sb = new StringBuilder(folder);
    //        createRootPath(nrCerere, sb);
    //        sb.append("Ordin de întrerupere a procedurii de înregistrare a medicamentului Nr " + nrDocument+ ".pdf");
    //
    //        storageService.storePDFFile(dataList,sb.toString(),"classpath:..\\resources\\layouts\\interruptOrderOfMedicamentRegistration.jrxml");
    //
    //        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    //    }
    //
    //    @RequestMapping(value = "/generate-certificatul-de-autorizare", method = RequestMethod.GET)
    //    public ResponseEntity<String> generateCerifiactulDeAutorizare(@RequestParam(value = "nrCerere") String nrCerere) throws CustomException
    //    {
    //        logger.debug("Generate certificatul de autorizare");
    //
    //        ResourceLoader resourceLoader = new DefaultResourceLoader();
    //        Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
    //
    //        StringBuilder sb = new StringBuilder(folder);
    //        createRootPath(nrCerere, sb);
    //        sb.append("Certificatul de autorizare al medicamentului.pdf");
    //
    //        storageService.storePDFFile(new ArrayList<>(),sb.toString(),"classpath:..\\resources\\layouts\\medicamentAuthorizationCertificate.jrxml");
    //
    //        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
    //    }

    @RequestMapping(value = "/view-document", method = RequestMethod.GET)
    public ResponseEntity<InputStreamResource> generateBon(@RequestParam(value = "relativePath") String relativePath, HttpServletRequest request) throws FileNotFoundException
    {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + relativePath.substring(relativePath.lastIndexOf("/") + 1));

        File file = storageService.loadFile(relativePath);

        InputStreamResource isr = new InputStreamResource(new FileInputStream(file));

        // Try to determine file's content type
        String contentType = null;
        try
        {
            contentType = request.getServletContext().getMimeType(file.getAbsolutePath());
        }
        catch (Exception ex)
        {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null)
        {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType(contentType)).body(isr);
    }

    @GetMapping(value = "/get-document-types")
    public ResponseEntity<List<NmDocumentTypesEntity>> getDocumentTypes()
    {
        return new ResponseEntity<>(documentTypeRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/view-bon-de-plata-nimicire", method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlataNimicire(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        logger.debug("Generare bon pentru nimicire" + request.getId());
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module8/BonPlataNimicireMedicamente.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(request.getId());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            for (PaymentOrdersEntity order : details)
            {
                order.setDate(now);
                order.setNumber(String.valueOf(seq.getId()));
                paymentOrderRepository.save(order);
            }

            List<BonPlataAnihilare1> bonNimicire = new ArrayList<>();

            double quantitySum = 0.0;
            double totalSum = 0.0;

            for (MedicamentAnnihilationMedsEntity mm : request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds())
            {
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

            for (PaymentOrdersEntity order : details)
            {
                if (!("BN").equals(order.getServiceCharge().getCategory()))
                {
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
            parameters.put("invoice_date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date()));
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
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=bonDePlataNimicire.pdf").body(bytes);

    }

    @Transactional
    @RequestMapping(value = "/save-docs", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> saveDocuments(@RequestBody List<DocumentsEntity> documents)
    {
        try
        {
            documentsRepository.saveAll(documents);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(false, HttpStatus.CREATED);
        }
    }


    @RequestMapping(value = "/view-table-pdf", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewTablePdf(@RequestBody TableData tableData) throws CustomException
    {
        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        byte[] bytes = null;
        try
        {
            PdfPTable table = new PdfPTable(tableData.getColumns().size());
            table.setWidthPercentage(90);

            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

            for (String cols : tableData.getColumns())
            {
                PdfPCell hcell;
                hcell = new PdfPCell(new Phrase(cols, headFont));
                hcell.setHorizontalAlignment(Element.ALIGN_CENTER);
                hcell.setBackgroundColor(new BaseColor(0xF0, 0xF8, 0xFF));
                table.addCell(hcell);
            }

            for (Object o : tableData.getData())
            {
                Map<String, Object> map = (Map<String, Object>) o;

                for (Object o1 : map.values())
                {
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

        }
        catch (DocumentException e)
        {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=tableData.pdf").body(bytes);

    }

    public static class TableData
    {
        private List<String> columns;
        private List data;

        public TableData()
        {
        }

        public List<String> getColumns()
        {
            return columns;
        }

        public void setColumns(List<String> columns)
        {
            this.columns = columns;
        }

        public List getData()
        {
            return data;
        }

        public void setData(List data)
        {
            this.data = data;
        }
    }

    static class FileResult
    {

        private String path;

        public String getPath()
        {
            return path;
        }

        public FileResult setPath(String path)
        {
            this.path = path;
            return this;
        }
    }

}
