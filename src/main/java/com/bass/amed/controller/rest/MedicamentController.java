package com.bass.amed.controller.rest;

import com.bass.amed.common.Constants;
import com.bass.amed.dto.InterruptDetailsDTO;
import com.bass.amed.dto.MedicamentDetailsDTO;
import com.bass.amed.dto.MedicamentFilterDTO;
import com.bass.amed.dto.SimilarMedicamentDTO;
import com.bass.amed.dto.medicament.registration.DivisionDTO;
import com.bass.amed.dto.medicament.registration.MedicamentDetailsCartelaDTO;
import com.bass.amed.dto.medicament.registration.MedicamentHistoryDTO;
import com.bass.amed.entity.*;
import com.bass.amed.exception.CustomException;
import com.bass.amed.projection.MedicamentNamesListProjection;
import com.bass.amed.projection.MedicamentRegisterNumberProjection;
import com.bass.amed.repository.MedicamentRepository;
import com.bass.amed.repository.RequestRepository;
import com.bass.amed.repository.SimilarMedicamentsRepository;
import com.bass.amed.service.AuditLogService;
import com.bass.amed.utils.AuditUtils;
import com.bass.amed.utils.MedicamentQueryUtils;
import com.bass.amed.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/medicaments")
public class MedicamentController {
    private static final Logger logger = LoggerFactory.getLogger(MedicamentController.class);
    @Autowired
    SimilarMedicamentsRepository similarMedicamentsRepository;
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    private AuditLogService auditLogService;

    @RequestMapping("/company-all-medicaments")
    public ResponseEntity<List<MedicamentEntity>> getAllMedicaments() {
        logger.debug("Retrieve all medicaments");
        return new ResponseEntity<>(medicamentRepository.findAll(), HttpStatus.OK);
    }

    @RequestMapping("/search-medicament-names-by-name")
    public ResponseEntity<List<MedicamentNamesListProjection>> getAllMedicamentNamesByName(String partialName) {
        logger.debug("Retrieve medicament names list by name");
        return new ResponseEntity<>(medicamentRepository.findByNameStartingWithIgnoreCase(partialName), HttpStatus.OK);
    }

    @RequestMapping("/search-medicament-names-by-name-or-code")
    public ResponseEntity<List<MedicamentNamesListProjection>> getAllMedicamentNamesByNameAndCode(String partialName) {
        logger.debug("Retrieve medicament names list by name");
        return new ResponseEntity<>(medicamentRepository.getMedicamentsByNameAndCode(partialName, partialName, "F"), HttpStatus.OK);
    }


    @RequestMapping("/search-medicament-by-id")
    public ResponseEntity<MedicamentEntity> getMedicamentById(Integer id) {
        logger.debug("Retrieve medicament by id");
        MedicamentEntity m = medicamentRepository.findById(id).get();
        return new ResponseEntity<>(m, HttpStatus.OK);
    }

    @RequestMapping("/search-medicament-by-code")
    public ResponseEntity<List<MedicamentEntity>> getMedicamentByCode(String code) {
        logger.debug("Retrieve medicament by code");
        MedicamentEntity m = medicamentRepository.findByCodeAndStatus(code, "F");

        return new ResponseEntity<>(medicamentRepository.findByRegistrationNumber(m.getRegistrationNumber()).stream().filter(r -> r.getStatus().equals("F")).collect(Collectors.toList()), HttpStatus.OK);
    }

