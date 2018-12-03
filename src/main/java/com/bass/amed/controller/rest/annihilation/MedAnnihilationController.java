package com.bass.amed.controller.rest.annihilation;

import com.bass.amed.common.Constants;
import com.bass.amed.controller.rest.license.LicenseController;
import com.bass.amed.dto.annihilation.ActDeReceptieDTO;
import com.bass.amed.dto.annihilation.ProcesVerbal;
import com.bass.amed.entity.AnnihilationCommisionsEntity;
import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.repository.*;
import com.bass.amed.repository.annihilation.AnnihilationCommisionRepository;
import com.bass.amed.service.MedicamentAnnihilationRequestService;
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

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping( "/api/annihilation" )
public class MedAnnihilationController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(LicenseController.class);

    @Autowired
    private EconomicAgentsRepository economicAgentsRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private MedicamentAnnihilationRequestService medicamentAnnihilationRequestService;

    @Autowired
    private AnnihilationCommisionRepository annihilationRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;


    @RequestMapping(value = "/new-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextNewAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add annihilation" + request);

        Optional<NmEconomicAgentsEntity> eco = economicAgentsRepository.findById(request.getCompany().getId());

        if (!eco.isPresent())
        {
            throw new CustomException("Economic agent not found" + request.getCompany().getId());
        }

        request.setCompany(eco.get());

        request.setType(requestTypeRepository.findByCode("INMD").get());
        request.getMedicamentAnnihilation().setStatus("A");

        medicamentAnnihilationRequestService.saveAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }



    @RequestMapping(value = "/confirm-evaluate-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> confirmEvaluateAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Confirm annihilation" + request);
        medicamentAnnihilationRequestService.updateAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }


    @RequestMapping(value = "/next-evaluate-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextEvaluateAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Next evaluate annihilation" + request);
        medicamentAnnihilationRequestService.updateAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/finish-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> finishAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Finish annihilation" + request);
        medicamentAnnihilationRequestService.finishAnnihilation(request);

        return new ResponseEntity<>(request.getId(), HttpStatus.CREATED);
    }


    @RequestMapping(value = "/retrieve-annihilation-by-request-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RegistrationRequestsEntity> loadAnnihilationById(@RequestParam("id") String id) throws  CustomException
    {
        LOGGER.debug("Retrieve license by request id", id);
        RegistrationRequestsEntity r = medicamentAnnihilationRequestService.findMedAnnihilationRegistrationById(Integer.valueOf(id));
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @RequestMapping(value = "/retrieve-all-commisions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AnnihilationCommisionsEntity>> loadAllCommisions()
    {
        LOGGER.debug("Retrieve all commisions");
        return new ResponseEntity<>(annihilationRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/view-act-receptie", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewActReceptie(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module8/ActReceptie.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<ActDeReceptieDTO> dataList = new ArrayList();
            ActDeReceptieDTO obj = new ActDeReceptieDTO();
            obj.setNr(request.getRequestNumber());
            obj.setCompanyName(request.getCompany().getName());
            obj.setDate(new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format( request.getStartDate()));

            dataList.add(obj);

            List<ProcesVerbal> procesVerbals = new ArrayList<>();
            final AtomicInteger i = new AtomicInteger(1);

            request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(
                    m -> {
                        Optional<MedicamentEntity> med = medicamentRepository.findById(m.getMedicamentId());
                        if (med.isPresent())
                        {
                            ProcesVerbal p = new ProcesVerbal();
                            p.setNr(i.getAndIncrement());
                            p.setName(med.get().getCommercialName());
                            p.setDoza(String.valueOf(med.get().getDose()));
                            p.setForma(med.get().getPharmaceuticalForm().getDescription());
                            p.setSeria(med.get().getSerialNr());
                            p.setQuantity(String.valueOf(m.getQuantity()));
//                            p.setNotes(m.getNote());

                            procesVerbals.add(p);
                        }

                    }
            );


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(procesVerbals);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("anihilationDataSource", itemsJRBean);

            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=actDeReceptie.pdf").body(bytes);
    }


    @RequestMapping(value = "/view-proces-verbal", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewProcesVerbal(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource res = resourceLoader.getResource("layouts/module8/ProcesVerbal.jrxml");
            JasperReport report = JasperCompileManager.compileReport(res.getInputStream());

            List<ActDeReceptieDTO> dataList = new ArrayList();
            ActDeReceptieDTO obj = new ActDeReceptieDTO();
            obj.setNr(request.getRequestNumber());
            obj.setCompanyName(request.getCompany().getName());
            obj.setDate(new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format( request.getStartDate()));

            dataList.add(obj);

            List<ProcesVerbal> procesVerbals = new ArrayList<>();
            final AtomicInteger i = new AtomicInteger(1);

            request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(
                    m -> {
                        Optional<MedicamentEntity> med = medicamentRepository.findById(m.getMedicamentId());
                        if (med.isPresent())
                        {
                            ProcesVerbal p = new ProcesVerbal();
                            p.setNr(i.getAndIncrement());
                            p.setName(med.get().getCommercialName());
                            p.setDoza(String.valueOf(med.get().getDose()));
                            p.setForma(med.get().getPharmaceuticalForm().getDescription());
                            p.setSeria(med.get().getSerialNr());
                            p.setQuantity(String.valueOf(m.getQuantity()));
                            p.setMethodAnnihilation(m.getDestructionMethod());

                            procesVerbals.add(p);
                        }

                    }
            );


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(procesVerbals);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("anihilationDataSource", itemsJRBean);

            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        }
        catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=procesVerbal.pdf").body(bytes);
    }
}
