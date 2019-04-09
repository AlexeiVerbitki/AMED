package com.bass.amed.controller.rest.prices;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.PrevYearAvgPriceDTO;
import com.bass.amed.dto.prices.evaluation.*;
import com.bass.amed.dto.prices.registration.annexes.MedicineDataForAnnex2;
import com.bass.amed.dto.prices.registration.annexes.MedicineDataForAnnex3;
import com.bass.amed.dto.prices.registration.annexes.MedicineInfoForAnnex1;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.repository.prices.*;
import com.bass.amed.service.PriceEvaluationService;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;


@Slf4j
@RestController
@RequestMapping("/api/price-docs")
public class PriceDocsController {
    private static final Logger logger = LoggerFactory.getLogger(PriceDocsController.class);

    @Autowired
    PricesManagementRepository pricesManagementRepository;

    @Autowired
    ManufactureRepository manufactureRepository;

    @Autowired
    private PriceEvaluationService priceEvaluationService;

    @Autowired
    private PrevYearsPriceAVGInvoiceDetailsRepository prevYearsPriceAVGInvoiceDetailsRepository;

    @Autowired
    private SysParamsRepository sysParamsRepository;

    JasperReport createReport(String resourcePath) throws IOException, JRException {

        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource res = resourceLoader.getResource(resourcePath);
        return JasperCompileManager.compileReport(res.getInputStream());
    }

