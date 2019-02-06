package com.bass.amed.utils;

import com.bass.amed.common.Constants;
import com.bass.amed.entity.*;
import com.bass.amed.service.AuditLogService;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public final class AuditUtils
{
    private static AuditLogEntity fillAuditLogEntityForMedicamentRegistration(String field, Object newValue, Integer entityId, Integer requestId)
    {
        return new AuditLogEntity().withField(field).withAction(Constants.AUDIT_ACTIONS.ADD.name()).withCategoryName(Constants.AUDIT_CATEGORIES.MODULE.name()).withSubCategoryName(Constants.AUDIT_SUBCATEGORIES.MODULE_1.name()).withEntityId(entityId).withRequestId(requestId).withNewValue(newValue);
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
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament producator ID", medicamentManufactureEntity.getManufacture().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament producator denumire", medicamentManufactureEntity.getManufacture().getDescription(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament producator produs finit", String.valueOf(medicamentManufactureEntity.getProducatorProdusFinit()), med.getId(),
                        requestId));
            }
        }
        if (med.getMedicamentTypes() != null)
        {
            for (MedicamentTypesEntity medicamentTypesEntity : med.getMedicamentTypes())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament tip cerere ID", medicamentTypesEntity.getType().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament tip cerere denumire", medicamentTypesEntity.getType().getDescription(), med.getId(),
                        requestId));
            }
        }
        if (med.getActiveSubstances() != null)
        {
            for (MedicamentActiveSubstancesEntity activeSubstancesEntity : med.getActiveSubstances())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa ID", activeSubstancesEntity.getActiveSubstance().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa denumire", activeSubstancesEntity.getActiveSubstance().getDescription(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa cantitate", String.valueOf(activeSubstancesEntity.getQuantity()),
                        med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa unitate de masura",
                        activeSubstancesEntity.getUnitsOfMeasurement().getDescription(),
                        med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament substanta activa numar compozitie",
                        activeSubstancesEntity.getCompositionNumber(),
                        med.getId(),
                        requestId));
                for (MedicamentActiveSubstanceManufacturesEntity nmManufacturesEntity : activeSubstancesEntity.getManufactures())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("substanta activa producator ID", nmManufacturesEntity.getManufacture().getId(), med.getId(),
                            requestId));
                    dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("substanta activa producator denumire", nmManufacturesEntity.getManufacture().getDescription(), med.getId(),
                            requestId));
                }
            }
        }
        if (med.getAuxSubstances() != null)
        {
            for (MedicamentAuxiliarySubstancesEntity auxiliarySubstancesEntity : med.getAuxSubstances())
            {
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament excipient ID", auxiliarySubstancesEntity.getAuxSubstance().getId(), med.getId(),
                        requestId));
                dummyEntities.add(fillAuditLogEntityForMedicamentRegistration("medicament excipient denumire", auxiliarySubstancesEntity.getAuxSubstance().getDescription(), med.getId(),
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
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament producator ID",
                            null, medicamentManufactureEntity.getManufacture().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament producator denumire",
                            null, medicamentManufactureEntity.getManufacture().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament producator produs finit",
                            null, String.valueOf(medicamentManufactureEntity.getProducatorProdusFinit()), medFinal.getId(), request.getId()));
                }
            }
            if (medFinal.getMedicamentTypes() != null)
            {
                for (MedicamentTypesEntity medicamentTypesEntity : medFinal.getMedicamentTypes())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament tip cerere ID",
                            null, medicamentTypesEntity.getType().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament tip cerere denumire",
                            null, medicamentTypesEntity.getType().getDescription(), medFinal.getId(), request.getId()));
                }
            }
            if (medFinal.getActiveSubstances() != null)
            {
                for (MedicamentActiveSubstancesEntity activeSubstancesEntity : medFinal.getActiveSubstances())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa ID",
                            null, activeSubstancesEntity.getActiveSubstance().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa denumire",
                            null, activeSubstancesEntity.getActiveSubstance().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa cantitate",
                            null, String.valueOf(activeSubstancesEntity.getQuantity()), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa unitate de masura",
                            null, activeSubstancesEntity.getUnitsOfMeasurement().getDescription(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament substanta activa numar compozitie",
                            null, activeSubstancesEntity.getCompositionNumber(), medFinal.getId(), request.getId()));
                    for (MedicamentActiveSubstanceManufacturesEntity nmManufacturesEntity : activeSubstancesEntity.getManufactures())
                    {
                        dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("substanta activa producator ID",
                                null, nmManufacturesEntity.getManufacture().getId(), medFinal.getId(), request.getId()));
                        dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("substanta activa producator denumire",
                                null, nmManufacturesEntity.getManufacture().getDescription(), medFinal.getId(), request.getId()));
                    }
                }
            }
            if (medFinal.getAuxSubstances() != null)
            {
                for (MedicamentAuxiliarySubstancesEntity auxiliarySubstancesEntity : medFinal.getAuxSubstances())
                {
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament excipient ID",
                            null, auxiliarySubstancesEntity.getAuxSubstance().getId(), medFinal.getId(), request.getId()));
                    dummyEntities.add(fillAuditLogEntityForMedicamentPostAuthorization("medicament excipient denumire",
                            null, auxiliarySubstancesEntity.getAuxSubstance().getDescription(), medFinal.getId(), request.getId()));
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
}
