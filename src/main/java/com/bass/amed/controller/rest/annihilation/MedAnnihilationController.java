package com.bass.amed.controller.rest.annihilation;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.annihilation.*;
import com.bass.amed.entity.*;
import com.bass.amed.entity.sequence.SeqAnnihilationRegistrationNumberEntity;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.AnnihilationProjection;
import com.bass.amed.repository.*;
import com.bass.amed.repository.annihilation.AnnihilationCommisionRepository;
import com.bass.amed.repository.annihilation.AnnihilationDestroyMethodsRepository;
import com.bass.amed.repository.annihilation.SeqAnnihilationRegistrationNumberRepository;
import com.bass.amed.service.AnnihilationService;
import com.bass.amed.service.MedicamentAnnihilationRequestService;
import com.bass.amed.utils.AmountUtils;
import com.bass.amed.utils.Utils;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/annihilation")
public class MedAnnihilationController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(MedAnnihilationController.class);

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

    @Autowired
    private AnnihilationDestroyMethodsRepository annihilationDestroyMethodsRepository;

    @Autowired
    private SysParamsRepository sysParamsRepository;

    @Autowired
    private AnnihilationService annihilationService;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private PaymentOrderRepository paymentOrderRepository;
    @Autowired
    private SeqAnnihilationRegistrationNumberRepository seqAnnihilationRegistrationNumberRepository;


    @RequestMapping(value = "/new-annihilation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> nextNewAnnihilation(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        LOGGER.debug("Add annihilation" + request);

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
    public ResponseEntity<RegistrationRequestsEntity> loadAnnihilationById(@RequestParam("id") String id) throws CustomException
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


    @RequestMapping(value = "/retrieve-all-destruction-methods", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MedAnnihilationDestroyMethodsEntity>> loadAllDestructionMethods()
    {
        LOGGER.debug("Retrieve all destruction methods");
        return new ResponseEntity<>(annihilationDestroyMethodsRepository.findAll(), HttpStatus.OK);
    }


    @RequestMapping(value = "/get-filtered-annihilations", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AnnihilationProjection>> getLicenseByFilter(@RequestBody AnnihilationDTO filter)
    {
        LOGGER.debug("Get annihilations by filter: ", filter.toString());
        List<AnnihilationProjection> annihProjections = annihilationService.retrieveAnnihilationByFilter(filter);
        return new ResponseEntity<>(annihProjections, HttpStatus.OK);
    }


    @RequestMapping(value = "/find-annihilation-by-id", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MedicamentAnnihilationEntity> getAnnihilationById(@RequestParam("annihilationId") String annihilationId) throws CustomException
    {
        LOGGER.debug("Get annihilation by id: ", annihilationId);
        MedicamentAnnihilationEntity le = annihilationService.findAnnihilationById(Integer.valueOf(annihilationId));
        return new ResponseEntity<>(le, HttpStatus.OK);
    }


    @RequestMapping(value = "/view-act-receptie", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewActReceptie(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource       res            = resourceLoader.getResource("layouts/module8/ActReceptie.jrxml");
            JasperReport   report         = JasperCompileManager.compileReport(res.getInputStream());

            List<ActDeReceptieDTO> dataList = new ArrayList();
            ActDeReceptieDTO       obj      = new ActDeReceptieDTO();
            obj.setNr(request.getRequestNumber());
            obj.setCompanyName(economicAgentsRepository.findFirstByIdnoEquals(request.getMedicamentAnnihilation().getIdno()).get().getLongName());
            obj.setDate(new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(request.getStartDate()));
            obj.setAmedRepresentant(sysParamsRepository.findByCode(Constants.SysParams.NIMICIRE_DIRECTOR_SERVICE).get().getValue());
            obj.setRepresentatntName(request.getMedicamentAnnihilation().getFirstname() + ", " + request.getMedicamentAnnihilation().getLastname());

            dataList.add(obj);

            List<ProcesVerbal>  procesVerbals = new ArrayList<>();
            final AtomicInteger i             = new AtomicInteger(1);

            List<ReceiptsEntity> lst        = receiptRepository.findByPaymentOrderNumberIn(request.getPaymentOrders().stream().map(pm -> pm.getNumber()).collect(Collectors.toList()));
            String               date       = lst.stream().map(rc -> new SimpleDateFormat("dd/MM/yyyy").format(rc.getInsertDate())).collect(Collectors.joining(";\n"));
            String               nrIncasari = lst.stream().map(rc -> rc.getNumber()).collect(Collectors.joining(";\n"));


            request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(
                    m -> {
                        if (m.getMedicamentId() != null)
                        {
                            Optional<MedicamentEntity> med = medicamentRepository.findById(m.getMedicamentId());
                            if (med.isPresent())
                            {
                                ProcesVerbal p = new ProcesVerbal();
                                p.setNr(i.getAndIncrement());
                                p.setName(med.get().getCommercialName());
                                p.setDoza(med.get().getDose());
                                p.setForma(m.getPharmaceuticalForm().getDescription());
                                p.setSeria(m.getSeria());
                                p.setQuantity(String.valueOf(m.getQuantity()) + " " + String.valueOf(m.getUnitsOfMeasurement() != null ? m.getUnitsOfMeasurement().getDescription() : ""));
                                p.setNotes(m.getNote());
//                                p.setConfirmatoryDocuments(m.getConfirmativeDocuments());
                                p.setMethodAnnihilation(m.getDestructionMethod().getDescription());
                                p.setTaxNIM(String.valueOf(AmountUtils.round(m.getTax() * m.getQuantity(), 2)));
//                                p.setDate(date);
                                p.setPrimaryPackage(m.getPrimaryPackage());
                                p.setDocNr(nrIncasari);

                                procesVerbals.add(p);
                            }
                        } else
                        {
                            ProcesVerbal p = new ProcesVerbal();
                            p.setNr(i.getAndIncrement());
                            p.setName(m.getNotRegisteredName());
                            p.setDoza(m.getNotRegisteredDose());
                            p.setForma(m.getPharmaceuticalForm().getDescription());
                            p.setSeria(m.getSeria());
                            p.setQuantity(String.valueOf(m.getQuantity()) + " " + String.valueOf(m.getUnitsOfMeasurement() != null ? m.getUnitsOfMeasurement().getDescription() : ""));
                            p.setNotes(m.getNote());
//                            p.setConfirmatoryDocuments(m.getConfirmativeDocuments());
                            p.setMethodAnnihilation(m.getDestructionMethod().getDescription());
                            p.setTaxNIM(String.valueOf(AmountUtils.round(m.getTax() * m.getQuantity(), 2)));
//                            p.setDate(date);
                            p.setPrimaryPackage(m.getPrimaryPackage());
                            p.setDocNr(nrIncasari);

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
            JasperPrint                jasperPrint       = JasperFillManager.fillReport(report, parameters, beanColDataSource);
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e)
        {
            throw new CustomException(e.getMessage(), e);
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
            Resource       res            = resourceLoader.getResource("layouts/module8/ProcesVerbal.jrxml");
            JasperReport   report         = JasperCompileManager.compileReport(res.getInputStream());

            MedicamentAnnihilationInsitutionEntity      president = request.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions().stream().filter(f -> f.getPresident()).findFirst().orElse(null);
            Set<MedicamentAnnihilationInsitutionEntity> memberSet = request.getMedicamentAnnihilation().getMedicamentAnnihilationInsitutions().stream().filter(f -> !f.getPresident()).collect(Collectors.toSet());


            List<ProcessVerbalInfo> procesVerbals = new ArrayList<>();

            request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(
                    m -> {
                        if (m.getMedicamentId() != null)
                        {
                            Optional<MedicamentEntity> med = medicamentRepository.findById(m.getMedicamentId());
                            if (med.isPresent())
                            {
                                ProcessVerbalInfo p = new ProcessVerbalInfo();

                                p.setName(med.get().getCommercialName());
                                p.setDoza(med.get().getDose());
                                p.setForma(m.getPharmaceuticalForm().getDescription());
                                p.setSeria(m.getSeria());
                                p.setQuantity(String.valueOf(m.getQuantity()) + " " + String.valueOf(m.getUnitsOfMeasurement() != null ? m.getUnitsOfMeasurement().getDescription() : ""));
                                p.setMethodAnnihilation(m.getDestructionMethod().getDescription());
                                p.setCompanyName(request.getMedicamentAnnihilation().getCompanyName());
                                p.setFutilityCause(m.getUselessReason());
                                p.setPrimaryPackage(m.getPrimaryPackage());

                                procesVerbals.add(p);

                            }
                        } else
                        {
                            ProcessVerbalInfo p = new ProcessVerbalInfo();

                            p.setName(m.getNotRegisteredName());
                            p.setDoza(m.getNotRegisteredDose());
                            p.setForma(m.getPharmaceuticalForm().getDescription());
                            p.setSeria(m.getSeria());
                            p.setQuantity(String.valueOf(m.getQuantity()) + " " + String.valueOf(m.getUnitsOfMeasurement() != null ? m.getUnitsOfMeasurement().getDescription() : ""));
                            p.setMethodAnnihilation(m.getDestructionMethod().getDescription());
                            p.setCompanyName(request.getMedicamentAnnihilation().getCompanyName());
                            p.setFutilityCause(m.getUselessReason());
                            p.setPrimaryPackage(m.getPrimaryPackage());

                            procesVerbals.add(p);
                        }
                    }
            );


            List<CommitteeMember> members = new ArrayList<>();

            memberSet.forEach(ms -> {
                CommitteeMember cm = new CommitteeMember();
                cm.setFullName(ms.getName());
                cm.setFunction(ms.getFunction());
                cm.setInstitution(ms.getInstitution().getDescription());
                cm.setPresident(false);


                members.add(cm);
            });



            /* Convert medicaments to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(procesVerbals);

            /* Convert members to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsMembersJRBean  = new JRBeanCollectionDataSource(members);
            JRBeanCollectionDataSource itemsMembersJRBean2 = new JRBeanCollectionDataSource(members);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("nr", request.getRequestNumber());
            parameters.put("date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(request.getStartDate()));
            parameters.put("companyName", request.getMedicamentAnnihilation().getCompanyName());
            parameters.put("amedRepresentant", request.getMedicamentAnnihilation().getCompanyName());

            if (president != null)
            {
                parameters.put("committeePresidentName", president.getName());
                parameters.put("committeePresidentFunction", president.getFunction());
                parameters.put("committeePresidentInstitution", president.getInstitution().getDescription());
            }

            parameters.put("annihilationDataSource", itemsJRBean);
            parameters.put("committeeMembersDataSource", itemsMembersJRBean);
            parameters.put("committeeMembersDataSource2", itemsMembersJRBean2);

//            JRBeanCollectionDataSource beanColDataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=procesVerbal.pdf").body(bytes);
    }


    @RequestMapping(value = "/view-lista-pentru-comisie", method = RequestMethod.POST)
    public ResponseEntity<byte[]> viewListapentruComisie(@RequestBody RegistrationRequestsEntity request) throws CustomException
    {
        byte[] bytes = null;
        try
        {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource       res            = resourceLoader.getResource("layouts/module8/ListaMedicamentelorPentruComisie.jrxml");
            JasperReport   report         = JasperCompileManager.compileReport(res.getInputStream());


            List<ListaMedicamentelorPentruComisie> listaMeds = new ArrayList<>();

            request.getMedicamentAnnihilation().getMedicamentsMedicamentAnnihilationMeds().forEach(
                    m -> {
                        Optional<MedicamentEntity> med = medicamentRepository.findById(m.getMedicamentId());
                        if (med.isPresent())
                        {
                            ListaMedicamentelorPentruComisie l = new ListaMedicamentelorPentruComisie();
                            l.setCompanyName(request.getMedicamentAnnihilation().getCompanyName());
                            l.setAnihilationMethod(m.getDestructionMethod().getDescription());
                            l.setFutilityCause(m.getUselessReason());
                            l.setMedicamentName(med.get().getCommercialName());
                            l.setPharmaceuticForm(med.get().getPharmaceuticalForm().getDescription());
                            l.setPrimaryPackage(med.get().getPrimarePackage());
                            l.setQuantety(String.valueOf(AmountUtils.round(m.getQuantity(), 2)));
                            l.setSeries(m.getSeria());

                            listaMeds.add(l);
                        }

                    }
            );


            /* Convert List to JRBeanCollectionDataSource */
            JRBeanCollectionDataSource itemsJRBean = new JRBeanCollectionDataSource(listaMeds);

            /* Map to hold Jasper report Parameters */
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("date", new SimpleDateFormat(Constants.Layouts.DATE_FORMAT).format(new Date()));
            parameters.put("genDir", sysParamsRepository.findByCode(Constants.SysParams.DIRECTOR_GENERAL).get().getValue());

            parameters.put("listaMedicamentelorPentruComisieDataset", itemsJRBean);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, new JREmptyDataSource());
            bytes = JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e)
        {
            throw new CustomException(e.getMessage());
        }

        return ResponseEntity.ok().header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=listaPentruComisie.pdf").body(bytes);
    }

    @GetMapping(value = "/generate-registration-request-number")
    public ResponseEntity<List<String>> generateRegistrationRequestNumber()
    {
        SeqAnnihilationRegistrationNumberEntity seq = new SeqAnnihilationRegistrationNumberEntity();
        seqAnnihilationRegistrationNumberRepository.save(seq);
        return new ResponseEntity<>(Arrays.asList("Rg12-"+ Utils.intToString(6, seq.getId())), HttpStatus.OK);
    }
}