    @RequestMapping(value = "/view-approval-order", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewApprovalOrder()
    {
        byte[] bytes = null;

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nr", "_____________________");
        parameters.put("date", "_____________________");
        parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

        JasperReport report;
        try {

            report = createReport("layouts/module3/Autorizare pret ordin autorizare.jrxml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=approvalOrder.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-anexa1", method = RequestMethod.GET)
    public ResponseEntity<byte[]> viewAnexa1()
    {
        List<MedicineInfoForAnnex1> anex1List = priceEvaluationService.getPricesForApproval();

        byte[] bytes = null;

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("registrationNumber", "_____________________");
        parameters.put("registrationDate", "_____________________");

        JasperReport report;
        try {

            report = createReport("layouts/module3/Anexa1.jrxml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JRBeanCollectionDataSource(anex1List));

            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=Anexa1.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-anexa2", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAnexa2(@RequestBody List<MedicineDataForAnnex2> anex2List) throws CustomException
    {
        byte[] bytes = null;



        Map<String, Object> parameters = new HashMap<>();
        parameters.put("registrationNr", "_____________________");
        parameters.put("registrationDate",    "_____________________");
        parameters.put("dataSource", new JRBeanCollectionDataSource(anex2List));

        JasperReport report;
        try {

            report = createReport("layouts/module3/Anexa2.jrxml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=Anexa2.pdf").body(bytes);
    }


    @RequestMapping(value = "/view-anexa3", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAnexa3(@RequestBody List<MedicineDataForAnnex3> anex3List) throws CustomException
    {
        byte[] bytes = null;

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("registrationNumber", "_____________________");
        parameters.put("date",    "_____________________");
        parameters.put("annex3DataSource", new JRBeanCollectionDataSource(anex3List));

        JasperReport report;
        try {

            report = createReport("layouts/module3/Anexa3.jrxml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=Anexa2.pdf").body(bytes);
    }


    @RequestMapping(value = "/view-evaluation-sheet", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewEvaluationSheet(@RequestBody FisaDeEvaluare fisaDeEvaluare) throws CustomException
    {
        byte[] bytes = null;
        List<PrevYearAvgPriceDTO> previousYearsPrices = null;
        try {
            Integer medicamentId = fisaDeEvaluare.getMedicamentClaimedPriceList().get(0).getId();
            previousYearsPrices = prevYearsPriceAVGInvoiceDetailsRepository.getPreviousYearsImportPriceAVG(medicamentId);
        } catch (Exception e) {
            logger.error(e.getMessage());
            previousYearsPrices = new ArrayList<>();
        }

        Map<String, Object> parameters = new HashMap<>();
        TreeMap<Integer, Double> fisaDeEv15Map = new TreeMap<>();// getFisaDeEvaluare15Map();

        previousYearsPrices.forEach(p -> {
            fisaDeEv15Map.put(p.getYear(), p.getAvgPrice());
        });

        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");

        parameters.put("nr", "__________________________");
        parameters.put("date", "__________________________");
        parameters.put("cimOwner", fisaDeEvaluare.getCimOwner());
        parameters.put("countryOwner", fisaDeEvaluare.getCountryOwner());
        parameters.put("manufacturer", fisaDeEvaluare.getManufacturer());
        parameters.put("countryManufacturer", fisaDeEvaluare.getCountryManufacturer());
        parameters.put("applicationDate", sdf.format(fisaDeEvaluare.getApplicationDate()));
        parameters.put("fisaDeEvaluare4", new JRBeanCollectionDataSource(fisaDeEvaluare.getMedicamentClaimedPriceList()));
        parameters.put("medicamentStatus", fisaDeEvaluare.getMedicamentStatus());
        parameters.put("fisaDeEvaluare6", new JRBeanCollectionDataSource(fisaDeEvaluare.getMedicamentOriginalPriceList()));
        parameters.put("averageRateEuro", fisaDeEvaluare.getAverageRateEuro());
        parameters.put("averageRateUsd", fisaDeEvaluare.getAverageRateUsd());
        parameters.put("fisaDeEvaluare8", new JRBeanCollectionDataSource(fisaDeEvaluare.getMedicamentReferenceCountryPriceList()));

        parameters.put("min1Mdl", fisaDeEvaluare.getMin1Mdl());
        parameters.put("min2Mdl", fisaDeEvaluare.getMin2Mdl());
        parameters.put("min3Mdl", fisaDeEvaluare.getMin3Mdl());
        parameters.put("medMdl", fisaDeEvaluare.getMedMdl());

        parameters.put("min1Eur", fisaDeEvaluare.getMin1Eur());
        parameters.put("min2Eur", fisaDeEvaluare.getMin2Eur());
        parameters.put("min3Eur", fisaDeEvaluare.getMin3Eur());
        parameters.put("medEur", fisaDeEvaluare.getMedEur());

        parameters.put("min1Usd", fisaDeEvaluare.getMin1Usd());
        parameters.put("min2Usd", fisaDeEvaluare.getMin2Usd());
        parameters.put("min3Usd", fisaDeEvaluare.getMin3Usd());
        parameters.put("medUsd", fisaDeEvaluare.getMedUsd());

        parameters.put("fisaDeEvaluare10", new JRBeanCollectionDataSource(fisaDeEvaluare.getPreviousPriceRegistrations()));
        parameters.put("fisaDeEvaluare11", new JRBeanCollectionDataSource(fisaDeEvaluare.getOriginCountryMedicamentPriceList()));
        parameters.put("fisaDeEvaluare12", new JRBeanCollectionDataSource(fisaDeEvaluare.getMinimalPricesAverages()));
        parameters.put("fisaDeEvaluare13", new JRBeanCollectionDataSource(fisaDeEvaluare.getSimilarRegisteredMedicaments()));
        parameters.put("fisaDeEvaluare14", new JRBeanCollectionDataSource(fisaDeEvaluare.getSourceAveragePrices()));// fisaDeEvaluare14); sourceAveragePrices
        parameters.put("fisaDeEvaluare15", new JRBeanCollectionDataSource(fisaDeEv15Map.entrySet()));
        parameters.put("expertName",       "_______________________");// fisaDeEvaluare.getExpertName());
        parameters.put("creationFileDate", "_______________________");//sdf.format(fisaDeEvaluare.getCreationFileDate()));
        parameters.put("chiefSectionName", "_______________________");//fisaDeEvaluare.getChiefSectionName());

        JasperReport report;
        try {

            report = createReport("layouts/module3/Fisa de evaluare.jrxml");
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=evaluationSheet.pdf").body(bytes);
    }
}
