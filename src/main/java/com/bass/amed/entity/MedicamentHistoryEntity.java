package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "medicament_history", schema = "amed")
public class MedicamentHistoryEntity
{
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)@Column(name = "id", nullable = false)
    private Integer id;
    @Basic@Column(name = "product_code_to", nullable = true, length = 10)
    private String productCodeTo;
    @Basic@Column(name = "product_code_from", nullable = true, length = 10)
    private String productCodeFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "customs_code_to")
    private NmCustomsCodesEntity customsCodeTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "customs_code_from")
    private NmCustomsCodesEntity customsCodeFrom;
    @Basic@Column(name = "barcode_to", nullable = true, length = 15)
    private String barcodeTo;
    @Basic@Column(name = "barcode_from", nullable = true, length = 15)
    private String barcodeFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "international_name_id_to")
    private NmInternationalMedicamentNameEntity internationalMedicamentNameTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "international_name_id_from")
    private NmInternationalMedicamentNameEntity internationalMedicamentNameFrom;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)@JoinColumn(name = "medicament_history_id")
    private Set<MedicamentManufactureHistoryEntity> manufacturesHistory = new HashSet<>();
    @Basic@Column(name = "dose_to")
    private String doseTo;
    @Basic@Column(name = "dose_from")
    private String doseFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "pharmaceutical_form_id_to")
    private NmPharmaceuticalFormsEntity pharmaceuticalFormTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "pharmaceutical_form_id_from")
    private NmPharmaceuticalFormsEntity pharmaceuticalFormFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "authorization_holder_id_to")
    private NmManufacturesEntity authorizationHolderTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "authorization_holder_id_from")
    private NmManufacturesEntity authorizationHolderFrom;
    @Basic@Column(name = "prescription_to", nullable = true)
    private Byte prescriptionTo;
    @Basic@Column(name = "prescription_from", nullable = true)
    private Byte prescriptionFrom;
    @Basic@Column(name = "primare_package_to", nullable = true, length = 50)
    private String primarePackageTo;
    @Basic@Column(name = "primare_package_from", nullable = true, length = 50)
    private String primarePackageFrom;
    @Basic@Column(name = "administering_mode_to", nullable = true, length = 200)
    private String administeringModeTo;
    @Basic@Column(name = "administering_mode_from", nullable = true, length = 200)
    private String administeringModeFrom;
    @Basic@Column(name = "status", nullable = true, length = 1)
    private String status;
    @Basic@Column(name = "volume_to")
    private String volumeTo;
    @Basic@Column(name = "volume_from")
    private String volumeFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "volume_unit_measurement_id_to")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurementTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "volume_unit_measurement_id_from")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurementFrom;
    @Basic@Column(name = "terms_of_validity_to")
    private Integer termsOfValidityTo;
    @Basic@Column(name = "terms_of_validity_from")
    private Integer termsOfValidityFrom;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)@JoinColumn(name = "medicament_history_id")
    private Set<MedicamentActiveSubstancesHistoryEntity> activeSubstancesHistory = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)@JoinColumn(name = "medicament_history_id")
    private Set<MedicamentAuxiliarySubstancesHistoryEntity> auxiliarySubstancesHistory = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)@JoinColumn(name = "medicament_history_id")
    private Set<MedicamentInstructionsHistoryEntity> instructionsHistory = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})@JoinColumn(name = "medicament_history_id")
    private Set<MedicamentDivisionHistoryEntity> divisionHistory = new HashSet<>();
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})@JoinColumn(name = "expert_id")
    private MedicamentExpertsEntity experts;
    @Basic@Column(name = "registration_number")
    private Integer registrationNumber;
    @Basic@Column(name = "change_date", nullable = true)
    private LocalDateTime changeDate;
    @Basic@Column(name = "atc_code_to")
    private String atcCodeTo;
    @Basic@Column(name = "atc_code_from")
    private String atcCodeFrom;
    @Basic@Column(name = "commercial_name_to")
    private String commercialNameTo;
    @Basic@Column(name = "commercial_name_from")
    private String commercialNameFrom;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_history_id")
    private Set<MedicamentTypesHistoryEntity> medicamentTypesHistory = new HashSet<>();
    @Basic
    @Column(name = "registration_date", nullable = true)
    private Timestamp registrationDate;
    @Column(name = "approved")
    private Boolean approved;
    @Column(name = "om_number")
    private String omNumber;
    @Basic
    @Column(name = "request_id")
    private Integer requestId;
    @Basic
    @Column(name = "originale_to", nullable = true)
    private Boolean originaleTo;
    @Basic
    @Column(name = "originale_from", nullable = true)
    private Boolean originaleFrom;
    @Basic
    @Column(name = "orphan_to", nullable = true)
    private Boolean orphanTo;
    @Basic
    @Column(name = "orphan_from", nullable = true)
    private Boolean orphanFrom;
    @Basic
    @Column(name = "vitale_to", nullable = true)
    private Boolean vitaleTo;
    @Basic
    @Column(name = "vitale_from", nullable = true)
    private Boolean vitaleFrom;
    @Basic
    @Column(name = "esentiale_to", nullable = true)
    private Boolean esentialeTo;
    @Basic
    @Column(name = "esentiale_from", nullable = true)
    private Boolean esentialeFrom;
    @Basic
    @Column(name = "nonesentiale_to", nullable = true)
    private Boolean nonesentialeTo;
    @Basic
    @Column(name = "nonesentiale_from", nullable = true)
    private Boolean nonesentialeFrom;

    public void assign(MedicamentEntity entity)
    {
        this.atcCodeTo = entity.getAtcCode();
        this.doseTo = entity.getDose();
        this.commercialNameTo = entity.getCommercialName();
        this.productCodeTo = entity.getProductCode();
        this.customsCodeTo = entity.getCustomsCode();
        this.barcodeTo = entity.getBarcode();
        this.internationalMedicamentNameTo = entity.getInternationalMedicamentName();
        this.pharmaceuticalFormTo = entity.getPharmaceuticalForm();
        this.authorizationHolderTo = entity.getAuthorizationHolder();
        this.prescriptionTo = entity.getPrescription();
        this.primarePackageTo = entity.getPrimarePackage();
        this.administeringModeTo = entity.getAdministeringMode();
        this.status = entity.getStatus();
        this.volumeTo = entity.getVolume();
        this.volumeQuantityMeasurementTo = entity.getVolumeQuantityMeasurement();
        this.termsOfValidityTo = entity.getTermsOfValidity();
        this.registrationDate = entity.getRegistrationDate();
        this.originaleTo = entity.getOriginale();
        this.orphanTo = entity.getOrphan();
        for (MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity : entity.getActiveSubstances())
        {
            MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity = new MedicamentActiveSubstancesHistoryEntity();
            medicamentActiveSubstancesHistoryEntity.assign(medicamentActiveSubstancesEntity);
            this.activeSubstancesHistory.add(medicamentActiveSubstancesHistoryEntity);
        }
        for (MedicamentAuxiliarySubstancesEntity medicamentAuxiliarySubstancesEntity : entity.getAuxSubstances())
        {
            MedicamentAuxiliarySubstancesHistoryEntity medicamentAuxiliarySubstancesHistoryEntity = new MedicamentAuxiliarySubstancesHistoryEntity();
            medicamentAuxiliarySubstancesHistoryEntity.assign(medicamentAuxiliarySubstancesEntity);
            this.auxiliarySubstancesHistory.add(medicamentAuxiliarySubstancesHistoryEntity);
        }
        for (MedicamentManufactureEntity medicamentManufactureEntity : entity.getManufactures())
        {
            MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity = new MedicamentManufactureHistoryEntity();
            medicamentManufactureHistoryEntity.assign(medicamentManufactureEntity);
            this.manufacturesHistory.add(medicamentManufactureHistoryEntity);
        }
        for (MedicamentTypesEntity types : entity.getMedicamentTypes())
        {
            MedicamentTypesHistoryEntity typesHistory = new MedicamentTypesHistoryEntity();
            typesHistory.assign(types);
            this.medicamentTypesHistory.add(typesHistory);
        }
        this.registrationNumber = entity.getRegistrationNumber();
    }

}
