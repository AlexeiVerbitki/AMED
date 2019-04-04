package com.bass.amed.controller.rest.gdp;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.gdp.GDPAccompanyingLetterDTO;
import com.bass.amed.dto.gdp.GDPCertificateDTO;
import com.bass.amed.dto.gdp.GDPOrderDTO;
import com.bass.amed.dto.gmp.GMPAuthorizationDetailsDTO;
import com.bass.amed.dto.gmp.GMPFilterDTO;
import com.bass.amed.entity.GMPAuthorizationsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.GMPAuthorizationsRepository;
import com.bass.amed.repository.ManufactureRepository;
import com.bass.amed.repository.SysParamsRepository;
import com.bass.amed.repository.prices.PricesManagementRepository;
import com.bass.amed.utils.GMPQueryUtils;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@RestController
@RequestMapping("/api/gdp")
public class GDPController
{
    @Autowired
    PricesManagementRepository pricesManagementRepository;
    @Autowired
    ManufactureRepository manufactureRepository;
    @Autowired
    private SysParamsRepository sysParamsRepository;
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    private GMPAuthorizationsRepository gmpAuthorizationsRepository;


    @RequestMapping(value = "/accompanying-letter", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewAccompanyingLetter(@RequestBody GDPAccompanyingLetterDTO gdpAccompanyingLetterDTO)
    {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nr", gdpAccompanyingLetterDTO.getNr());
        parameters.put("date", gdpAccompanyingLetterDTO.getDate());
        parameters.put("companyAddress", gdpAccompanyingLetterDTO.getCompanyAddress());
        parameters.put("companyName", gdpAccompanyingLetterDTO.getCompanyName());
        parameters.put("companyDirector", gdpAccompanyingLetterDTO.getCompanyDirector());
        parameters.put("companyEmail", gdpAccompanyingLetterDTO.getCompanyEmail());
        parameters.put("inspectPeriod", gdpAccompanyingLetterDTO.getInspectPeriod());
        parameters.put("anex", gdpAccompanyingLetterDTO.getAnex());
        parameters.put("distributionAddress", gdpAccompanyingLetterDTO.getDistributionAddress());
        parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
        return generateDoc("layouts/Scrisoare_insotire RI.jrxml", parameters);
    }


    @RequestMapping(value = "/gdp-certificate", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewGDPCertificate(@RequestBody GDPCertificateDTO gdpCertificateDTO)
    {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nr", gdpCertificateDTO.getNr());
        parameters.put("date", gdpCertificateDTO.getDate());
        parameters.put("wholesaleDistributor", gdpCertificateDTO.getWholesaleDistributor());
        parameters.put("distributionAddress", gdpCertificateDTO.getDistributionAddress());
        parameters.put("inspectingInBase", gdpCertificateDTO.getInspectingInBase());
        parameters.put("licenseSeries", gdpCertificateDTO.getLicenseSeries());
        parameters.put("licenseNr", gdpCertificateDTO.getLicenseNr());
        parameters.put("licenseStartDate", gdpCertificateDTO.getLicenseStartDate());
        parameters.put("licenseEndDate", gdpCertificateDTO.getLicenseEndDate());
        parameters.put("autorizatedDistribution", gdpCertificateDTO.getAutorizatedDistribution());
        parameters.put("certificateBasedOnTheInspection", gdpCertificateDTO.getCertificateBasedOnTheInspection());
        parameters.put("lastInspectionDate", gdpCertificateDTO.getLastInspectionDate());
        parameters.put("dateOfIssueCertificate", gdpCertificateDTO.getDateOfIssueCertificate());
        parameters.put("maximYearAfterInspection", gdpCertificateDTO.getMaximYearAfterInspection());
        parameters.put("restriction", gdpCertificateDTO.getRestriction());
        parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
        return generateDoc("layouts/GDP certificat.jrxml", parameters);
    }

    @RequestMapping(value = "/gdp-order", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewGDPOrder(@RequestBody GDPOrderDTO gdpOrderDTO)
    {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nr", gdpOrderDTO.getNr());
        parameters.put("date", gdpOrderDTO.getDate());
        parameters.put("gdpBeginDate", gdpOrderDTO.getGdpBeginDate());
        parameters.put("companyAddress", gdpOrderDTO.getCompanyAddress());
        parameters.put("requestNr", gdpOrderDTO.getRequestNr());
        parameters.put("requestDate", gdpOrderDTO.getRequestDate());
        parameters.put("companyName", gdpOrderDTO.getCompanyName());
        parameters.put("registeredLetterNr", gdpOrderDTO.getRegisteredLetterNr());
        parameters.put("registeredLetterDate", gdpOrderDTO.getRegisteredLetterDate());
        parameters.put("expertsLeader", gdpOrderDTO.getExpertsLeader());
        parameters.put("expertsLeaderFuncion", gdpOrderDTO.getExpertsLeaderFuncion());
        parameters.put("expertsLeaderInspectorat", gdpOrderDTO.getExpertsLeaderInspectorat());
        parameters.put("inspectorsNameFunction", gdpOrderDTO.getInspectorsNameFunction());//new JRBeanCollectionDataSource(gdpOrderDTO.getExpertsDataset()));
        parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());
        return generateDoc("layouts/GDP Ordin.jrxml", parameters);
    }

    public ResponseEntity<byte[]> generateDoc(String templatePath, Map<String, Object> parameters)
    {
        byte[] bytes = null;

        JasperReport report;
        try
        {
            report = createReport(templatePath);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());

            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        }
        catch (JRException e)
        {
            e.printStackTrace();
        }
        catch (FileNotFoundException e)
        {
            e.printStackTrace();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=Anexa2.pdf").body(bytes);
    }


    JasperReport createReport(String resourcePath) throws IOException, JRException
    {

        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource res = resourceLoader.getResource(resourcePath);
        return JasperCompileManager.compileReport(res.getInputStream());
    }

    @PostMapping(value = "/gmp-authorisations-by-filter")
    public ResponseEntity<List<GMPAuthorizationDetailsDTO>> getGMPDetailsByFilter(@RequestBody GMPFilterDTO filter) throws CustomException
    {
        LOGGER.debug("get GMP authorisations by filter");

        EntityManager em = null;
        List<GMPAuthorizationDetailsDTO> result = new ArrayList<>();
        List<GMPAuthorizationDetailsDTO> response = new ArrayList<>();
        try
        {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            StringBuilder queryString = GMPQueryUtils.createQuery(filter);
            Query query = em.createNativeQuery(queryString.toString(), GMPAuthorizationDetailsDTO.class);
            GMPQueryUtils.updateQueryWithValues(filter, query);
            result = query.getResultList();
            if(!Boolean.TRUE.equals(filter.getSearchCertificates()))
            {
                Map<String, List<GMPAuthorizationDetailsDTO>> authorizationsEntityMap = result.stream().collect(Collectors.groupingBy(GMPAuthorizationDetailsDTO::getAuthorizationNumber));
                for (List<GMPAuthorizationDetailsDTO> list : authorizationsEntityMap.values())
                {
                    GMPAuthorizationDetailsDTO auth = Collections.max(list, Comparator.comparing(c -> c.getFromDate()));
                    auth.setIsAuthorization(true);
                    GMPAuthorizationDetailsDTO gmp = new GMPAuthorizationDetailsDTO();
                    gmp.assign(auth);
                    response.add(gmp);
                }
            }
            if(!Boolean.TRUE.equals(filter.getSearchAuthorizations()))
            {
                Map<String, List<GMPAuthorizationDetailsDTO>> certificatesMap = result.stream().collect(Collectors.groupingBy(GMPAuthorizationDetailsDTO::getCertificateNumber));
                for (List<GMPAuthorizationDetailsDTO> list : certificatesMap.values())
                {
                    GMPAuthorizationDetailsDTO cert = Collections.max(list, Comparator.comparing(c -> c.getFromDate()));
                    cert.setIsAuthorization(false);
                    GMPAuthorizationDetailsDTO gmp = new GMPAuthorizationDetailsDTO();
                    gmp.assign(cert);
                    response.add(gmp);
                }
            }
            em.getTransaction().commit();
        }
        catch (Exception e)
        {
            if (em != null)
            {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage());
        }

        finally
        {
            em.close();
        }

        response.sort(Comparator.comparing(GMPAuthorizationDetailsDTO::getCompany).thenComparing(Comparator.comparing(GMPAuthorizationDetailsDTO::getIsAuthorization))
                .thenComparing(Comparator.comparing(GMPAuthorizationDetailsDTO::getId)));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping("/load-authorizations-history")
    public ResponseEntity<List<GMPAuthorizationsEntity>> loadAuthorizationsHistory(Integer companyId)
    {
        LOGGER.debug("Retrieve authorizations history by company id");
        List<GMPAuthorizationsEntity> result = new ArrayList<>();
        List<GMPAuthorizationsEntity> authorizations = gmpAuthorizationsRepository.findAllAuthorizationByCompanyId(companyId);
        Map<String, List<GMPAuthorizationsEntity>> authorizationsEntityMap = authorizations.stream().collect(Collectors.groupingBy(GMPAuthorizationsEntity::getAuthorizationNumber));
        for (List<GMPAuthorizationsEntity> list : authorizationsEntityMap.values())
        {
            result.add(Collections.max(list, Comparator.comparing(c -> c.getFromDate())));
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping("/load-certificates-history")
    public ResponseEntity<List<GMPAuthorizationsEntity>> loadCertificatesHistory(Integer companyId)
    {
        LOGGER.debug("Retrieve certificates history by company id");
        List<GMPAuthorizationsEntity> result = new ArrayList<>();
        List<GMPAuthorizationsEntity> certificates = gmpAuthorizationsRepository.findAllAuthorizationByCompanyId(companyId);
        Map<String, List<GMPAuthorizationsEntity>> certificatesEntityMap = certificates.stream().collect(Collectors.groupingBy(GMPAuthorizationsEntity::getCertificateNumber));
        for (List<GMPAuthorizationsEntity> list : certificatesEntityMap.values())
        {
            result.add(Collections.max(list, Comparator.comparing(c -> c.getFromDate())));
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
