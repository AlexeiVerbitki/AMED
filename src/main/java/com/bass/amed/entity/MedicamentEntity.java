package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "medicament", schema = "amed")
public class MedicamentEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Basic
    @Column(name = "commercial_name")
    private String commercialName;
    @Basic
    @Column(name = "code", nullable = true, length = 10)
    private String code;
    @Basic
    @Column(name = "product_code", nullable = true, length = 10)
    private String productCode;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "customs_code", referencedColumnName = "code")
    private NmCustomsCodesEntity customsCode;
    @Basic
    @Column(name = "barcode", nullable = true, length = 15)
    private String barcode;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "international_name_id")
    private NmInternationalMedicamentNameEntity internationalMedicamentName;
    @Basic
    @Column(name = "country_id")
    private Integer countryId;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    private Set<MedicamentManufactureEntity> manufactures = new HashSet<>();
    @Basic
    @Column(name = "registration_number", nullable = true)
    private Integer registrationNumber;
    @Basic
    @Column(name = "registration_date", nullable = true)
    private Timestamp registrationDate;
    @Basic
    @Column(name = "expiration_date", nullable = true)
    private Date expirationDate;
    @Basic
    @Column(name = "dose")
    private String dose;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "pharmaceutical_form_id")
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "authorization_holder_id")
    private NmManufacturesEntity authorizationHolder;
    @Basic
    @Column(name = "prescription", nullable = true)
    private Byte prescription;
    @Basic
    @Column(name = "serial_nr", nullable = true, length = 50)
    private String serialNr;
    @Basic
    @Column(name = "primare_package", nullable = true, length = 50)
    private String primarePackage;
    @Basic
    @Column(name = "administering_mode", nullable = true, length = 200)
    private String administeringMode;
    @Basic
    @Column(name = "status", nullable = true, length = 1)
    private String status;
    @Basic
    @Column(name = "originale", nullable = true)
    private Boolean originale;
    @Basic
    @Column(name = "vitale", nullable = true)
    private Boolean vitale;
    @Basic
    @Column(name = "esentiale", nullable = true)
    private Boolean esentiale;
    @Basic
    @Column(name = "nonesentiale", nullable = true)
    private Boolean nonesentiale;
    @Basic
    @Column(name = "volume")
    private String volume;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "volume_unit_measurement_id")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;
    @Basic
    @Column(name = "terms_of_validity")
    private Integer termsOfValidity;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    private Set<MedicamentActiveSubstancesEntity> activeSubstances = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    private Set<MedicamentAuxiliarySubstancesEntity> auxSubstances = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    private Set<MedicamentInstructionsEntity> instructions = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_number")
    private Set<MedicamentHistoryEntity> medicamentHistory;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "expert_id")
    private MedicamentExpertsEntity experts;
    @Basic
    @Column(name = "atc_code")
    private String atcCode;
    @Basic
    @Column(name = "division")
    private String division;
    @Basic
    @Column(name = "request_id")
    private Integer requestId;
    @Column(name = "drug_check_decisions_id")
    private Integer drugCheckDecisionsId;
    @Column(name = "approved")
    private Boolean approved;
    @Column(name = "oa_number")
    private String oaNumber;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    private Set<MedicamentTypesEntity> medicamentTypes;
    @Basic
    @Column(name = "orphan", nullable = true)
    private Boolean orphan;
    @Basic
    @Column(name = "unlimited_registration_period", nullable = true)
    private Boolean unlimitedRegistrationPeriod;

    public void assign(MedicamentHistoryEntity entity)
    {
        this.commercialName = entity.getCommercialNameTo();
        this.dose = entity.getDoseTo();
        this.atcCode = entity.getAtcCodeTo();
        this.productCode = entity.getProductCodeTo();
        this.customsCode = entity.getCustomsCodeTo();
        this.barcode = entity.getBarcodeTo();
        this.internationalMedicamentName = entity.getInternationalMedicamentNameTo();
        this.pharmaceuticalForm = entity.getPharmaceuticalFormTo();
        this.authorizationHolder = entity.getAuthorizationHolderTo();
        this.vitale = entity.getVitaleTo();
        this.esentiale = entity.getEsentialeTo();
        this.nonesentiale = entity.getNonesentialeTo();
        this.prescription = entity.getPrescriptionTo();
        this.primarePackage = entity.getPrimarePackageTo();
        this.administeringMode = entity.getAdministeringModeTo();
        this.volume = entity.getVolumeTo();
        this.volumeQuantityMeasurement = entity.getVolumeQuantityMeasurementTo();
        this.termsOfValidity = entity.getTermsOfValidityTo();
        this.dose = entity.getDoseTo();
        this.originale=entity.getOriginaleTo();
        this.orphan=entity.getOrphanTo();
        this.activeSubstances.clear();
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity : entity.getActiveSubstancesHistory())
        {
            MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity = new MedicamentActiveSubstancesEntity();
            medicamentActiveSubstancesEntity.assign(medicamentActiveSubstancesHistoryEntity);
            this.activeSubstances.add(medicamentActiveSubstancesEntity);
        }
        this.auxSubstances.clear();
        for (MedicamentAuxiliarySubstancesHistoryEntity medicamentAuxiliarySubstancesHistoryEntity : entity.getAuxiliarySubstancesHistory())
        {
            MedicamentAuxiliarySubstancesEntity medicamentAuxiliarySubstancesEntity = new MedicamentAuxiliarySubstancesEntity();
            medicamentAuxiliarySubstancesEntity.assign(medicamentAuxiliarySubstancesHistoryEntity);
            this.auxSubstances.add(medicamentAuxiliarySubstancesEntity);
        }
        this.medicamentTypes.clear();
        for (MedicamentTypesHistoryEntity medicamentTypesHistoryEntity : entity.getMedicamentTypesHistory())
        {
            MedicamentTypesEntity medicamentTypesEntity = new MedicamentTypesEntity();
            medicamentTypesEntity.assign(medicamentTypesHistoryEntity);
            this.medicamentTypes.add(medicamentTypesEntity);
        }
        this.manufactures.clear();
        for (MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity : entity.getManufacturesHistory())
        {
            MedicamentManufactureEntity medicamentManufactureEntity = new MedicamentManufactureEntity();
            medicamentManufactureEntity.assign(medicamentManufactureHistoryEntity);
            this.manufactures.add(medicamentManufactureEntity);
        }
    }
}
