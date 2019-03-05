package com.bass.amed.utils;

import com.bass.amed.common.Constants;
import com.bass.amed.entity.*;
import com.bass.amed.service.AuditLogService;
import org.apache.logging.log4j.util.Strings;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class AuditUtils
{
    private static AuditLogEntity fillAuditLogEntityForMedicamentRegistration(String field, Object newValue, Integer entityId, Integer requestId)
    {
        return new AuditLogEntity().withField(field).withAction(Constants.AUDIT_ACTIONS.ADD.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name()).withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_1.name()).withEntityId(entityId).withRequestId(requestId).withNewValue(newValue);
    }

    private static AuditLogEntity fillAuditLogEntity(String field, Object newValue, Integer entityId, Integer requestId, String action, String category, String subcategory)
    {
        return new AuditLogEntity().withField(field).withAction(action).withCategoryName(category).withSubCategoryName(subcategory).withEntityId(entityId).withRequestId(requestId).withNewValue(newValue);
    }

    private static AuditLogEntity fillAuditLogEntityForMedicamentPostAuthorization(String field, Object oldValue, Object newValue, Integer entityId, Integer requestId)
    {
        AuditLogEntity auditLogEntity = fillAuditLogEntityForMedicamentRegistration(field, newValue, entityId, requestId);
        auditLogEntity.withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name());

        if (oldValue != null)
        {
            auditLogEntity.withAction(Constants.AUDIT_ACTIONS.MODIFY.name());
            auditLogEntity.withOldValue(oldValue);
        }
        return auditLogEntity;
    }


    public static void auditMedicamentRegistration(AuditLogService auditLogService, RegistrationRequestsEntity request)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        fillRegistrationDetails(request, dummyEntities, "Medicament inregistrat");

        for (MedicamentEntity med : request.getMedicaments())
        {
            fillMedicamentDetails(request.getId(), dummyEntities, med);
        }
        auditLogService.saveAll(dummyEntities);
    }

    public static void auditMedicamentInterruption(AuditLogService auditLogService, RegistrationRequestsEntity request)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        fillRegistrationDetails(request, dummyEntities, "Medicament inregistrat");

        for (MedicamentEntity med : request.getMedicaments())
        {
            fillMedicamentDetails(request.getId(), dummyEntities, med);
        }
        dummyEntities.stream().forEach(t -> t.withAction(Constants.AUDIT_ACTIONS.INTERRUPT.name()));
        auditLogService.saveAll(dummyEntities);
    }

    private static void fillMedicamentDetails(Integer requestId, List<AuditLogEntity> dummyEntities, MedicamentEntity med)
    {
        if (med.getCode() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament cod", med.getCode(), med.getId(), requestId));
        }
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament status", med.getStatus().equals("F") ? "Aprobat" : "Neaprobat", med.getId(), requestId));
        if (med.getDivision() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament divizare", med.getDivision(), med.getId(), requestId));
        }
        if (med.getVolume() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament volum", med.getVolume(), med.getId(), requestId));
        }
        if (med.getVolumeQuantityMeasurement() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament unitate de masura volum", med.getVolumeQuantityMeasurement().getDescription(), med.getId(), requestId));
        }
        if (med.getInternationalMedicamentName() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament denumirea comună internaționala ID", med.getInternationalMedicamentName().getId(), med.getId(), requestId));
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament denumirea comună internaționala denumire", med.getInternationalMedicamentName().getDescription(), med.getId(), requestId));
        }
        if (med.getRegistrationNumber() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament numar de inregistrare", med.getRegistrationNumber(), med.getId(), requestId));
        }
        if (med.getRegistrationDate() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament data de inregistrare", med.getRegistrationDate(), med.getId(), requestId));
        }
        if (med.getExpirationDate() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament data de expirare", new Timestamp(med.getExpirationDate().getTime()), med.getId(), requestId));
        }
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament denumire comerciala", med.getCommercialName(), med.getId(), requestId));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament doza", med.getDose(), med.getId(), requestId));
        if (med.getPharmaceuticalForm() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament forma farmaceutica ID", med.getPharmaceuticalForm().getId(), med.getId(), requestId));
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament forma farmaceutica denumire", med.getPharmaceuticalForm().getDescription(), med.getId(), requestId));
        }
        if (med.getAuthorizationHolder() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament detinator certificat de inregistrare ID", med.getAuthorizationHolder().getId(), med.getId(), requestId));
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament detinator certificat de inregistrare denumire", med.getAuthorizationHolder().getDescription(), med.getId(), requestId));
        }
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament eliberare receta", med.getPrescription() == 1 ? "Cu prescripţie" : (med.getPrescription() == 0 ? "Fără prescripţie" :
                "Staţionar"), med.getId(), requestId));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament original", Boolean.TRUE.equals(med.getOriginale()) ? "Da" : "Nu", med.getId(),
                requestId));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament orfan", Boolean.TRUE.equals(med.getOrphan()) ? "Da" : "Nu", med.getId(),
                requestId));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament vital", Boolean.TRUE.equals(med.getVitale()) ? "Da" : "Nu", med.getId(),
                requestId));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament esential", Boolean.TRUE.equals(med.getEsentiale()) ? "Da" : "Nu", med.getId(),
                requestId));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament nonesential", Boolean.TRUE.equals(med.getNonesentiale()) ? "Da" : "Nu", med.getId(),
                requestId));
        if (med.getTermsOfValidity() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament termen de validitate", med.getTermsOfValidity(), med.getId(), requestId));
        }
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament cod ATC", med.getAtcCode(), med.getId(), requestId));
        if (med.getOaNumber() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament numarul ordinului de autorizare", med.getOaNumber(), med.getId(), requestId));
        }
        if (med.getManufactures() != null)
        {
            for (MedicamentManufactureEntity medicamentManufactureEntity : med.getManufactures())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament producator ID - " + medicamentManufactureEntity.getId(),
                        medicamentManufactureEntity.getManufacture().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament producator denumire - " + medicamentManufactureEntity.getId(), medicamentManufactureEntity.getManufacture().getDescription(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament producator produs finit - " + medicamentManufactureEntity.getId(), String.valueOf(medicamentManufactureEntity.getProducatorProdusFinit()), med.getId(),
                        requestId));
            }
        }
        if (med.getMedicamentTypes() != null)
        {
            for (MedicamentTypesEntity medicamentTypesEntity : med.getMedicamentTypes())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament tip cerere ID - " + medicamentTypesEntity.getId(), medicamentTypesEntity.getType().getId(),
                        med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament tip cerere denumire - " + medicamentTypesEntity.getId(), medicamentTypesEntity.getType().getDescription(), med.getId(),
                        requestId));
            }
        }
        if (med.getActiveSubstances() != null)
        {
            for (MedicamentActiveSubstancesEntity activeSubstancesEntity : med.getActiveSubstances())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa ID - " + activeSubstancesEntity.getId(), activeSubstancesEntity.getActiveSubstance().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa denumire - " + activeSubstancesEntity.getId(), activeSubstancesEntity.getActiveSubstance().getDescription(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa cantitate - " + activeSubstancesEntity.getId(), String.valueOf(activeSubstancesEntity.getQuantity()),
                        med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa unitate de masura - " + activeSubstancesEntity.getId(),
                        activeSubstancesEntity.getUnitsOfMeasurement().getDescription(),
                        med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa numar compozitie - " + activeSubstancesEntity.getId(),
                        activeSubstancesEntity.getCompositionNumber(),
                        med.getId(),
                        requestId));
                for (MedicamentActiveSubstanceManufacturesEntity nmManufacturesEntity : activeSubstancesEntity.getManufactures())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("substanta activa producator ID - " + nmManufacturesEntity.getId(), nmManufacturesEntity.getManufacture().getId(), med.getId(),
                            requestId));
                    dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("substanta activa producator denumire - " + nmManufacturesEntity.getId(), nmManufacturesEntity.getManufacture().getDescription(), med.getId(),
                            requestId));
                }
            }
        }
        if (med.getAuxSubstances() != null)
        {
            for (MedicamentAuxiliarySubstancesEntity auxiliarySubstancesEntity : med.getAuxSubstances())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament excipient ID - " + auxiliarySubstancesEntity.getId(), auxiliarySubstancesEntity.getAuxSubstance().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament excipient denumire - " + auxiliarySubstancesEntity.getId(), auxiliarySubstancesEntity.getAuxSubstance().getDescription(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament excipient numar compozitie - " + auxiliarySubstancesEntity.getId(), auxiliarySubstancesEntity.getCompositionNumber(), med.getId(),
                        requestId));
            }
        }
    }

    public static void auditMedicamentPostAuthorization(AuditLogService auditLogService, List<MedicamentEntity> medicamentsInitial, List<MedicamentEntity> medicamentsFinal,
                                                        RegistrationRequestsEntity request,
                                                        String omNumber)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        fillRegistrationDetails(request, dummyEntities, "Modificare postautorizare aprobata");
        dummyEntities.stream().forEach(t -> {
            t.withAction(Constants.AUDIT_ACTIONS.MODIFY.name());
            t.withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name());
        });

        for (MedicamentEntity medFinal : medicamentsFinal)
        {
            MedicamentEntity medInitial =
                    medicamentsInitial.stream().filter(t -> t.getId().equals(medFinal.getId())).collect(Collectors.toList()).stream().findFirst().orElse(new MedicamentEntity());
            if (medInitial.getId() == null)
            {
                continue;
            }

            if (!medFinal.getInternationalMedicamentName().getId().equals(medInitial.getInternationalMedicamentName().getId()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament denumirea comună internaționala ID",
                        medInitial.getInternationalMedicamentName().getId(), medFinal.getInternationalMedicamentName().getId(), medFinal.getId(), request.getId()));
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament denumirea comună internaționala denumire",
                        medInitial.getInternationalMedicamentName().getDescription(), medFinal.getInternationalMedicamentName().getDescription(), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getCommercialName().equals(medInitial.getCommercialName()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament denumire comerciala",
                        medInitial.getCommercialName(), medFinal.getCommercialName(), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getDose().equals(medInitial.getDose()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament doza",
                        medInitial.getDose(), medFinal.getDose(), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getPharmaceuticalForm().getId().equals(medInitial.getPharmaceuticalForm().getId()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament forma farmaceutica ID",
                        medInitial.getPharmaceuticalForm().getId(), medFinal.getPharmaceuticalForm().getId(), medFinal.getId(), request.getId()));
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament forma farmaceutica denumire",
                        medInitial.getPharmaceuticalForm().getDescription(), medFinal.getPharmaceuticalForm().getDescription(), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getAuthorizationHolder().getId().equals(medInitial.getAuthorizationHolder().getId()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament detinator certificat de inregistrare ID",
                        medInitial.getAuthorizationHolder().getId(), medFinal.getAuthorizationHolder().getId(), medFinal.getId(), request.getId()));
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament detinator certificat de inregistrare denumire",
                        medInitial.getAuthorizationHolder().getDescription(), medFinal.getAuthorizationHolder().getDescription(), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getPrescription().equals(medInitial.getPrescription()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament eliberare receta",
                        medInitial.getPrescription() == 1 ? "Cu prescripţie" : (medInitial.getPrescription() == 0 ? "Fără prescripţie" :
                                "Staţionar"), medFinal.getPrescription() == 1 ? "Cu prescripţie" : (medFinal.getPrescription() == 0 ? "Fără prescripţie" :
                                "Staţionar"), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getOriginale().equals(medInitial.getOriginale()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament original",
                        Boolean.TRUE.equals(medInitial.getOriginale()) ? "Da" : "Nu", Boolean.TRUE.equals(medFinal.getOriginale()) ? "Da" : "Nu", medFinal.getId(), request.getId()));
            }
            if (!medFinal.getOrphan().equals(medInitial.getOrphan()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament orfan",
                        Boolean.TRUE.equals(medInitial.getOrphan()) ? "Da" : "Nu", Boolean.TRUE.equals(medFinal.getOrphan()) ? "Da" : "Nu", medFinal.getId(), request.getId()));
            }
            if (!medFinal.getVitale().equals(medInitial.getVitale()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament vital",
                        Boolean.TRUE.equals(medInitial.getVitale()) ? "Da" : "Nu", Boolean.TRUE.equals(medFinal.getVitale()) ? "Da" : "Nu", medFinal.getId(), request.getId()));
            }
            if (!medFinal.getVitale().equals(medInitial.getVitale()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament esential",
                        Boolean.TRUE.equals(medInitial.getEsentiale()) ? "Da" : "Nu", Boolean.TRUE.equals(medFinal.getEsentiale()) ? "Da" : "Nu", medFinal.getId(), request.getId()));
            }
            if (!medFinal.getVitale().equals(medInitial.getVitale()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament nonesential",
                        Boolean.TRUE.equals(medInitial.getNonesentiale()) ? "Da" : "Nu", Boolean.TRUE.equals(medFinal.getNonesentiale()) ? "Da" : "Nu", medFinal.getId(), request.getId()));
            }
            if (!medFinal.getTermsOfValidity().equals(medInitial.getTermsOfValidity()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament termen de validitate",
                        medInitial.getTermsOfValidity(), medFinal.getTermsOfValidity(), medFinal.getId(), request.getId()));
            }
            if (!medFinal.getAtcCode().equals(medInitial.getAtcCode()))
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament cod ATC",
                        medInitial.getAtcCode(), medFinal.getAtcCode(), medFinal.getId(), request.getId()));
            }
            if (omNumber != null)
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament numarul ordinului de aprobare",
                        null, omNumber, medFinal.getId(), request.getId()));
            }
            if (medFinal.getManufactures() != null)
            {
                for (MedicamentManufactureEntity medicamentManufactureEntity : medFinal.getManufactures())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament producator ID - " + medicamentManufactureEntity.getId(),
                            null, medicamentManufactureEntity.getManufacture().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament producator denumire - " + medicamentManufactureEntity.getId(),
                            null, medicamentManufactureEntity.getManufacture().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament producator produs finit - " + medicamentManufactureEntity.getId(),
                            null, String.valueOf(medicamentManufactureEntity.getProducatorProdusFinit()), medFinal.getId(), request.getId()));
                }
            }
            if (medFinal.getMedicamentTypes() != null)
            {
                for (MedicamentTypesEntity medicamentTypesEntity : medFinal.getMedicamentTypes())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament tip cerere ID - " + medicamentTypesEntity.getId(),
                            null, medicamentTypesEntity.getType().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament tip cerere denumire - " + medicamentTypesEntity.getId(),
                            null, medicamentTypesEntity.getType().getDescription(), medFinal.getId(), request.getId()));
                }
            }
            if (medFinal.getActiveSubstances() != null)
            {
                for (MedicamentActiveSubstancesEntity activeSubstancesEntity : medFinal.getActiveSubstances())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa ID - " + activeSubstancesEntity.getId(),
                            null, activeSubstancesEntity.getActiveSubstance().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa denumire - " + activeSubstancesEntity.getId(),
                            null, activeSubstancesEntity.getActiveSubstance().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa cantitate - " + activeSubstancesEntity.getId(),
                            null, String.valueOf(activeSubstancesEntity.getQuantity()), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa unitate de masura - " + activeSubstancesEntity.getId(),
                            null, activeSubstancesEntity.getUnitsOfMeasurement().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa numar compozitie - " + activeSubstancesEntity.getId(),
                            null, activeSubstancesEntity.getCompositionNumber(), medFinal.getId(), request.getId()));
                    for (MedicamentActiveSubstanceManufacturesEntity nmManufacturesEntity : activeSubstancesEntity.getManufactures())
                    {
                        dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("substanta activa producator ID - " + nmManufacturesEntity.getId(),
                                null, nmManufacturesEntity.getManufacture().getId(), medFinal.getId(), request.getId()));
                        dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("substanta activa producator denumire - " + nmManufacturesEntity.getId(),
                                null, nmManufacturesEntity.getManufacture().getDescription(), medFinal.getId(), request.getId()));
                    }
                }
            }
            if (medFinal.getAuxSubstances() != null)
            {
                for (MedicamentAuxiliarySubstancesEntity auxiliarySubstancesEntity : medFinal.getAuxSubstances())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament excipient ID - " + auxiliarySubstancesEntity.getId(),
                            null, auxiliarySubstancesEntity.getAuxSubstance().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament excipient denumire - " + auxiliarySubstancesEntity.getId(),
                            null, auxiliarySubstancesEntity.getAuxSubstance().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament excipient numar compozitie - " + auxiliarySubstancesEntity.getId(),
                            null, auxiliarySubstancesEntity.getCompositionNumber(), medFinal.getId(), request.getId()));
                }
            }
            dummyEntities.stream().forEach(t -> {
                t.withAction(Constants.AUDIT_ACTIONS.MODIFY.name());
                t.withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name());
            });
        }

        for (MedicamentEntity medFinal : medicamentsFinal)
        {
            MedicamentEntity medInitial =
                    medicamentsInitial.stream().filter(t -> t.getId().equals(medFinal.getId())).collect(Collectors.toList()).stream().findFirst().orElse(new MedicamentEntity());
            if (medInitial.getId() == null)
            {
                List<AuditLogEntity> dummyEntitiesTemp = new ArrayList<>();
                fillMedicamentDetails(request.getId(), dummyEntitiesTemp, medFinal);
                dummyEntitiesTemp.stream().forEach(t -> t.withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name()));
                dummyEntities.addAll(dummyEntitiesTemp);
            }
        }

        for (MedicamentEntity medInitial : medicamentsInitial)
        {
            MedicamentEntity medFinal =
                    medicamentsFinal.stream().filter(t -> t.getId().equals(medInitial.getId())).collect(Collectors.toList()).stream().findFirst().orElse(new MedicamentEntity());
            if (medFinal.getId() == null)
            {
                List<AuditLogEntity> dummyEntitiesTemp = new ArrayList<>();
                fillMedicamentDetails(request.getId(), dummyEntitiesTemp, medInitial);
                dummyEntitiesTemp.stream().forEach(t -> {
                    t.withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_2.name());
                    t.withAction(Constants.AUDIT_ACTIONS.DELETE.name());
                });
                dummyEntities.addAll(dummyEntitiesTemp);
            }
        }
        auditLogService.saveAll(dummyEntities);
    }

    private static void fillRegistrationDetails(RegistrationRequestsEntity request, List<AuditLogEntity> dummyEntities, String s)
    {
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("numar cerere", request.getRequestNumber(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("status cerere", request.getCurrentStep().equals("F") ? s : "Proces " +
                        "intrerupt",
                request.getId(),
                request.getId()));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("data inregistrare cerere", request.getStartDate(), request.getId(), request.getId()));
        if (request.getEndDate() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("data finisare cerere", request.getEndDate(), request.getId(), request.getId()));
        }
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("compania solicitantă ID", request.getCompany().getId(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("compania solicitantă", request.getCompany().getName(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("tip cerere", request.getType().getDescription(), request.getId(), request.getId()));
        RegistrationRequestMandatedContactEntity registrationRequestMandatedContactEntity =
                request.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("nume solicitatnt", registrationRequestMandatedContactEntity.getMandatedLastname(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("prenume solicitatnt", registrationRequestMandatedContactEntity.getMandatedFirstname(), request.getId(), request.getId()));
        if (registrationRequestMandatedContactEntity.getEmail() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("email", registrationRequestMandatedContactEntity.getEmail(), request.getId(), request.getId()));
        }
        if (registrationRequestMandatedContactEntity.getIdnp() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("IDNP", registrationRequestMandatedContactEntity.getIdnp(), request.getId(), request.getId()));
        }
        if (registrationRequestMandatedContactEntity.getPhoneNumber() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("numar de telefon", registrationRequestMandatedContactEntity.getPhoneNumber(), request.getId(), request.getId()));
        }
        if (registrationRequestMandatedContactEntity.getRequestMandateDate() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("data procura", registrationRequestMandatedContactEntity.getRequestMandateDate(), request.getId(), request.getId()));
        }
        if (registrationRequestMandatedContactEntity.getRequestMandateNr() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("numar procura", registrationRequestMandatedContactEntity.getRequestMandateNr(), request.getId(), request.getId()));
        }
        dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("initiator", request.getInitiator(), request.getId(), request.getId()));
        if (request.getInterruptionReason() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("motiv intrerupere", request.getInterruptionReason(), request.getId(), request.getId()));
        }
        if (request.getDdNumber() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("numarul dispozitiei de distribuire", request.getDdNumber(), request.getId(), request.getId()));
        }
        if (request.getOiNumber() != null)
        {
            dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("numarul ordinului de intrerupere", request.getOiNumber(), request.getId(), request.getId()));
        }
    }

    public static void auditClinicatTrinalRegistration(AuditLogService auditLogService, RegistrationRequestsEntity requestsEntity)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        fillClinicTrialDetails(requestsEntity, dummyEntities);
        auditLogService.saveAll(dummyEntities);
    }

    private static void fillClinicTrialDetails(RegistrationRequestsEntity request, List<AuditLogEntity> dummyEntities/*, ClinicalTrialsEntity clinicalTrialsEntity*/)
    {
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("numar cerere", request.getRequestNumber(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("status cerere", request.getCurrentStep().equals("F") ? "Studiu clinic inregistrat" : "Proces intrerupt",
                request.getId(),
                request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data inregistrare cerere", request.getStartDate(), request.getId(), request.getId()));
        if (request.getEndDate() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data finisare cerere", request.getEndDate(), request.getId(), request.getId()));
        ClinicalTrialsEntity clinicalTrialsEntity = request.getClinicalTrails();
        if (clinicalTrialsEntity.getTreatment().getId() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("treatment id", clinicalTrialsEntity.getTreatment().getId(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getProvenance().getId() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("provenance id", clinicalTrialsEntity.getProvenance().getId(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getPhase().getId() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("phase id", clinicalTrialsEntity.getPhase().getId(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getEudraCtNr() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("eudra nr", clinicalTrialsEntity.getEudraCtNr(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getCode() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("studiu cod", clinicalTrialsEntity.getCode(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getTitle() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("titlu studiu", clinicalTrialsEntity.getTitle(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getSponsor() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("sponsor studiu", clinicalTrialsEntity.getSponsor(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getTrialPopNat() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("numarul pacientilor nationali", clinicalTrialsEntity.getTrialPopNat(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getTrialPopInternat() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("numarul pacientilor internationali", clinicalTrialsEntity.getTrialPopInternat(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getComissionNr() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("nr. comisiei medicamentului", clinicalTrialsEntity.getComissionNr(), clinicalTrialsEntity.getId(), request.getId()));
        if (clinicalTrialsEntity.getComissionDate() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data comisiei medicamentului", clinicalTrialsEntity.getComissionDate(), clinicalTrialsEntity.getId(), request.getId()));

        //Medicament auditing
        ImportMedNotRegisteredEntity medicament = clinicalTrialsEntity.getMedicament();
        if (medicament != null && medicament.getName() != null && !medicament.getName().isEmpty())
        {
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("nume MIC Testat", medicament.getName(), medicament.getId(), request.getId()));
            if (medicament.getManufacture() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("id producator MIC Testat", medicament.getManufacture().getId(), medicament.getId(), request.getId()));
            if (medicament.getDose() != null && !medicament.getDose().isEmpty())
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("concentratia MIC Testat", medicament.getDose(), medicament.getId(), request.getId()));
            if (medicament.getPharmaceuticalForm() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("forma farmaceutica MIC Testat", medicament.getPharmaceuticalForm().getDescription(), medicament.getId(), request.getId()));
            if (medicament.getAtcCode() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("grupa farmacoterapeutică MIC Testat", medicament.getAtcCode().getCode(), medicament.getId(), request.getId()));
            if (medicament.getAdministratingMode() != null && !medicament.getAdministratingMode().isEmpty())
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("modul de administrare MIC Testat", medicament.getAdministratingMode(), medicament.getId(), request.getId()));
            if (!medicament.getActiveSubstances().isEmpty())
                fillActiveSubstances(medicament.getActiveSubstances(), dummyEntities, medicament.getId(), request.getId());
        }

        //Produs de referinta auditing
        ImportMedNotRegisteredEntity refProduct = clinicalTrialsEntity.getReferenceProduct();
        if (refProduct != null && refProduct.getName() != null && !refProduct.getName().isEmpty())
        {
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("nume MIC Referință", refProduct.getName(), refProduct.getId(), request.getId()));
            if (refProduct.getManufacture() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("id producator MIC Referință", refProduct.getManufacture().getId(), refProduct.getId(), request.getId()));
            if (refProduct.getDose() != null && !refProduct.getDose().isEmpty())
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("concentratia MIC Referință", refProduct.getDose(), refProduct.getId(), request.getId()));
            if (refProduct.getPharmaceuticalForm() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("forma farmaceutica MIC Referință", refProduct.getPharmaceuticalForm().getDescription(), refProduct.getId(), request.getId()));
            if (refProduct.getAtcCode() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("grupa farmacoterapeutică MIC Referință", refProduct.getAtcCode().getCode(), refProduct.getId(), request.getId()));
            if (refProduct.getAdministratingMode() != null && !refProduct.getAdministratingMode().isEmpty())
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("modul de administrare MIC Referință", refProduct.getAdministratingMode(), refProduct.getId(), request.getId()));
            if (!refProduct.getActiveSubstances().isEmpty())
                fillActiveSubstances(refProduct.getActiveSubstances(), dummyEntities, refProduct.getId(), request.getId());
        }

        //Placebo auditing
        ImportMedNotRegisteredEntity placebo = clinicalTrialsEntity.getPlacebo();
        if (placebo != null && placebo.getName() != null && !placebo.getName().isEmpty())
        {
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("nume MIC Placebo", placebo.getName(), placebo.getId(), request.getId()));
            if (placebo.getDose() != null && !placebo.getDose().isEmpty())
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("concentratia MIC Placebo", placebo.getDose(), placebo.getId(), request.getId()));
            if (placebo.getAdministratingMode() != null && !placebo.getAdministratingMode().isEmpty())
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("modul de administrare MIC Placebo", placebo.getAdministratingMode(), placebo.getId(), request.getId()));
        }

        //Unitatea medicala auditing
        clinicalTrialsEntity.getMedicalInstitutions().forEach(ctMedicalInstitutionEntity -> {
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("institutia medicala id", ctMedicalInstitutionEntity.getId(), clinicalTrialsEntity.getId(), request.getId()));
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("institutia medicala", ctMedicalInstitutionEntity.getName(), clinicalTrialsEntity.getId(), request.getId()));

            ctMedicalInstitutionEntity.getInvestigators().forEach(investigator -> {
                if (investigator.getMain() == true)
                {
                    dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("investigator principal pentru institutia Id:" + ctMedicalInstitutionEntity.getId(), investigator.getFirstName().concat(" ").concat(investigator.getLastName()), clinicalTrialsEntity.getId(), request.getId()));
                }
                else
                {
                    dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("investigator pentru institutia Id:" + ctMedicalInstitutionEntity.getId(), investigator.getFirstName().concat(" ").concat(investigator.getLastName()), clinicalTrialsEntity.getId(), request.getId()));
                }
            });
        });
    }

    private static void fillActiveSubstances(Set<NotRegMedActiveSubstEntity> activeSubstEntities, List<AuditLogEntity> dummyEntities, Integer entityId, Integer requestId)
    {
        activeSubstEntities.forEach(activeSubst -> {
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("denumirea substantei active id:" + activeSubst.getActiveSubstance().getId(), activeSubst.getActiveSubstance().getDescription(), entityId, requestId));
            if (activeSubst.getQuantity() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("concentratia substantei active id:" + activeSubst.getActiveSubstance().getId(), activeSubst.getQuantity(), entityId, requestId));
            if (activeSubst.getUnitsOfMeasurement() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("unitatea de masura a substantei active id:" + activeSubst.getActiveSubstance().getId(), activeSubst.getUnitsOfMeasurement().getDescription(), entityId, requestId));
            if (activeSubst.getManufacture() != null)
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("producator Id a substantei active id:" + activeSubst.getActiveSubstance().getId(), activeSubst.getManufacture().getId(), entityId, requestId));
        });
    }

    public static void auditClinicatTrinalInterrupt(AuditLogService auditLogService, RegistrationRequestsEntity requestsEntity)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("numar cerere", requestsEntity.getRequestNumber(), requestsEntity.getId(), requestsEntity.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("status cerere", "Proces intrerupt", requestsEntity.getId(), requestsEntity.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("cauza intreruperii", requestsEntity.getInterruptionReason(), requestsEntity.getId(), requestsEntity.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data inregistrare cerere", requestsEntity.getStartDate(), requestsEntity.getId(), requestsEntity.getId()));
        if (requestsEntity.getEndDate() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data finisare cerere", requestsEntity.getEndDate(), requestsEntity.getId(), requestsEntity.getId()));
        auditLogService.saveAll(dummyEntities);
    }

    //    public static void auditClinicatTrialAmendmentRegistration(AuditLogService auditLogService, RegistrationRequestsEntity requestsEntity)
    //    {
    //        List<AuditLogEntity> dummyEntities = new ArrayList<>();
    //        fillClinicTrialAmendmentDetails(requestsEntity, dummyEntities);
    //        //auditLogService.saveAll(dummyEntities);
    //    }

    public static List<AuditLogEntity> auditClinicatTrialAmendmentRegistration(RegistrationRequestsEntity requestsEntity)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        fillClinicTrialAmendmentDetails(requestsEntity, dummyEntities);
        return dummyEntities;
    }

    private static AuditLogEntity fillAuditLogEntityForClinicalTrialRegistration(String field, Object newValue, Integer entityId, Integer requestId)
    {
        return new AuditLogEntity().withField(field).withAction(Constants.AUDIT_ACTIONS.ADD.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name())
                .withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_9.name()).withEntityId(entityId).withRequestId(requestId).withNewValue(newValue);
    }

    private static AuditLogEntity fillAuditLogEntityForAmendmentClinicalTrialRegistration(String field, Object oldValue, Object newValue, Integer entityId, Integer requestId)
    {
        AuditLogEntity auditLogEntity = fillAuditLogEntityForClinicalTrialRegistration(field, newValue, entityId, requestId);

        auditLogEntity.withAction(Constants.AUDIT_ACTIONS.MODIFY.name());
        auditLogEntity.withOldValue(oldValue);
        return auditLogEntity;
    }

    private static void fillClinicTrialAmendmentDetails(RegistrationRequestsEntity request, List<AuditLogEntity> dummyEntities)
    {
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("numar cerere", request.getRequestNumber(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("status cerere", "Amendament la studiu clinic inregistrat", request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data inregistrare cerere", request.getStartDate(), request.getId(), request.getId()));
        if (request.getEndDate() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data finisare cerere", request.getEndDate(), request.getId(), request.getId()));
        ClinicalTrialsEntity clinicalTrialsEntity = request.getClinicalTrails();
        ClinicTrialAmendEntity clinicTrialAmendEntity = clinicalTrialsEntity.getClinicTrialAmendEntities().stream().filter(entity ->
                entity.getRegistrationRequestId().equals(request.getId())
        ).findFirst().orElse(null);
        if ((clinicTrialAmendEntity.getTreatmentFrom() != null && !clinicTrialAmendEntity.getTreatmentFrom().equals(clinicTrialAmendEntity.getTreatmentTo()))
                || (clinicTrialAmendEntity.getTreatmentTo() != null && !clinicTrialAmendEntity.getTreatmentTo().equals(clinicTrialAmendEntity.getTreatmentFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("treatment id",
                    clinicTrialAmendEntity.getTreatmentFrom() == null ? clinicTrialAmendEntity.getTreatmentFrom() : clinicTrialAmendEntity.getTreatmentFrom().getId(),
                    clinicTrialAmendEntity.getTreatmentTo() == null ? clinicTrialAmendEntity.getTreatmentTo() : clinicTrialAmendEntity.getTreatmentTo().getId(),
                    clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getProvenanceFrom() != null && !clinicTrialAmendEntity.getProvenanceFrom().equals(clinicTrialAmendEntity.getProvenanceTo()))
                || (clinicTrialAmendEntity.getProvenanceTo() != null && !clinicTrialAmendEntity.getProvenanceTo().equals(clinicTrialAmendEntity.getProvenanceFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("provenance id",
                    clinicTrialAmendEntity.getProvenanceFrom() == null ? clinicTrialAmendEntity.getProvenanceFrom() : clinicTrialAmendEntity.getProvenanceFrom().getId(),
                    clinicTrialAmendEntity.getProvenanceTo() == null ? clinicTrialAmendEntity.getProvenanceTo() : clinicTrialAmendEntity.getProvenanceTo().getId(),
                    clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getPhaseFrom() != null && !clinicTrialAmendEntity.getPhaseFrom().equals(clinicTrialAmendEntity.getPhaseTo()))
                || (clinicTrialAmendEntity.getPhaseTo() != null && !clinicTrialAmendEntity.getPhaseTo().equals(clinicTrialAmendEntity.getPhaseFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("phase id",
                    clinicTrialAmendEntity.getPhaseFrom() == null ? clinicTrialAmendEntity.getPhaseFrom() : clinicTrialAmendEntity.getPhaseFrom().getId(),
                    clinicTrialAmendEntity.getPhaseTo() == null ? clinicTrialAmendEntity.getPhaseTo() : clinicTrialAmendEntity.getPhaseTo().getId(),
                    clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getEudraCtNrFrom() != null && !clinicTrialAmendEntity.getEudraCtNrFrom().equals(clinicTrialAmendEntity.getEudraCtNrTo()))
                || (clinicTrialAmendEntity.getEudraCtNrTo() != null && !clinicTrialAmendEntity.getEudraCtNrTo().equals(clinicTrialAmendEntity.getEudraCtNrFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("eudra nr",
                    clinicTrialAmendEntity.getEudraCtNrFrom() == null ? clinicTrialAmendEntity.getEudraCtNrFrom() : clinicTrialAmendEntity.getEudraCtNrFrom(),
                    clinicTrialAmendEntity.getEudraCtNrTo() == null ? clinicTrialAmendEntity.getEudraCtNrTo() : clinicTrialAmendEntity.getEudraCtNrTo(),
                    clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getCodeFrom() != null && !clinicTrialAmendEntity.getCodeFrom().equals(clinicTrialAmendEntity.getCodeTo()))
                || (clinicTrialAmendEntity.getCodeTo() != null && !clinicTrialAmendEntity.getCodeTo().equals(clinicTrialAmendEntity.getCodeFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("studiu cod", clinicTrialAmendEntity.getCodeFrom(), clinicTrialAmendEntity.getCodeTo(),
                    clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getTitleFrom() != null && !clinicTrialAmendEntity.getTitleFrom().equals(clinicTrialAmendEntity.getTitleTo()))
                || (clinicTrialAmendEntity.getTitleTo() != null && !clinicTrialAmendEntity.getTitleTo().equals(clinicTrialAmendEntity.getTitleFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("titlu studiu", clinicTrialAmendEntity.getTitleFrom(),
                    clinicTrialAmendEntity.getTitleTo(), clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getSponsorFrom() != null && !clinicTrialAmendEntity.getSponsorFrom().equals(clinicTrialAmendEntity.getSponsorTo()))
                || (clinicTrialAmendEntity.getSponsorTo() != null && !clinicTrialAmendEntity.getSponsorTo().equals(clinicTrialAmendEntity.getSponsorFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("sponsor studiu", clinicTrialAmendEntity.getSponsorFrom(),
                    clinicTrialAmendEntity.getSponsorTo(), clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getTrialPopNatFrom() != null && !clinicTrialAmendEntity.getTrialPopNatFrom().equals(clinicTrialAmendEntity.getTrialPopNatTo()))
                || (clinicTrialAmendEntity.getTrialPopNatTo() != null && !clinicTrialAmendEntity.getTrialPopNatTo().equals(clinicTrialAmendEntity.getTrialPopNatFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("numarul pacientilor nationali", clinicTrialAmendEntity.getTrialPopNatFrom(),
                    clinicTrialAmendEntity.getTrialPopNatTo(), clinicalTrialsEntity.getId(), request.getId()));
        if ((clinicTrialAmendEntity.getTrialPopInternatFrom() != null && !clinicTrialAmendEntity.getTrialPopInternatFrom().equals(clinicTrialAmendEntity.getTrialPopInternatTo()))
                || (clinicTrialAmendEntity.getTrialPopInternatTo() != null && !clinicTrialAmendEntity.getTrialPopInternatTo().equals(clinicTrialAmendEntity.getTrialPopInternatFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("numarul pacientilor internationali", clinicTrialAmendEntity.getTrialPopInternatFrom(),
                    clinicTrialAmendEntity.getTrialPopInternatTo(), clinicalTrialsEntity.getId(), request.getId()));

        //Medicament auditing
        CtMedAmendEntity medicament = clinicTrialAmendEntity.getMedicament();
        if ((medicament.getNameFrom() != null && !medicament.getNameFrom().equals(medicament.getNameTo()))
                || (medicament.getNameTo() != null && !medicament.getNameTo().equals(medicament.getNameFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("nume MIC Testat", medicament.getNameFrom(), medicament.getNameTo(), medicament.getId(), request.getId()));
        if ((medicament.getManufactureFrom() != null && !medicament.getManufactureFrom().equals(medicament.getManufactureTo()))
                || (medicament.getManufactureTo() != null && !medicament.getManufactureTo().equals(medicament.getManufactureFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("producator MIC Testat",
                    medicament.getManufactureFrom() == null ? medicament.getManufactureFrom() : medicament.getManufactureFrom().getDescription(),
                    medicament.getManufactureTo() == null ? medicament.getManufactureTo() : medicament.getManufactureTo().getDescription(),
                    medicament.getId(), request.getId()));
        if ((medicament.getDoseFrom() != null && !medicament.getDoseFrom().equals(medicament.getDoseTo()))
                || (medicament.getDoseTo() != null && !medicament.getDoseTo().equals(medicament.getDoseFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("concentratia MIC Testat", medicament.getDoseFrom(),
                    medicament.getDoseTo(), medicament.getId(), request.getId()));
        if ((medicament.getPharmFormFrom() != null && !medicament.getPharmFormFrom().equals(medicament.getPharmFormTo()))
                || (medicament.getPharmFormTo() != null && !medicament.getPharmFormTo().equals(medicament.getPharmFormFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("forma farmaceutica MIC Testat",
                    medicament.getPharmFormFrom() == null ? medicament.getPharmFormFrom() : medicament.getPharmFormFrom().getDescription(),
                    medicament.getPharmFormTo() == null ? medicament.getPharmFormTo() : medicament.getPharmFormTo().getDescription(),
                    medicament.getId(), request.getId()));
        if ((medicament.getAtcCodeFrom() != null && !medicament.getAtcCodeFrom().equals(medicament.getAtcCodeTo()))
                || (medicament.getAtcCodeTo() != null && !medicament.getAtcCodeTo().equals(medicament.getAtcCodeFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("grupa farmacoterapeutică MIC Testat",
                    medicament.getAtcCodeFrom() == null ? medicament.getAtcCodeFrom() : medicament.getAtcCodeFrom().getDescription(),
                    medicament.getAtcCodeTo() == null ? medicament.getAtcCodeTo() : medicament.getAtcCodeTo().getDescription(),
                    medicament.getId(), request.getId()));
        if ((medicament.getAdministModeFrom() != null && !medicament.getAdministModeFrom().equals(medicament.getAdministModeTo()))
                || (medicament.getAdministModeTo() != null && !medicament.getAdministModeTo().equals(medicament.getAdministModeFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("modul de administrare MIC Testat", medicament.getAdministModeFrom(),
                    medicament.getAdministModeTo(), medicament.getId(), request.getId()));
        if (!medicament.getActiveSubstances().isEmpty())
            fillAmendmentActiveSubstances(medicament.getActiveSubstances(), dummyEntities, medicament.getId(), request.getId());

        //Produs de referinta auditing
        CtMedAmendEntity referenceProduct = clinicTrialAmendEntity.getReferenceProduct();
        if ((referenceProduct.getNameFrom() != null && !referenceProduct.getNameFrom().equals(referenceProduct.getNameTo()))
                || (referenceProduct.getNameTo() != null && !referenceProduct.getNameTo().equals(referenceProduct.getNameFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("nume MIC Referință", referenceProduct.getNameFrom(), referenceProduct.getNameTo(), referenceProduct.getId(), request.getId()));
        if ((referenceProduct.getManufactureFrom() != null && !referenceProduct.getManufactureFrom().equals(referenceProduct.getManufactureTo()))
                || (referenceProduct.getManufactureTo() != null && !referenceProduct.getManufactureTo().equals(referenceProduct.getManufactureFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("producator MIC Referință",
                    referenceProduct.getManufactureFrom() == null ? referenceProduct.getManufactureFrom() : referenceProduct.getManufactureFrom().getDescription(),
                    referenceProduct.getManufactureTo() == null ? referenceProduct.getManufactureTo() : referenceProduct.getManufactureTo().getDescription(),
                    referenceProduct.getId(), request.getId()));
        if ((referenceProduct.getDoseFrom() != null && !referenceProduct.getDoseFrom().equals(referenceProduct.getDoseTo()))
                || (referenceProduct.getDoseTo() != null && !referenceProduct.getDoseTo().equals(referenceProduct.getDoseFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("concentratia MIC Referință", referenceProduct.getDoseFrom(),
                    referenceProduct.getDoseTo(), referenceProduct.getId(), request.getId()));
        if ((referenceProduct.getPharmFormFrom() != null && !referenceProduct.getPharmFormFrom().equals(referenceProduct.getPharmFormTo()))
                || (referenceProduct.getPharmFormTo() != null && !referenceProduct.getPharmFormTo().equals(referenceProduct.getPharmFormFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("forma farmaceutica MIC Referință",
                    referenceProduct.getPharmFormFrom() == null ? referenceProduct.getPharmFormFrom() : referenceProduct.getPharmFormFrom().getDescription(),
                    referenceProduct.getPharmFormTo() == null ? referenceProduct.getPharmFormTo() : referenceProduct.getPharmFormTo().getDescription(),
                    referenceProduct.getId(), request.getId()));
        if ((referenceProduct.getAtcCodeFrom() != null && !referenceProduct.getAtcCodeFrom().equals(referenceProduct.getAtcCodeTo()))
                || (referenceProduct.getAtcCodeTo() != null && !referenceProduct.getAtcCodeTo().equals(referenceProduct.getAtcCodeFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("grupa farmacoterapeutică MIC Referință",
                    referenceProduct.getAtcCodeFrom() == null ? referenceProduct.getAtcCodeFrom() : referenceProduct.getAtcCodeFrom().getDescription(),
                    referenceProduct.getAtcCodeTo() == null ? referenceProduct.getAtcCodeTo() : referenceProduct.getAtcCodeTo().getDescription(),
                    referenceProduct.getId(), request.getId()));
        if ((referenceProduct.getAdministModeFrom() != null && !referenceProduct.getAdministModeFrom().equals(referenceProduct.getAdministModeTo()))
                || (referenceProduct.getAdministModeTo() != null && !referenceProduct.getAdministModeTo().equals(referenceProduct.getAdministModeFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("modul de administrare MIC Referință", referenceProduct.getAdministModeFrom(),
                    referenceProduct.getAdministModeTo(), referenceProduct.getId(), request.getId()));
        if (!referenceProduct.getActiveSubstances().isEmpty())
            fillAmendmentActiveSubstances(referenceProduct.getActiveSubstances(), dummyEntities, referenceProduct.getId(), request.getId());

        //Placebo auditing
        CtMedAmendEntity placebo = clinicTrialAmendEntity.getPlacebo();
        if ((placebo.getNameFrom() != null && !placebo.getNameFrom().equals(placebo.getNameTo()))
                || (placebo.getNameTo() != null && !placebo.getNameTo().equals(placebo.getNameFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("nume MIC Placebo", placebo.getNameFrom(), placebo.getNameTo(), placebo.getId(), request.getId()));
        if ((placebo.getDoseFrom() != null && !placebo.getDoseFrom().equals(placebo.getDoseTo()))
                || (placebo.getDoseTo() != null && !placebo.getDoseTo().equals(placebo.getDoseFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("concentratia MIC Placebo", placebo.getDoseFrom(),
                    placebo.getDoseTo(), placebo.getId(), request.getId()));
        if ((placebo.getAdministModeFrom() != null && !placebo.getAdministModeFrom().equals(placebo.getAdministModeTo()))
                || (placebo.getAdministModeTo() != null && !placebo.getAdministModeTo().equals(placebo.getAdministModeFrom())))
            dummyEntities.add(fillAuditLogEntityForAmendmentClinicalTrialRegistration("modul de administrare MIC Placebo", placebo.getAdministModeFrom(),
                    placebo.getAdministModeTo(), placebo.getId(), request.getId()));

        //Unitatea medicala auditing
        Set<CtMedicalInstitutionEntity> institutionEntitiesFrom = clinicTrialAmendEntity.getMedicalInstitutionsFrom();
        Set<CtMedicalInstitutionEntity> institutionEntitiesTo   = clinicTrialAmendEntity.getMedicalInstitutionsTo();
    }

    private static void fillAmendmentActiveSubstances(Set<CtMedAmendActiveSubstEntity> activeSubstEntities, List<AuditLogEntity> dummyEntities, Integer entityId, Integer requestId)
    {
        activeSubstEntities.forEach(subst -> {
            if (subst.getStatus().equals('N'))
            {
                dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("denumirea substantei active id:" + subst.getActiveSubstance().getId(), subst.getActiveSubstance().getDescription(), entityId, requestId));
                if (subst.getQuantity() != null)
                    dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("concentratia substantei active id:" + subst.getActiveSubstance().getId(), subst.getQuantity(), entityId, requestId));
                if (subst.getUnitsOfMeasurement() != null)
                    dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("unitatea de masura a substantei active id:" + subst.getActiveSubstance().getId(), subst.getUnitsOfMeasurement().getDescription(), entityId, requestId));
                if (subst.getManufacture() != null)
                    dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("producator Id a substantei active id:" + subst.getActiveSubstance().getId(), subst.getManufacture().getId(), entityId, requestId));
            }
            else if (subst.getStatus().equals('R'))
            {
                AuditLogEntity audLogEntity = fillAuditLogEntityForClinicalTrialRegistration("denumirea substantei active id:" + subst.getActiveSubstance().getId(), subst.getActiveSubstance().getDescription(), entityId, requestId);
                audLogEntity.withAction(Constants.AUDIT_ACTIONS.DELETE.name());
            }
            else if (subst.getStatus().equals('U'))
            {
                //                System.out.println();
            }
        });
    }

    public static void auditClinicatTrinalNotifiicationRegistration(AuditLogService auditLogService, RegistrationRequestsEntity request)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("numar cerere", request.getRequestNumber(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("status cerere", "notificare la studiu clinic inregistrata", request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data inregistrare cerere", request.getStartDate(), request.getId(), request.getId()));
        if (request.getEndDate() != null)
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data finisare cerere", request.getEndDate(), request.getId(), request.getId()));
        ClinicTrailNotificationEntity notiffCt = request.getClinicalTrails().getClinicTrialNotificationEntities().stream().filter(notiff -> notiff.getRegistrationRequestId().equals(request.getId())).findFirst().get();
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("titlul notificare", notiffCt.getTitle(), request.getId(), request.getId()));
        dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("tip notificare", notiffCt.getClinicTrailNotificationTypeEntity().getName(), request.getId(), request.getId()));
        if (notiffCt.getClinicTrailNotificationTypeEntity().getCode().equals("DDGSC"))
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data deschidere globala", request.getClinicalTrails().getStartDateInternational(), request.getId(), request.getId()));
        if (notiffCt.getClinicTrailNotificationTypeEntity().getCode().equals("DDLSC"))
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data deschidere locala", request.getClinicalTrails().getStartDateNational(), request.getId(), request.getId()));
        if (notiffCt.getClinicTrailNotificationTypeEntity().getCode().equals("DIGSC"))
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data inchidere globala", request.getClinicalTrails().getEndDateInternational(), request.getId(), request.getId()));
        if (notiffCt.getClinicTrailNotificationTypeEntity().getCode().equals("DILSC"))
            dummyEntities.add(fillAuditLogEntityForClinicalTrialRegistration("data inchidere locala", request.getClinicalTrails().getEndDateNational(), request.getId(), request.getId()));
        auditLogService.saveAll(dummyEntities);
    }


    public static void auditLicense(AuditLogService auditLogService, RegistrationRequestsEntity request)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        fillLicenseRegistrationDetails(request, dummyEntities, "Licentiere");

        fillLicenseDetails(request, dummyEntities);

        auditLogService.saveAll(dummyEntities);
    }


    private static void fillLicenseRegistrationDetails(RegistrationRequestsEntity request, List<AuditLogEntity> dummyEntities, String s)
    {
        dummyEntities.add(fillAuditLogEntity("numar cerere", request.getRequestNumber(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("data inregistrare cerere", request.getStartDate(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("data finisare cerere", request.getEndDate(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("compania solicitantă", request.getLicense().getCompanyName(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("tip cerere", request.getType().getDescription(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));

        LicenseMandatedContactEntity lm = request.getLicense().getDetail().getLicenseMandatedContacts().stream().findFirst().get();
        dummyEntities.add(fillAuditLogEntity("nume solicitant", lm.getRequestPersonLastname(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("prenume solicitant", lm.getRequestPersonLastname(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));

        if (lm.getEmail() != null)
        {
            dummyEntities.add(fillAuditLogEntity("email", lm.getEmail(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        }
        if (lm.getIdnp() != null && !lm.getIdnp().isEmpty())
        {
            dummyEntities.add(fillAuditLogEntity("IDNP", lm.getIdnp(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        }
        if (lm.getPhoneNumber() != null)
        {
            dummyEntities.add(fillAuditLogEntity("numar de telefon", lm.getPhoneNumber(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        }
        if (lm.getRequestMandateDate() != null)
        {
            dummyEntities.add(fillAuditLogEntity("data procura", lm.getRequestMandateDate(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        }
        if (lm.getRequestMandateNr() != null)
        {
            dummyEntities.add(fillAuditLogEntity("numar procura", lm.getRequestMandateNr(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        }

        if (lm.getNewMandatedLastname() != null && !lm.getNewMandatedLastname().isEmpty())
        {
            dummyEntities.add(fillAuditLogEntity("nume solicitant la eliberare", lm.getNewMandatedLastname(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
            dummyEntities.add(fillAuditLogEntity("prenume solicitant la eliberare", lm.getNewMandatedFirstname(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));

            if (lm.getNewEmail() != null)
            {
                dummyEntities.add(fillAuditLogEntity("email la eliberare", lm.getNewEmail(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
            }
            if (lm.getNewIdnp() != null)
            {
                dummyEntities.add(fillAuditLogEntity("IDNP la eliberare", lm.getNewIdnp(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
            }
            if (lm.getNewPhoneNumber() != null)
            {
                dummyEntities.add(fillAuditLogEntity("numar de telefon la eliberare", lm.getNewPhoneNumber(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
            }
            if (lm.getNewMandatedDate() != null)
            {
                dummyEntities.add(fillAuditLogEntity("data procura la eliberare", lm.getNewMandatedDate(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
            }
            if (lm.getNewMandatedNr() != null)
            {
                dummyEntities.add(fillAuditLogEntity("numar procura la eliberare", lm.getNewMandatedNr(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
            }
        }

        dummyEntities.add(fillAuditLogEntity("initiator", request.getInitiator(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
    }


    private static void fillLicenseDetails(RegistrationRequestsEntity request, List<AuditLogEntity> dummyEntities)
    {
        LicensesEntity entity = request.getLicense();
        dummyEntities.add(fillAuditLogEntity("Seria", entity.getSerialNr(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("Numarul", entity.getNr(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("data eliberare", entity.getReleaseDate(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        dummyEntities.add(fillAuditLogEntity("data expirare", entity.getExpirationDate(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));


        entity.getEconomicAgents().forEach(ecAgent -> {
            StringBuilder sbAddress = new StringBuilder("");
            if (ecAgent.getLocality() != null)
            {
                sbAddress.append(ecAgent.getLocality().getStateName()).append(", ").append(ecAgent.getLocality().getDescription()).append(", ").append(ecAgent.getStreet());
            }

            StringBuilder sbData = new StringBuilder();
            //Tipul filialei
            sbData.append(ecAgent.getType().getDescription()).append("; ");
            //Activitati
            sbData.append(ecAgent.getActivities().stream().map(act -> act.getDescription()).collect(Collectors.joining(", "))).append("; ");
            //Farmacist diriginte
            sbData.append(ecAgent.getSelectedPharmaceutist().getFullName());

            dummyEntities.add(fillAuditLogEntity("Filiala: " + sbAddress.toString(), sbData.toString(), request.getId(), request.getId(), Constants.AUDIT_ACTIONS.ADD.name(), Constants.AUDIT_CATEGORIES.MODULE.name(), Constants.AUDIT_SUBCATEGORIES.MODULE_5.name()));
        });

    }


    private static void addAuditLog(List<AuditLogEntity> dummyEntities, String field, Object old, Object newV, Integer entityId, Integer requestId, Constants.AUDIT_SUBCATEGORIES module)
    {
        String                  oldValue  = old == null ? "" : old.toString();
        String                  newValue  = newV == null ? "" : newV.toString();
        Constants.AUDIT_ACTIONS auditType = Constants.AUDIT_ACTIONS.ADD;

        if (!oldValue.equals(newValue))
        {
            if (Strings.isNotEmpty(oldValue) && Strings.isEmpty(newValue))
            {
                auditType = Constants.AUDIT_ACTIONS.DELETE;
            }
            else if (Strings.isNotEmpty(oldValue) && Strings.isNotEmpty(newValue))
            {
                auditType = Constants.AUDIT_ACTIONS.MODIFY;
            }
            dummyEntities.add(new AuditLogEntity().withField(field).withAction(auditType.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name()).withSubCategoryName(module.name()).withEntityId(entityId).withRequestId(requestId).withOldValue(oldValue).withNewValue(newValue));
        }
    }

    public static void auditContactsRegistration(List<AuditLogEntity> dummyEntities, RegistrationRequestMandatedContactEntity oldRegContacts,
                                                      RegistrationRequestMandatedContactEntity newRegContacts, Integer reqId)
    {
        addAuditLog(dummyEntities, "nume solicitatnt", oldRegContacts.getMandatedLastname(), newRegContacts.getMandatedLastname(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "prenume solicitatnt", oldRegContacts.getMandatedFirstname(), newRegContacts.getMandatedFirstname(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "email", oldRegContacts.getEmail(), newRegContacts.getEmail(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "IDNP", oldRegContacts.getIdnp(), newRegContacts.getIdnp(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "numar de telefon", oldRegContacts.getPhoneNumber(), newRegContacts.getPhoneNumber(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "data procura", oldRegContacts.getRequestMandateDate(), newRegContacts.getRequestMandateDate(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "numar procura", oldRegContacts.getRequestMandateNr(), newRegContacts.getRequestMandateNr(), newRegContacts.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
    }

    public static void auditPriceEntityRegistration(List<AuditLogEntity> dummyEntities, PricesEntity oldPrice, PricesEntity newPrice, Integer reqId)
    {
        oldPrice = oldPrice == null ? new PricesEntity() : oldPrice;
        newPrice = newPrice == null ? new PricesEntity() : newPrice;
        addAuditLog(dummyEntities, "pret propus id", oldPrice.getId(), newPrice.getId(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret propus valoare valuta", oldPrice.getValue(), newPrice.getValue(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret propus cantitate totala", oldPrice.getTotalQuantity(), newPrice.getTotalQuantity(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        NmCurrenciesEntity oldCurrency = oldPrice.getCurrency() == null ? new NmCurrenciesEntity() : oldPrice.getCurrency();
        NmCurrenciesEntity newCurrency = newPrice.getCurrency() == null ? new NmCurrenciesEntity() : newPrice.getCurrency();
        addAuditLog(dummyEntities, "pret propus tip valuta", oldCurrency.getShortDescription(), newCurrency.getShortDescription(), newCurrency.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        PriceTypesEntity oldPriceType = oldPrice.getType() == null ? new PriceTypesEntity() : oldPrice.getType();
        PriceTypesEntity newPriceType = newPrice.getType() == null ? new PriceTypesEntity() : newPrice.getType();
        addAuditLog(dummyEntities, "pret propus tip", oldPriceType.getDescription(), newPriceType.getDescription(), newPriceType.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        addAuditLog(dummyEntities, "pret propus dosar", oldPrice.getFolderNr(), newPrice.getFolderNr(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret propus mdl", oldPrice.getMdlValue(), newPrice.getMdlValue(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        MedicamentEntity oldMed = oldPrice.getMedicament() == null ? new MedicamentEntity() : oldPrice.getMedicament();
        MedicamentEntity newMed = newPrice.getMedicament() == null ? new MedicamentEntity() : newPrice.getMedicament();
        addAuditLog(dummyEntities, "pret propus medicament id", oldMed.getId(), newMed.getId(), newMed.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret propus medicament nume", oldMed.getCommercialName(), newMed.getCommercialName(), newMed.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret propus medicament amed", oldMed.getCode(), newMed.getCode(), newMed.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        Set<ReferencePricesEntity> oldRefPrices = oldPrice.getReferencePrices() == null ? new HashSet<>() : oldPrice.getReferencePrices();
        Set<ReferencePricesEntity> newRefPrices = newPrice.getReferencePrices() == null ? new HashSet<>() : newPrice.getReferencePrices();

        newRefPrices.forEach(n ->
                auditReferencePriceRegistration(dummyEntities, oldRefPrices.stream().filter(s -> s.getId().equals(n.getId())).findFirst().orElse(new ReferencePricesEntity()), n, reqId)
        );
    }

    public static void auditPriceEntityGenericReval(AuditLogService auditLogService, PricesEntity oldPrice, PricesEntity newPrice)
    {
        oldPrice = oldPrice == null ? new PricesEntity() : oldPrice;
        newPrice = newPrice == null ? new PricesEntity() : newPrice;

        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        MedicamentEntity     oldM          = oldPrice.getMedicament() == null ? new MedicamentEntity() : oldPrice.getMedicament();
        MedicamentEntity     newM          = newPrice.getMedicament() == null ? new MedicamentEntity() : newPrice.getMedicament();
        addAuditLog(dummyEntities, "pret reevaluat. id", oldM.getId(), newM.getId(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret reevaluat. medicamentul", oldM.getCommercialName(), newM.getCommercialName(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret reevaluat. PretulMDL", oldPrice.getMdlValue(), newPrice.getMdlValue(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        auditLogService.saveAll(dummyEntities);
    }

    public static void auditNmPriceApproved(AuditLogService auditLogService, NmPricesEntity oldPrice, NmPricesEntity newPrice)
    {
        oldPrice = oldPrice == null ? new NmPricesEntity() : oldPrice;
        newPrice = newPrice == null ? new NmPricesEntity() : newPrice;

        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        MedicamentEntity     oldM          = oldPrice.getMedicament() == null ? new MedicamentEntity() : oldPrice.getMedicament();
        MedicamentEntity     newM          = newPrice.getMedicament() == null ? new MedicamentEntity() : newPrice.getMedicament();
        addAuditLog(dummyEntities, "pret aprobat. id", oldM.getId(), newM.getId(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret aprobat. medicamentul", oldM.getCommercialName(), newM.getCommercialName(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret aprobat. PretulMDL", oldPrice.getPriceMdl(), newPrice.getPriceMdl(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret aprobat. Nr. Ordin", oldPrice.getOrderNr(), newPrice.getOrderNr(), newPrice.getId(), null, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        auditLogService.saveAll(dummyEntities);
    }

    public static void auditReferencePriceRegistration(List<AuditLogEntity> dummyEntities, ReferencePricesEntity oldPrice, ReferencePricesEntity newPrice, Integer reqId)
    {
        addAuditLog(dummyEntities, "pret referinta id", oldPrice.getId(), newPrice.getId(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret referinta valoare", oldPrice.getValue(), newPrice.getValue(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret referinta diviziune", oldPrice.getDivision(), newPrice.getDivision(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        addAuditLog(dummyEntities, "pret referinta cantitate totala", oldPrice.getTotalQuantity(), newPrice.getTotalQuantity(), newPrice.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        NmCurrenciesEntity oldCur = oldPrice.getCurrency() == null ? new NmCurrenciesEntity() : oldPrice.getCurrency();
        NmCurrenciesEntity newCur = newPrice.getCurrency() == null ? new NmCurrenciesEntity() : newPrice.getCurrency();
        addAuditLog(dummyEntities, "pret referinta valuta", oldCur.getShortDescription(), newCur.getShortDescription(), newCur.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        NmCountriesEntity oldCountry = oldPrice.getCountry() == null ? new NmCountriesEntity() : oldPrice.getCountry();
        NmCountriesEntity newCountry = newPrice.getCountry() == null ? new NmCountriesEntity() : newPrice.getCountry();
        addAuditLog(dummyEntities, "pret referinta tara", oldCountry.getDescription(), newCountry.getDescription(), newCountry.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);

        PriceTypesEntity oldPriceType = oldPrice.getType() == null ? new PriceTypesEntity() : oldPrice.getType();
        PriceTypesEntity newPriceType = newPrice.getType() == null ? new PriceTypesEntity() : newPrice.getType();
        addAuditLog(dummyEntities, "pret referinta tip", oldPriceType.getDescription(), newPriceType.getDescription(), newPriceType.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
    }


    public static void auditOnePriceRegistration(AuditLogService auditLogService, RegistrationRequestsEntity oldRequest, RegistrationRequestsEntity newRequest)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        if (oldRequest == null) oldRequest = new RegistrationRequestsEntity();
        if (newRequest == null) newRequest = new RegistrationRequestsEntity();
        
        auditRequestBaseFields(dummyEntities, oldRequest, newRequest, Constants.AUDIT_SUBCATEGORIES.MODULE_3);
        
        PricesEntity oldPrice = oldRequest.getPrice() == null ? new PricesEntity() : oldRequest.getPrice();
        PricesEntity newPrice = newRequest.getPrice() == null ? new PricesEntity() : newRequest.getPrice();

        auditPriceEntityRegistration(dummyEntities, oldPrice, newPrice, newPrice.getId());
        
        auditLogService.saveAll(dummyEntities);
    }
    
    static void auditRequestBaseFields(List<AuditLogEntity> dummyEntities, RegistrationRequestsEntity oldRequest, RegistrationRequestsEntity newRequest,
                                       Constants.AUDIT_SUBCATEGORIES subcategory) {
        addAuditLog(dummyEntities, "numar cerere", oldRequest.getRequestNumber(), newRequest.getRequestNumber(), newRequest.getId(), newRequest.getId(), subcategory);
//        addAuditLog(dummyEntities, "data inregistrare cerere", oldRequest.getStartDate(), newRequest.getStartDate(), newRequest.getId(), newRequest.getId(), subcategory);
//        addAuditLog(dummyEntities, "data finisare cerere", oldRequest.getEndDate(), newRequest.getEndDate(), newRequest.getId(), newRequest.getId(), subcategory);
        addAuditLog(dummyEntities, "pasul curent", oldRequest.getCurrentStep(), newRequest.getCurrentStep(), newRequest.getId(), newRequest.getId(), subcategory);

        NmEconomicAgentsEntity oldCompany = oldRequest.getCompany() != null ? oldRequest.getCompany() : new NmEconomicAgentsEntity();
        NmEconomicAgentsEntity newCompany = newRequest.getCompany() != null ? newRequest.getCompany() : new NmEconomicAgentsEntity();

        addAuditLog(dummyEntities, "compania solicitantă ID", oldCompany.getId(), newCompany.getId(), newCompany.getId(), newRequest.getId(), subcategory);
        addAuditLog(dummyEntities, "compania solicitantă", oldCompany.getName(), newRequest.getCompany().getName(), newRequest.getCompany().getId(), newRequest.getId(), subcategory);

        RequestTypesEntity oldRequestTypeEntity = oldRequest.getType() == null ? new RequestTypesEntity() : oldRequest.getType();
        RequestTypesEntity newRequestTypeEntity = newRequest.getType() == null ? new RequestTypesEntity() : newRequest.getType();

        addAuditLog(dummyEntities, "tip cerere", oldRequestTypeEntity.getDescription(), newRequestTypeEntity.getDescription(), newRequest.getId(), newRequest.getId(), subcategory);
        addAuditLog(dummyEntities, "initiator", oldRequest.getInitiator(), newRequest.getInitiator(), newRequest.getId(), newRequest.getId(), subcategory);
        addAuditLog(dummyEntities, "motiv intrerupere", oldRequest.getInterruptionReason(), newRequest.getInterruptionReason(), newRequest.getId(), newRequest.getId(), subcategory);
        addAuditLog(dummyEntities, "numarul dispozitiei de dcistribuire", oldRequest.getDdNumber(), newRequest.getDdNumber(), newRequest.getId(), newRequest.getId(), subcategory);
        addAuditLog(dummyEntities, "numarul ordinului de intrerupere", oldRequest.getOiNumber(), newRequest.getOiNumber(), newRequest.getId(), newRequest.getId(), subcategory);

        RegistrationRequestMandatedContactEntity oldRegContacts = oldRequest.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());
        RegistrationRequestMandatedContactEntity newRegContacts = newRequest.getRegistrationRequestMandatedContacts().stream().findFirst().orElse(new RegistrationRequestMandatedContactEntity());

        auditContactsRegistration(dummyEntities, oldRegContacts, newRegContacts, newRequest.getId());
    }

    public static void auditGDP(AuditLogService auditLogService, RegistrationRequestsEntity oldRequest, RegistrationRequestsEntity newRequest)
    {
        List<AuditLogEntity> dummyEntities = new ArrayList<>();
        if (oldRequest == null) oldRequest = new RegistrationRequestsEntity();
        if (newRequest == null) newRequest = new RegistrationRequestsEntity();

        auditRequestBaseFields(dummyEntities, oldRequest, newRequest, Constants.AUDIT_SUBCATEGORIES.MODULE_12);

        GDPInspectionEntity oldGDP = oldRequest.getGdpInspection() == null ? new GDPInspectionEntity() : oldRequest.getGdpInspection();
        GDPInspectionEntity newGDP = newRequest.getGdpInspection() == null ? new GDPInspectionEntity() : newRequest.getGdpInspection();
        auditGDPInspection(dummyEntities, oldGDP, newGDP, newRequest.getId());

        auditLogService.saveAll(dummyEntities);
    }

    public static void auditGDPInspection(List<AuditLogEntity> dummyEntities, GDPInspectionEntity oldGDP, GDPInspectionEntity newGDP, Integer reqId) {
        addAuditLog(dummyEntities, "gdp id", oldGDP.getId(), newGDP.getId(), newGDP.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_12);
        addAuditLog(dummyEntities, "gdp nr certificat de inspectie", oldGDP.getCertificateBasedOnTheInspection(), newGDP.getCertificateBasedOnTheInspection(), newGDP.getId(), reqId,
                Constants.AUDIT_SUBCATEGORIES.MODULE_12);

        addAuditLog(dummyEntities, "gdp operatii de distributie", oldGDP.getAutoDistributionOperations(), newGDP.getAutoDistributionOperations(), newGDP.getId(), reqId,
                Constants.AUDIT_SUBCATEGORIES.MODULE_12);
        addAuditLog(dummyEntities, "gdp sef de grup id", oldGDP.getGroupLeaderId(), newGDP.getGroupLeaderId(), newGDP.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_12);

        Set<NmEmployeesEntity> oldInspectors = oldGDP.getInspectors() == null ? new HashSet<>() : oldGDP.getInspectors();
        Set<NmEmployeesEntity> newInspectors = newGDP.getInspectors() == null ? new HashSet<>() : newGDP.getInspectors();
        newInspectors.forEach(n -> addAuditLog(dummyEntities, "gdp inspector nume",
                oldInspectors.stream().filter(o -> o.getId().equals(n.getId())).findFirst().orElse(new NmEmployeesEntity()).getName(),
                n.getName(), n.getId(), reqId,
                    Constants.AUDIT_SUBCATEGORIES.MODULE_12)
        );

        Set<GDPSubsidiaryEntity> oldFiliala = oldGDP.getSubsidiaries() == null ? new HashSet<>() : oldGDP.getSubsidiaries();
        Set<GDPSubsidiaryEntity> newFiliala = newGDP.getSubsidiaries() == null ? new HashSet<>() : newGDP.getSubsidiaries();
        newFiliala.forEach(n -> {
            NmEconomicAgentsEntity oldF = oldFiliala.stream().filter(o -> o.getId().equals(n.getId())).findFirst().orElse(new GDPSubsidiaryEntity()).getSubsidiary();
            if(oldF == null) {
                oldF = new NmEconomicAgentsEntity();
            }
            NmEconomicAgentsEntity newF = n.getSubsidiary() == null ? new NmEconomicAgentsEntity() : n.getSubsidiary();

            addAuditLog(dummyEntities, "gdp filiala nume", oldF.getLongName(), newF.getLongName(), n.getId(), reqId,
                    Constants.AUDIT_SUBCATEGORIES.MODULE_12);
            addAuditLog(dummyEntities, "gdp filiala id", oldF.getId(), newF.getId(), n.getId(), reqId,
                    Constants.AUDIT_SUBCATEGORIES.MODULE_12);
        });

        Set<GDPPeriodsEntity> oldPeriods = oldGDP.getPeriods() == null ? new HashSet<>() : oldGDP.getPeriods();
        Set<GDPPeriodsEntity> newPeriods = newGDP.getPeriods() == null ? new HashSet<>() : newGDP.getPeriods();
        newPeriods.forEach(n -> {
            GDPPeriodsEntity oPeriod = oldPeriods.stream().filter(o->o.getId().equals(n.getId())).findFirst().orElse(new GDPPeriodsEntity());
            addAuditLog(dummyEntities, "gdp period from", oPeriod.getFromDate(), n.getFromDate(), n.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_12);
            addAuditLog(dummyEntities, "gdp period to", oPeriod.getToDate(), n.getToDate(), n.getId(), reqId, Constants.AUDIT_SUBCATEGORIES.MODULE_12);
        });
    }
}
