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
    @Column(name = "code", nullable = true, length = 10)
    private String code;
    @Basic
    @Column(name = "product_code", nullable = true, length = 10)
    private String productCode;
    @Basic
    @Column(name = "customs_code", nullable = true, length = 5)
    private String customsCode;
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
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "type_id")
    private NmMedicamentTypeEntity medicamentType;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "group_id")
    private NmMedicamentGroupEntity group;
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
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "original_medicament_id")
    private MedicamentEntity originalMedicament;
    @Basic
    @Column(name = "request_id")
    private Integer requestId;

    public void assign(MedicamentHistoryEntity entity)
    {
        this.name = entity.getName();
        this.dose = entity.getDose();
        this.atcCode = entity.getAtcCode();
        this.productCode = entity.getProductCode();
        this.customsCode = entity.getCustomsCode();
        this.barcode = entity.getBarcode();
        this.internationalMedicamentName = entity.getInternationalMedicamentName();
        this.countryId = entity.getCountryId();
        this.pharmaceuticalForm = entity.getPharmaceuticalForm();
        this.authorizationHolder = entity.getAuthorizationHolder();
        this.medicamentType = entity.getMedicamentType();
        this.group = entity.getGroup();
        this.prescription = entity.getPrescription();
        this.serialNr = entity.getSerialNr();
        this.primarePackage = entity.getPrimarePackage();
        this.administeringMode = entity.getAdministeringMode();
        this.volume = entity.getVolume();
        this.volumeQuantityMeasurement = entity.getVolumeQuantityMeasurement();
        this.termsOfValidity = entity.getTermsOfValidity();
        this.dose = entity.getDose();
        this.activeSubstances.clear();
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity : entity.getActiveSubstancesHistory())
        {
            MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity = new MedicamentActiveSubstancesEntity();
            medicamentActiveSubstancesEntity.assign(medicamentActiveSubstancesHistoryEntity);
            this.activeSubstances.add(medicamentActiveSubstancesEntity);
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