    @RequestMapping("/search-medicaments-by-register-number")
    public ResponseEntity<List<MedicamentRegisterNumberProjection>> getMedicamentsByRegisterNumber(String registerNumber) {
        logger.debug("Retrieve medicaments by register number");
        if (registerNumber.matches("[0-9]+") && registerNumber.length() < 9) {
            return new ResponseEntity<>(medicamentRepository.findDistinctByRegistrationNumber(Integer.valueOf(registerNumber)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
    }

    @RequestMapping("/search-medicaments-by-register-number-full-details")
    public ResponseEntity<List<MedicamentEntity>> getMedicamentsByRegisterNumberFullDetails(String registerNumber) {
        logger.debug("Retrieve medicaments by register number full details");
        return new ResponseEntity<>(medicamentRepository.findByRegistrationNumber(Integer.valueOf(registerNumber)), HttpStatus.OK);
    }

    @RequestMapping("/all-by-name")
    public ResponseEntity<List<MedicamentEntity>> getAllByName(String medName) {
        logger.debug("Retrieve all medicaments by name:" + medName);
        return new ResponseEntity<>(medicamentRepository.findAllByName(medName, "F"), HttpStatus.OK);
    }

    @RequestMapping("/all-by-name-with-price")
    public ResponseEntity<List<MedicamentEntity>> findAllByNameWithPrice(String medName) {
        logger.debug("Retrieve all medicaments by name:" + medName);
        return new ResponseEntity<>(medicamentRepository.findAllByNameWithPrice(medName, "F"), HttpStatus.OK);
    }


    //    @Autowired
//    SimilarMedicamentsRepository similarMedicamentsRepository;
    @RequestMapping("/related")
    public ResponseEntity<List<SimilarMedicamentDTO>> getSimilarMedicaments(@RequestParam(value = "internationalNameId", required = true) Integer internationalNameId) {
        logger.debug("getSimilarMedicaments");
        List<SimilarMedicamentDTO> medicaments = similarMedicamentsRepository.getSimilarMedicaments(internationalNameId);
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }

    @RequestMapping(value = "/medicament-history", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MedicamentHistoryDTO>> getMedicamentHistory(@RequestBody List<String> codes) {
        List<MedicamentHistoryDTO> histories = new ArrayList<>();
        List<Integer> requestIds = medicamentRepository.getRequestIdsByMedicamentCodes(codes);
        for (Integer requestId : requestIds) {
            RegistrationRequestsEntity request = requestRepository.findMedicamentRequestById(requestId).orElse(new RegistrationRequestsEntity());
            if ((request.getRequestNumber().startsWith("Rg06") || request.getRequestNumber().startsWith("Rg00")) && (request.getCurrentStep().equals("C") || request.getCurrentStep().equals("F"))) {
                MedicamentHistoryDTO medicamentHistory = new MedicamentHistoryDTO();
                medicamentHistory.setRequestType(getRequestTypeDescriptionByCode(request.getType().getCode()));
                MedicamentEntity medicamentEntity = request.getMedicaments().stream().filter(m -> m.getStatus().equals("E") || m.getStatus().equals("F")).findAny().orElse(new MedicamentEntity());
                medicamentHistory.setDate(medicamentEntity.getRegistrationDate());
                medicamentHistory.setRegistrationNumber(medicamentEntity.getRegistrationNumber());
                medicamentHistory.setRequestNumber(request.getRequestNumber());
                if (request.getCurrentStep().equals("C")) {
                    medicamentHistory.setRequestType("Refuz reautorizare");
                    medicamentHistory.setMotiv(request.getInterruptionReason());
                    DocumentsEntity ordinDeIntrerupere = request.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("OI")).findAny().orElse(new DocumentsEntity());
                    medicamentHistory.setOrdinDeIntrerupere(ordinDeIntrerupere.getPath());
                    medicamentHistory.setDate(ordinDeIntrerupere.getDate());
                } else if (request.getCurrentStep().equals("F")) {
                    DocumentsEntity ordinDeAutorizare = request.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("OA")).findAny().orElse(new DocumentsEntity());
                    DocumentsEntity certificat = request.getDocuments().stream().filter(t -> t.getDocType().getCategory().equals("CA")).findAny().orElse(new DocumentsEntity());
                    medicamentHistory.setCertificat(certificat.getPath());
                    medicamentHistory.setOrdinDeAutorizare(ordinDeAutorizare.getPath());
                }
                histories.add(medicamentHistory);
            }
        }
        if (histories.size() > 1) {
            histories.sort(Comparator.comparing(o -> o.getDate()));
        }
        return new ResponseEntity<>(histories, HttpStatus.OK);
    }

    private static String getRequestTypeDescriptionByCode(String code) {
        switch (code) {
            case "MEPG":
                return "Autorizare";
            case "MEPS":
                return "Autorizare";
            case "MERG":
                return "Reautorizare";
            case "MERS":
                return "Reautorizare";
            default:
                return "";
        }
    }

    @Transactional
    @RequestMapping(value = "/save-cartela-medicament", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveCartelaMedicament(@RequestBody MedicamentDetailsCartelaDTO medicamentDetails) {
        for (DivisionDTO division : medicamentDetails.getDivisions()) {
            MedicamentEntity medicamentEntity = medicamentRepository.findByCode(division.getCode()).stream().filter(t->t.getStatus().equals("F")).findAny().orElse(new MedicamentEntity());
            List<AuditLogEntity> logs = new ArrayList<>();
            if (!medicamentEntity.getCommercialName().equals(medicamentDetails.getCommercialName())) {
                medicamentEntity.setCommercialName(medicamentDetails.getCommercialName());
                logs.add(new AuditLogEntity().withField("Denumire comerciala").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                        .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getCommercialName()).withOldValue(medicamentEntity.getCommercialName()));

            }
            if (!medicamentEntity.getDose().equals(medicamentDetails.getDose())) {
                medicamentEntity.setDose(medicamentDetails.getDose());
                logs.add(new AuditLogEntity().withField("Doza").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                        .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getDose()).withOldValue(medicamentEntity.getDose()));
            }
            if (!medicamentEntity.getAtcCode().equals(medicamentDetails.getAtcCode())) {
                medicamentEntity.setAtcCode(medicamentDetails.getAtcCode());
                logs.add(new AuditLogEntity().withField("Cod ATC").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                        .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getAtcCode()).withOldValue(medicamentEntity.getAtcCode()));
            }
            if (!medicamentEntity.getPharmaceuticalForm().getId().equals(medicamentDetails.getPharmaceuticalForm().getId())) {
                medicamentEntity.setPharmaceuticalForm(medicamentDetails.getPharmaceuticalForm());
                logs.add(new AuditLogEntity().withField("Forma farmaceutica").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getPharmaceuticalForm().getId()).withOldValue(medicamentEntity.getPharmaceuticalForm().getId()));
            }
            boolean isVitaleFE = medicamentDetails.getGroup().getValue().equals("VIT");
            boolean isEsentialeFE = medicamentDetails.getGroup().getValue().equals("ES");
            boolean isNonEsentialeFE = medicamentDetails.getGroup().getValue().equals("NES");
            boolean isVitaleBE = Boolean.TRUE.equals(medicamentEntity.getVitale());
            boolean isEsentialeBE = Boolean.TRUE.equals(medicamentEntity.getEsentiale());
            boolean isNonEsentialeBE = Boolean.TRUE.equals(medicamentEntity.getNonesentiale());
            if (isVitaleFE != isVitaleBE) {
                medicamentEntity.setVitale(isVitaleFE);
                logs.add(new AuditLogEntity().withField("Vitale").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                 .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(isVitaleFE).withOldValue(isVitaleBE));
            }
            if (isEsentialeFE != isEsentialeBE) {
                medicamentEntity.setEsentiale(isEsentialeFE);
                logs.add(new AuditLogEntity().withField("Esentiale").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                 .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(isEsentialeFE).withOldValue(isEsentialeBE));
            }
            if (isNonEsentialeFE != isNonEsentialeBE) {
                medicamentEntity.setNonesentiale(isNonEsentialeFE);
                logs.add(new AuditLogEntity().withField("Nonesentiale").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                               .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(isNonEsentialeFE).withOldValue(isNonEsentialeBE));
            }
            if (!medicamentEntity.getPrescription().equals(Byte.valueOf(medicamentDetails.getPrescription().getValue()))) {
                medicamentEntity.setPrescription(Byte.valueOf(medicamentDetails.getPrescription().getValue()));
                logs.add(new AuditLogEntity().withField("Eliberare receta").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                              .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getPrescription().getValue()).withOldValue(medicamentEntity.getPrescription()));
            }
            if (!medicamentEntity.getInternationalMedicamentName().getId().equals(medicamentDetails.getInternationalMedicamentName().getId())) {
                medicamentEntity.setInternationalMedicamentName(medicamentDetails.getInternationalMedicamentName());
                logs.add(new AuditLogEntity().withField("Denumire internationala").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                            .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getInternationalMedicamentName().getId()).withOldValue(medicamentEntity.getInternationalMedicamentName().getId()));
            }
            if (!medicamentEntity.getTermsOfValidity().equals(medicamentDetails.getTermsOfValidity())) {
                medicamentEntity.setTermsOfValidity(medicamentDetails.getTermsOfValidity());
                logs.add(new AuditLogEntity().withField("Termen de validitate").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                               .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getTermsOfValidity()).withOldValue(medicamentEntity.getTermsOfValidity()));
            }
            boolean isOriginaleFE = Boolean.TRUE.equals(medicamentDetails.getOriginale());
            boolean isOriginaleBE = Boolean.TRUE.equals(medicamentEntity.getOriginale());
            boolean isOrphanFE = Boolean.TRUE.equals(medicamentDetails.getOrphan());
            boolean isOrphanBE = Boolean.TRUE.equals(medicamentEntity.getOrphan());
            if (isOriginaleFE != isOriginaleBE) {
                medicamentEntity.setOriginale(isOriginaleFE);
                logs.add(new AuditLogEntity().withField("Original").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                             .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(isOriginaleFE).withOldValue(isOriginaleBE));
            }
            if (isOrphanFE != isOrphanBE) {
                medicamentEntity.setOrphan(isOrphanFE);
                logs.add(new AuditLogEntity().withField("Orfan").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                             .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(isOrphanFE).withOldValue(isOrphanBE));
            }
            if (!medicamentEntity.getAuthorizationHolder().getId().equals(medicamentDetails.getAuthorizationHolder().getId())) {
                medicamentEntity.setAuthorizationHolder(medicamentDetails.getAuthorizationHolder());
                logs.add(new AuditLogEntity().withField("Detinator certificat").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                               .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentDetails.getAuthorizationHolder().getId()).withOldValue(medicamentEntity.getAuthorizationHolder().getId()));
            }

            for (MedicamentTypesEntity type : medicamentEntity.getMedicamentTypes()) {
                Optional<NmMedicamentTypeEntity> opt = medicamentDetails.getMedTypesValues().stream().filter(t -> t.getId().equals(type.getType().getId())).findAny();
                if (!opt.isPresent()) {
                    medicamentEntity.getMedicamentTypes().remove(type);
                    logs.add(new AuditLogEntity().withField("Tip cerere medicament veche").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                    .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withOldValue(type.getId()));
                }
            }
            for (NmMedicamentTypeEntity type : medicamentDetails.getMedTypesValues()) {
                Optional<MedicamentTypesEntity> opt = medicamentEntity.getMedicamentTypes().stream().filter(t -> t.getType().getId().equals(type.getId())).findAny();
                if (!opt.isPresent()) {
                    MedicamentTypesEntity medType = new MedicamentTypesEntity();
                    medType.setType(type);
                    medicamentEntity.getMedicamentTypes().add(medType);
                    logs.add(new AuditLogEntity().withField("Tip cerere medicament noua").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                   .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(type.getId()));
                }
            }
            if ((medicamentEntity.getDivision()==null &&division.getDescription()!=null) || (medicamentEntity.getDivision()!=null &&division.getDescription()==null)
                    || (division.getDescription()!=null && medicamentEntity.getDivision()!=null && !medicamentEntity.getDivision().equals(division.getDescription()))) {
                medicamentEntity.setDivision(division.getDescription());
                logs.add(new AuditLogEntity().withField("Divizare").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                             .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(division.getDescription())
                              .withOldValue(medicamentEntity.getDivision()));
            }
            if ((medicamentEntity.getVolume()==null &&division.getVolume()!=null) || (medicamentEntity.getVolume()!=null &&division.getVolume()==null) ||
                    (division.getVolume()!=null && medicamentEntity.getVolume()!=null && !medicamentEntity.getVolume().equals(division.getVolume()))) {
                medicamentEntity.setVolume(division.getVolume());
                logs.add(new AuditLogEntity().withField("Volum").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                            .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(division.getVolume())
                             .withOldValue(medicamentEntity.getVolume()));
            }
            if ((medicamentEntity.getVolumeQuantityMeasurement()==null &&division.getVolumeQuantityMeasurement()!=null) || (medicamentEntity.getVolumeQuantityMeasurement()!=null &&division.getVolumeQuantityMeasurement()==null)
                    || (medicamentEntity.getVolumeQuantityMeasurement()!=null && division.getVolumeQuantityMeasurement()!=null && !medicamentEntity.getVolumeQuantityMeasurement().getId().equals(division.getVolumeQuantityMeasurement().getId()))) {
                medicamentEntity.setVolumeQuantityMeasurement(division.getVolumeQuantityMeasurement());
                logs.add(new AuditLogEntity().withField("Unitate de masura volum").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                             .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(division.getVolumeQuantityMeasurement().getId())
                               .withOldValue(medicamentEntity.getVolumeQuantityMeasurement().getId()));
            }
            for(MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity : medicamentEntity.getActiveSubstances())
            {
                logs.add(new AuditLogEntity().withField("Substanta activa veche").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                              .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withOldValue(medicamentActiveSubstancesEntity.toString()));
            }
            medicamentEntity.getActiveSubstances().clear();
            for (MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity : medicamentDetails.getActiveSubstancesTable()) {
                logs.add(new AuditLogEntity().withField("Substanta activa noua").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                              .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentActiveSubstancesEntity.toString()));
                medicamentEntity.getActiveSubstances().add(medicamentActiveSubstancesEntity);
            }
            Iterator<MedicamentAuxiliarySubstancesEntity> auxIt =  medicamentEntity.getAuxSubstances().iterator();
            for (;auxIt.hasNext();) {
                MedicamentAuxiliarySubstancesEntity    medicamentAuxiliarySubstancesEntity = auxIt.next();
                Optional<MedicamentAuxiliarySubstancesEntity> opt = medicamentDetails.getAuxiliarySubstancesTable().stream().filter(t -> medicamentAuxiliarySubstancesEntity.getId().equals(t.getId())).findAny();
                if (!opt.isPresent()) {
                    auxIt.remove();
                    logs.add(new AuditLogEntity().withField("Substanta auxiliara veche").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                      .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withOldValue(medicamentAuxiliarySubstancesEntity.toString()));
                }
            }
            for (MedicamentAuxiliarySubstancesEntity medicamentAuxiliarySubstancesEntity : medicamentDetails.getAuxiliarySubstancesTable()) {
                Optional<MedicamentAuxiliarySubstancesEntity> opt = medicamentEntity.getAuxSubstances().stream().filter(t -> t.getId().equals(medicamentAuxiliarySubstancesEntity.getId())).findAny();
                if (!opt.isPresent()) {
                    medicamentEntity.getAuxSubstances().add(medicamentAuxiliarySubstancesEntity);
                    logs.add(new AuditLogEntity().withField("Substanta auxiliara noua").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                     .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(medicamentAuxiliarySubstancesEntity.toString()));
                }
            }
            Iterator<MedicamentManufactureEntity> manIt =  medicamentEntity.getManufactures().iterator();
            for (;manIt.hasNext();) {
                MedicamentManufactureEntity   manufactureEntity =   manIt.next();
                Optional<MedicamentManufactureEntity> opt = medicamentDetails.getManufacturesTable().stream().filter(t -> manufactureEntity.getId().equals(t.getId())).findAny();
                if (!opt.isPresent()) {
                    manIt.remove();
                    logs.add(new AuditLogEntity().withField("Producator vechi").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                    .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withOldValue(manufactureEntity.toString()));
                }
            }
            for (MedicamentManufactureEntity manufactureEntity : medicamentDetails.getManufacturesTable()) {
                Optional<MedicamentManufactureEntity> opt = medicamentEntity.getManufactures().stream().filter(t -> t.getId().equals(manufactureEntity.getId())).findAny();
                if (!opt.isPresent()) {
                    medicamentEntity.getManufactures().add(manufactureEntity);
                    logs.add(new AuditLogEntity().withField("Producator nou").withAction(Constants.AUDIT_ACTIONS.MODIFY.name()).withCategoryName(Constants.AUDIT_CATEGORIES.ADMINISTRATION.name())
                                    .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.CARTELA_MEDICAMENT.name()).withEntityId(medicamentEntity.getId()).withRequestId(null).withNewValue(manufactureEntity.toString()));
                }
            }
            if(!logs.isEmpty()) {
                medicamentEntity.setName(medicamentEntity.getCommercialName() + " " + medicamentEntity.getPharmaceuticalForm().getCode() + " " + medicamentEntity.getDose() + " " + Utils.getConcatenatedDivision(medicamentEntity));
                medicamentRepository.save(medicamentEntity);
                auditLogService.saveAll(logs);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/interrupt-process", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> interruptProcess(@RequestBody InterruptDetailsDTO interruptDetailsDTO) {
        logger.debug("Interrupt process");
        Optional<RegistrationRequestsEntity> regReqOpt = requestRepository.findById(interruptDetailsDTO.getRequestId());

        RegistrationRequestsEntity registrationRequestsEntity = regReqOpt.get();
        //registrationRequestsEntity.setCurrentStep("C");
        registrationRequestsEntity.setAssignedUser(interruptDetailsDTO.getUsername());
        registrationRequestsEntity.setInterruptionReason(interruptDetailsDTO.getReason());

        RegistrationRequestHistoryEntity historyEntity = new RegistrationRequestHistoryEntity();
        historyEntity.setUsername(interruptDetailsDTO.getUsername());
        historyEntity.setStep("I");
        historyEntity.setStartDate(interruptDetailsDTO.getStartDate());
        historyEntity.setEndDate(new Timestamp(Calendar.getInstance().getTime().getTime()));
        registrationRequestsEntity.getRequestHistories().add(historyEntity);

        registrationRequestsEntity.setOiIncluded(true);

        requestRepository.save(registrationRequestsEntity);

        if (registrationRequestsEntity.getType().getCode().equals("INMP")) {
            auditLogService.save(new AuditLogEntity().withField("Intrerupere proces, numar cerere").withAction(Constants.AUDIT_ACTIONS.INTERRUPT.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name())
                    .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name()).withEntityId(null).withRequestId(registrationRequestsEntity.getId()).withNewValue(registrationRequestsEntity.getRequestNumber()));
            auditLogService.save(new AuditLogEntity().withField("Intrerupere proces, motiv").withAction(Constants.AUDIT_ACTIONS.INTERRUPT.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name())
                    .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name()).withEntityId(null).withRequestId(registrationRequestsEntity.getId()).withNewValue(registrationRequestsEntity.getInterruptionReason()));
        } else {
            RegistrationRequestsEntity requestDBAfterCommit = requestRepository.findById(registrationRequestsEntity.getId()).orElse(new RegistrationRequestsEntity());
            AuditUtils.auditMedicamentInterruption(auditLogService, requestDBAfterCommit);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/by-filter")
    public ResponseEntity<List<MedicamentDetailsDTO>> getMedicamentsByFilter(@RequestBody MedicamentFilterDTO filter) throws CustomException {
        logger.debug("get medicaments by filter");

        EntityManager em = null;
        List<MedicamentDetailsDTO> result = new ArrayList<>();
        try {
            em = entityManagerFactory.createEntityManager();
            em.getTransaction().begin();
            StringBuilder queryString = MedicamentQueryUtils.createMedicamentByFilterQuery(filter);
            Query query = em.createNativeQuery(queryString.toString(), MedicamentDetailsDTO.class);
            MedicamentQueryUtils.updateMedicamentByFilerQueryWithValues(filter, query);
            result = query.getResultList();
            List<Integer> medicamentIds = result.stream().map(m -> m.getId()).collect(Collectors.toList());
            if (Boolean.TRUE.equals(filter.getAtLeastOneSA()) || Boolean.TRUE.equals(filter.getAllSA())) {
                if (Boolean.TRUE.equals(filter.getAtLeastOneSA())) {
                    queryString = MedicamentQueryUtils.createMedicamentSALeastOneQuery(filter);
                } else if (Boolean.TRUE.equals(filter.getAllSA())) {
                    queryString = MedicamentQueryUtils.createMedicamentSAAllQuery(filter);
                }
                query = em.createNativeQuery(queryString.toString(), MedicamentDetailsDTO.class);
                result = query.getResultList();
                List<Integer> mSAIds = result.stream().map(m -> m.getId()).collect(Collectors.toList());
                medicamentIds = medicamentIds.stream().filter(f -> mSAIds.contains(f)).collect(Collectors.toList());
            }

            if (medicamentIds.size() != 0) {
                queryString = MedicamentQueryUtils.createMedicamentDetailsQuery(medicamentIds);
                query = em.createNativeQuery(queryString.toString(), MedicamentDetailsDTO.class);
                result = query.getResultList();
            }

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em != null) {
                em.getTransaction().rollback();
            }
            throw new CustomException(e.getMessage());
        } finally {
            em.close();
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
