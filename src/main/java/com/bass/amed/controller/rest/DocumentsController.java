package com.bass.amed.controller.rest;

import com.bass.amed.dto.DistributionDispositionDTO;
import com.bass.amed.dto.RequestAdditionalDataDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.DocumentTypeRepository;
import com.bass.amed.repository.DocumentsRepository;
import com.bass.amed.repository.PaymentOrderNumberRepository;
import com.bass.amed.repository.PaymentOrderRepository;
import com.bass.amed.service.GenerateDocNumberService;
import com.bass.amed.service.StorageService;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
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
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

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


    @RequestMapping(value = "/removeFile", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeFile(@RequestParam("relativeFolder") String relativeFolder) throws CustomException
    {
        logger.debug("Remove files for folder=" + relativeFolder);
        storageService.remove(relativeFolder);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/view-distribution-disposition", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewDistributionDisposition(@RequestParam(value = "nrDoc") String nrDoc) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
            String classPathWithoutJRXML = res.getFile().getAbsolutePath();
            res = resourceLoader.getResource("layouts\\distributionDisposition.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<DistributionDispositionDTO> dataList = new ArrayList();
            DistributionDispositionDTO obj = new DistributionDispositionDTO();
            obj.setDispositionDate(Calendar.getInstance().getTime());
            obj.setNrDisposition(nrDoc);
            obj.setPath(classPathWithoutJRXML);
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
                .header("Content-Disposition", "inline; filename=dd.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-bon-de-plata", method = RequestMethod.GET)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlata(@RequestParam(value = "requestId") Integer requestId) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
            String classPathWithoutJRXML = res.getFile().getAbsolutePath();
            res = resourceLoader.getResource("layouts\\distributionDisposition.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<DistributionDispositionDTO> dataList = new ArrayList();
            DistributionDispositionDTO obj = new DistributionDispositionDTO();
            obj.setDispositionDate(Calendar.getInstance().getTime());
            obj.setNrDisposition("1");
            obj.setPath(classPathWithoutJRXML);
            dataList.add(obj);

            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(requestId);

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            for (PaymentOrdersEntity order : details)
            {
                order.setDate(now);
                order.setNumber(String.valueOf(seq.getId()));
                paymentOrderRepository.save(order);
            }
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dd.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-bon-de-plata-one", method = RequestMethod.GET)
    @Transactional
    public ResponseEntity<byte[]> viewBonDePlataOne(@RequestParam(value = "paymentOrderId") Integer paymentOrderId) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
            String classPathWithoutJRXML = res.getFile().getAbsolutePath();
            res = resourceLoader.getResource("layouts\\distributionDisposition.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<DistributionDispositionDTO> dataList = new ArrayList();
            DistributionDispositionDTO obj = new DistributionDispositionDTO();
            obj.setDispositionDate(Calendar.getInstance().getTime());
            obj.setNrDisposition("1");
            obj.setPath(classPathWithoutJRXML);
            dataList.add(obj);

            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);

            Optional<PaymentOrdersEntity> orderOpt = paymentOrderRepository.findById(paymentOrderId);
            PaymentOrdersEntity order = orderOpt.orElse(new PaymentOrdersEntity());

            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
            paymentOrderNumberRepository.save(seq);
            order.setDate(now);
            order.setNumber(String.valueOf(seq.getId()));
            paymentOrderRepository.save(order);

        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dd.pdf").body(bytes);
    }

    @RequestMapping(value = "/generate-distribution-disposition", method = RequestMethod.GET)
    public ResponseEntity<String> generateDistributionDisposition(@RequestParam(value = "nrCerere") String nrCerere) throws CustomException, IOException
    {
        logger.debug("Generate Distribution Disposition");

        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");

        List<DistributionDispositionDTO> dataList = new ArrayList();
        DistributionDispositionDTO obj = new DistributionDispositionDTO();
        obj.setDispositionDate(Calendar.getInstance().getTime());
        String nrDisposition = String.valueOf(generateDocNumberService.getDocumentNumber());
        obj.setNrDisposition(nrDisposition);
        obj.setPath(res.getFile().getAbsolutePath());
        dataList.add(obj);

        StringBuilder sb = new StringBuilder(folder);
        createRootPath(nrCerere, sb);
        sb.append("Dispozitie de distribuire Nr " + nrDisposition + ".pdf");

        storageService.storePDFFile(dataList, sb.toString(), "classpath:..\\resources\\layouts\\distributionDisposition.jrxml");

        return new ResponseEntity<>(sb.toString(), HttpStatus.OK);
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

            List<DistributionDispositionDTO> dataList = new ArrayList();
            DistributionDispositionDTO obj = new DistributionDispositionDTO();
            obj.setDispositionDate(Calendar.getInstance().getTime());
            obj.setNrDisposition(nrDocument);
            obj.setPath(res.getFile().getAbsolutePath());
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
                .header("Content-Disposition", "inline; filename=request.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-medicament-authorization-certificate", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewMedicamentAuthorizationCertificate(@RequestParam(value = "nrDocument") String nrDocument) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();

            Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts\\medicamentAuthorizationCertificate.jrxml");
            JasperReport report = JasperCompileManager.compileReport(new FileInputStream(res.getFile()));

            List<DistributionDispositionDTO> dataList = new ArrayList();
            DistributionDispositionDTO obj = new DistributionDispositionDTO();
            obj.setDispositionDate(Calendar.getInstance().getTime());
            obj.setNrDisposition(nrDocument);
            obj.setPath(res.getFile().getAbsolutePath());
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
                .header("Content-Disposition", "inline; filename=request.pdf").body(bytes);
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
//        try
//        {
//            ResourceLoader resourceLoader = new DefaultResourceLoader();
//            Resource res = resourceLoader.getResource("classpath:..\\resources\\layouts");
//            String classPathWithoutJRXML = res.getFile().getAbsolutePath();
//            res = resourceLoader.getResource("layouts\\distributionDisposition.jrxml");
//            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());
//
//            List<DistributionDispositionDTO> dataList = new ArrayList();
//            DistributionDispositionDTO obj = new DistributionDispositionDTO();
//            obj.setDispositionDate(Calendar.getInstance().getTime());
//            obj.setNrDisposition("1");
//            obj.setPath(classPathWithoutJRXML);
//            dataList.add(obj);
//
//            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
//            JasperPrint jasperPrint = JasperFillManager.fillReport(report, null, beanColDataSource);
//            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
//
//            List<PaymentOrdersEntity> details = paymentOrderRepository.findByregistrationRequestId(requestId);
//
//            Timestamp now = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
//            PaymentOrderNumberSequence seq = new PaymentOrderNumberSequence();
//            paymentOrderNumberRepository.save(seq);
//            for (PaymentOrdersEntity order : details)
//            {
//                order.setDate(now);
//                order.setNumber(String.valueOf(seq.getId()));
//                paymentOrderRepository.save(order);
//            }
//        }
//        catch (Exception e)
//        {
//            throw new CustomException(e.getMessage());
//        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=dd.pdf").body(bytes);
    }
	
	
	@Transactional
    @RequestMapping(value = "/save-docs", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> saveDocuments(@RequestBody List<DocumentsEntity> documents)
    {
        try {
            documentsRepository.saveAll(documents);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.CREATED);
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
