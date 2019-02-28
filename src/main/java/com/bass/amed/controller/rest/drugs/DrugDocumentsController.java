package com.bass.amed.controller.rest.drugs;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.drugs.AuthorizedSubstancesDetails;
import com.bass.amed.dto.drugs.DrugDecisionsDetailsDTO;
import com.bass.amed.entity.DrugImportExportDetailsEntity;
import com.bass.amed.entity.DrugImportExportEntity;
import com.bass.amed.entity.NmUnitsOfMeasurementEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.SysParamsRepository;
import com.bass.amed.repository.UnitsOfMeasurementRepository;
import com.bass.amed.utils.AmountUtils;
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

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DrugDocumentsController {

    private static final Logger logger = LoggerFactory.getLogger(DrugDocumentsController.class);

    @Autowired
    private SysParamsRepository sysParamsRepository;
    @Autowired
    private UnitsOfMeasurementRepository unitsOfMeasurementRepository;

    @RequestMapping(value = "/view-authorization-data", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAuthorizationData(@RequestBody DrugDecisionsDetailsDTO data) throws CustomException {
        byte[] bytes = null;
        try {

            logger.debug("Generate authorization document...");

            ResourceLoader resourceLoader = new DefaultResourceLoader();

            Resource res = resourceLoader.getResource("layouts\\AutorizatieSubstanţelorStupefiantePsihotropePrecursorilor.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            Map<String, Object> parameters = new HashMap<>();
            setFormsCommonDetails(data, parameters);
            parameters.put("releasedFor", getReleasedForParam(data));
            parameters.put("instituteAndAddress", geInstituteAndAddressParam(data));
            if (data.getResPerson() != null) {
                parameters.put("responsibility", data.getResPerson());
                parameters.put("headTeacher", data.getResPerson());
            }
            parameters.put("substance", geSubstanceParam(data));
            if (data.getDataExp() != null) {
                parameters.put("ValidUntil", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date(data.getDataExp().getTime())));
            } else {
                parameters.put("ValidUntil", "");
            }

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=activityAuthorization.pdf").body(bytes);
    }

    @RequestMapping(value = "/view-import-export-authorization-data", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewImportExportAuthorizationData(@RequestBody DrugDecisionsDetailsDTO data) throws CustomException {

        byte[] bytes = null;
        try {

            logger.debug("Generate import export document...");

            ResourceLoader resourceLoader = new DefaultResourceLoader();

            Resource res = null;
            if (data.getLanguage() == 0)
            {
                res = resourceLoader.getResource("layouts\\AutorizatieImportExportStupefiantePsihotropePrecursorilorRo.jrxml");
            }
            else if (data.getLanguage() == 1)
            {
                res = resourceLoader.getResource("layouts\\AutorizatieImportExportStupefiantePsihotropePrecursorilorRu.jrxml");
            }
            else if(data.getLanguage() == 2)
            {
                res = resourceLoader.getResource("layouts\\AutorizatieImportExportStupefiantePsihotropePrecursorilorEn.jrxml");
            }
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            Map<String, Object> parameters = new HashMap<>();
            setFormsCommonDetails(data, parameters);
            parameters.put("customs", data.getCustom());
            parameters.put("importExport", data.getAuthorizationType().toLowerCase());
            if (data.getDataExp() != null) {
                parameters.put("validUntil", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date(data.getDataExp().getTime())));
            } else {
                parameters.put("validUntil", "");
            }
            parameters.put("usedScoupe", data.isUsedScoupe());
            setImportExportDetails(data, parameters);
            setSubstanceDetails(data, parameters);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=activityImportExportAuthorization.pdf").body(bytes);

    }



    @RequestMapping(value = "/view-scrisoare-de-refuz", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewScrisoareDeRefuz(@RequestBody DrugDecisionsDetailsDTO data) throws CustomException {
        byte[] bytes = null;
        try {

            logger.debug("Generate scrisoare de refuz document...");

            ResourceLoader resourceLoader = new DefaultResourceLoader();

            Resource res = resourceLoader.getResource("layouts\\ScrisoareDeRefuz.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            Map<String, Object> parameters = new HashMap<>();
            setFormsCommonDetails(data, parameters);
            parameters.put("solicitant", data.getResPerson());
            parameters.put("solicitantAddress", data.getLegalAddress());
            parameters.put("requestNr", data.getRequestNumber());
            parameters.put("requestDescription", "Autorizaţia de activitate cu utilizarea obiectivelor şi încăperilor legate de circulaţia substanţelor stupefiante, psihotrope şi a precursorilor");
            parameters.put("requestDate", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date(data.getRequestDate().getTime())));
            parameters.put("reason", data.getRejectReason() == null ? "" : data.getRejectReason());
            parameters.put("responsablePerson", data.getSignPerson());
            parameters.put("date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date()));
            parameters.put("agencyName", "Medicines and Medical Devices Agency - Agenţia Medicamentului şi Dispozitivelor Medicale , Agenţia Medicamentului şi Dispozitivelor Medicale");

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), e);
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=scrisoareDeRefuz.pdf").body(bytes);
    }


    private void setFormsCommonDetails(DrugDecisionsDetailsDTO data, Map<String, Object> parameters) {
        parameters.put("nr", data.getRequestNumber());
        if (data.getProtocolDate() != null) {
            parameters.put("date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date(data.getProtocolDate().getTime())));
        }
        parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
        parameters.put("druggist", sysParamsRepository.findByCode(Constants.SysParams.FARMACIST_CPCD).get().getValue());
        parameters.put("committeeChairman", sysParamsRepository.findByCode(Constants.SysParams.PRESEDINTE_CPCD).get().getValue());
    }

    private String getReleasedForParam(DrugDecisionsDetailsDTO data) {
        StringBuilder releasedFor = new StringBuilder(data.getCompanyValue());
        releasedFor.append(", ").append(data.getLegalAddress());
        return releasedFor.toString();
    }

    private String geInstituteAndAddressParam(DrugDecisionsDetailsDTO data) {
        StringBuilder instituteAndAddress = new StringBuilder(data.getState());
        instituteAndAddress.append(", ").append(data.getLocality()).append(", ");
        instituteAndAddress.append(data.getStreet());

        return instituteAndAddress.toString();
    }

    private String geSubstanceParam(DrugDecisionsDetailsDTO data) {
        StringBuilder substance = new StringBuilder();

        boolean precursor = data.isPrecursor();
        boolean psihotrop = data.isPsihotrop();
        boolean stupefiant = data.isStupefiant();

        if (precursor && !psihotrop && !stupefiant) {
            substance.append("precursorilor");
        } else if (!precursor && psihotrop && !stupefiant) {
            substance.append("psihotrope");
        } else if (!precursor && !psihotrop && stupefiant) {
            substance.append("stupefiante");
        } else if (precursor && psihotrop && !stupefiant) {
            substance.append("psihotrope și precursorilor");
        } else if (precursor && !psihotrop && stupefiant) {
            substance.append("stupefiante și precursorilor");
        } else if (!precursor && psihotrop && stupefiant) {
            substance.append("stupefiante si psihotrope");
        } else if (precursor && psihotrop && stupefiant) {
            substance.append("stupefiante, psihotrope și precursorilor");
        }

        return substance.toString();
    }

    private void setImportExportDetails(DrugDecisionsDetailsDTO data, Map<String, Object> parameters) {
        if (data.getAuthorizationType() != null && !data.getAuthorizationType().isEmpty()) {
            if (data.getAuthorizationType().equals("Import")) {
                parameters.put("importer", data.getCompanyValue());
                parameters.put("exporter", data.getPartner());
            } else {
                parameters.put("exporter", data.getCompanyValue());
                parameters.put("importer", data.getPartner());
            }
        }
    }

    private void setSubstanceDetails(DrugDecisionsDetailsDTO data, Map<String, Object> parameters) {
        if (data.getDetails() != null && !data.getDetails().isEmpty()) {
            List<NmUnitsOfMeasurementEntity> rs = unitsOfMeasurementRepository.findAll();
            List<AuthorizedSubstancesDetails> authorizedSubstancesDetails = new ArrayList<>();

            for (DrugImportExportEntity subst : data.getDetails()) {

                AuthorizedSubstancesDetails details = new AuthorizedSubstancesDetails();

                //set main details
                setMedicamentDetails(authorizedSubstancesDetails, details, subst, rs);


                //set detailed list

                details.setActiveSubstance(subst.getDetails().stream().map(r -> r.getAuthorizedDrugSubstance().getSubstanceName()).collect(Collectors.joining(",\n")));

                String result = subst.getDetails().stream().map(hh -> hh.getAuthorizedQuantity() + rs.stream().filter(k -> k.getCode().equals(hh.getAuthorizedQuantityUnitCode())).findFirst().get().getDescription()).collect(Collectors.joining(",\n"));

                details.setQuantityActiveSubstance(result);


            }

            JRBeanCollectionDataSource autorizationImportExportDataSetJRBean = new JRBeanCollectionDataSource(authorizedSubstancesDetails);
            parameters.put("autorizationImportExportDataSet", autorizationImportExportDataSetJRBean);
        }
    }

    private void setMedicamentDetails(List<AuthorizedSubstancesDetails> authorizedSubstancesDetails, AuthorizedSubstancesDetails details, DrugImportExportEntity substanceDetails, List<NmUnitsOfMeasurementEntity> rs) {
        if (substanceDetails.getCommercialName() != null) {
            details.setMedicamentName(substanceDetails.getCommercialName()+ " (" + substanceDetails.getPackaging() + ")");
        }
        if (substanceDetails.getPackaging() != null) {
            details.setQuantity(String.valueOf(AmountUtils.round(substanceDetails.getPackagingQuantity(), 2)));
        }
        if (substanceDetails.getPackagingQuantity() != null) {
            details.setUm( rs.stream().filter(k -> k.getCode().equals(substanceDetails.getRequestQuantityUnitCode())).findFirst().get().getDescription());
        }
        authorizedSubstancesDetails.add(details);
    }
}
