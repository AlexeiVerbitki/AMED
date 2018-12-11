package com.bass.amed.controller.rest.prices;

import com.bass.amed.dto.prices.evaluation.*;
import com.bass.amed.dto.prices.registration.annexes.MedicineInfoForAnnex1;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.CurrencyHistoryRepository;
import com.bass.amed.repository.CurrencyRepository;
import com.bass.amed.repository.DocumentsRepository;
import com.bass.amed.repository.ManufactureRepository;
import com.bass.amed.repository.prices.*;
import com.bass.amed.service.PriceEvaluationService;
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
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;


@RestController
@RequestMapping("/api/price-docs")
public class PriceDocsController {
    private static final Logger logger = LoggerFactory.getLogger(PriceDocsController.class);

    @Autowired
    private CurrencyRepository currencyRepository;

    @Autowired
    private CurrencyHistoryRepository currencyHistoryRepository;

    @Autowired
    private PriceExpirationReasonRepository priceExpirationReasonRepository;

    @Autowired
    private PriceTypesRepository priceTypesRepository;

    @Autowired
    PricesManagementRepository pricesManagementRepository;

    @Autowired
    ManufactureRepository manufactureRepository;

    @Autowired
    private PriceRepository priceRepository;

    @Autowired
    private NmPricesRepository nmPricesRepository;

    @Autowired
    private PricesHistoryRepository pricesHistoryRepository;

    @Autowired
    private PriceEvaluationService priceEvaluationService;

    @Autowired
    private PricesEvaluationRepository pricesEvaluationRepository;

    @Autowired
    private DocumentsRepository documentsRepository;


    JasperReport createReport(String resourcePath) throws IOException, JRException {

        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource res = resourceLoader.getResource(resourcePath);
        return JasperCompileManager.compileReport(res.getInputStream());
    }

    @RequestMapping(value = "/view-anexa1", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAnexa1(@RequestBody List<MedicineInfoForAnnex1> anex1List) throws CustomException
    {
        byte[] bytes = null;

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("registrationNumber ", "A07.PS-01.Rg04-277");
        parameters.put("registrationDate", new Date());

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


    @RequestMapping(value = "/view-evaluation-sheet", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewEvaluationSheet(@RequestBody FisaDeEvaluare fisaDeEvaluare) throws CustomException
    {
        byte[] bytes = null;

        //todo: previousYearsPrices
        // 15. Preţul mediu de import pentru anii precedenţi, în caz că acesta a fost importat (Se completează pentru medicamentele care nu se regăsesc în ţările de referinţă)

        Map<String, Object> parameters = new HashMap<>();
        TreeMap<Integer, Double> fisaDeEv15Map = getFisaDeEvaluare15Map();
        JRBeanCollectionDataSource fisaDeEvaluare15 = new JRBeanCollectionDataSource(fisaDeEv15Map.entrySet());

        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");

        parameters.put("nr", "A07.PS-01.Rg04-277");
        parameters.put("date", new Date());
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
        parameters.put("fisaDeEvaluare14", new JRBeanCollectionDataSource(fisaDeEvaluare.getSourceAveragePrices().entrySet()));// fisaDeEvaluare14); sourceAveragePrices
        parameters.put("fisaDeEvaluare15", new JRBeanCollectionDataSource(fisaDeEvaluare.getPreviousYearsPrices().entrySet()));
        parameters.put("expertName", fisaDeEvaluare.getExpertName());
        parameters.put("creationFileDate", sdf.format(fisaDeEvaluare.getCreationFileDate()));
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


    private static TreeMap<Integer, Double> getFisaDeEvaluare15Map() {
        TreeMap<Integer, Double> map = new TreeMap<Integer, Double>();
        map.put(2008, 41.09);
        map.put(2009, 42.02);
        map.put(2010, 42.13);
        map.put(2011, 42.56);
        map.put(2012, 42.49);
        map.put(2013, 42.721);
        map.put(2014, 42.81);
        map.put(2015, 42.83);
        map.put(2016, 42.91);
        map.put(2017, 43.01);
        return map;
    }

}
