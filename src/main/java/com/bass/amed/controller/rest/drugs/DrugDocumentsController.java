package com.bass.amed.controller.rest.drugs;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.drugs.AuthorizedSubstancesDetails;
import com.bass.amed.dto.drugs.DrugDecisionsDetailsDTO;
import com.bass.amed.entity.DrugImportExportDetailsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.SysParamsRepository;
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

@RestController
@RequestMapping("/api/documents")
public class DrugDocumentsController {

    private static final Logger logger = LoggerFactory.getLogger(DrugDocumentsController.class);

    @Autowired
    private SysParamsRepository sysParamsRepository;

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

            Resource res = resourceLoader.getResource("layouts\\AutorizatieImportExportStupefiantePsihotropePrecursorilorRo.jrxml");
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
            setImportExportDetails(data, parameters);
            setSubstanceDetails(data, parameters);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=activityImportExportAuthorization.pdf").body(bytes);

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
        if (data.getState() != null && !data.getState().isEmpty()) {
            if (data.getCompanyValue() != null && !data.getCompanyValue().isEmpty()) {
                releasedFor.append(", ");
            }
            releasedFor.append(data.getState());
        }
        if (data.getLocality() != null && !data.getLocality().isEmpty()) {
            releasedFor.append(", ");
            releasedFor.append(data.getLocality());
        }
        if (data.getStreet() != null && !data.getStreet().isEmpty()) {
            releasedFor.append(", ");
            releasedFor.append(data.getStreet());
        }

        return releasedFor.toString();
    }

    private String geInstituteAndAddressParam(DrugDecisionsDetailsDTO data) {
        StringBuilder instituteAndAddress = new StringBuilder(data.getLocality());
        if (data.getStreet() != null && !data.getStreet().isEmpty()) {
            if (data.getLocality() != null && !data.getLocality().isEmpty()) {
                instituteAndAddress.append(", ");
            }
            instituteAndAddress.append(data.getStreet());
        }

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
            List<AuthorizedSubstancesDetails> authorizedSubstancesDetails = new ArrayList<>();

            for (DrugImportExportDetailsEntity substanceDetails : data.getDetails()) {

                AuthorizedSubstancesDetails details = new AuthorizedSubstancesDetails();
                if (substanceDetails.getSubstanceName() != null) {
                    details.setActiveSubstance(substanceDetails.getSubstanceName());
                }
                details.setQuantityActiveSubstance(String.valueOf(substanceDetails.getAuthorizedQuantity()) + substanceDetails.getAuthorizedQuantityUnit());
                setMedicamentDetails(authorizedSubstancesDetails, details, substanceDetails);

            }

            JRBeanCollectionDataSource autorizationImportExportDataSetJRBean = new JRBeanCollectionDataSource(authorizedSubstancesDetails);
            parameters.put("autorizationImportExportDataSet", autorizationImportExportDataSetJRBean);
        }
    }

    private void setMedicamentDetails(List<AuthorizedSubstancesDetails> authorizedSubstancesDetails, AuthorizedSubstancesDetails details, DrugImportExportDetailsEntity substanceDetails) {
        if (substanceDetails.getCommercialName() != null) {
            details.setMedicamentName(substanceDetails.getCommercialName());
        }
        if (substanceDetails.getPackaging() != null) {
            details.setQuantity(substanceDetails.getPackaging());
        }
        if (substanceDetails.getPackagingQuantity() != null) {
            details.setUm(substanceDetails.getPackagingQuantity());
        }
        authorizedSubstancesDetails.add(details);
    }
}
