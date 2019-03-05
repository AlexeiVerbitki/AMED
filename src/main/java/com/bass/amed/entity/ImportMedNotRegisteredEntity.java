package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "import_med_not_registered", schema = "amed")
public class ImportMedNotRegisteredEntity {
    private Integer id;
    private String name;
    private Integer registrationNumber;
    private Timestamp registrationDate;
    private NmInternationalMedicamentNameEntity internationalMedicamentName;
    private NmManufacturesEntity manufacture;
    private String dose;
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;
    private NmAtcCodesEntity atcCode;
    private String administratingMode;
    private Set<NotRegMedActiveSubstEntity> activeSubstances = new HashSet<>();
    private String subjectsSC;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "registration_number")
    public Integer getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(Integer registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    @Basic
    @Column(name = "registration_date")
    public Timestamp getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Timestamp registrationDate) {
        this.registrationDate = registrationDate;
    }

    @Basic
    @Column(name = "dose")
    public String getDose() {
        return dose;
    }

    public void setDose(String dose) {
        this.dose = dose;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "international_name_id")
    public NmInternationalMedicamentNameEntity getInternationalMedicamentName() {
        return internationalMedicamentName;
    }

    public void setInternationalMedicamentName(NmInternationalMedicamentNameEntity internationalMedicamentName) {
        this.internationalMedicamentName = internationalMedicamentName;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "manufacture_id")
    public NmManufacturesEntity getManufacture() {
        return manufacture;
    }

    public void setManufacture(NmManufacturesEntity manufacture) {
        this.manufacture = manufacture;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "unit_measurement_id")
    public NmUnitsOfMeasurementEntity getVolumeQuantityMeasurement() {
        return volumeQuantityMeasurement;
    }

    public void setVolumeQuantityMeasurement(NmUnitsOfMeasurementEntity volumeQuantityMeasurement) {
        this.volumeQuantityMeasurement = volumeQuantityMeasurement;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "pharmaceutical_form_id")
    public NmPharmaceuticalFormsEntity getPharmaceuticalForm() {
        return pharmaceuticalForm;
    }

    public void setPharmaceuticalForm(NmPharmaceuticalFormsEntity pharmaceuticalForm) {
        this.pharmaceuticalForm = pharmaceuticalForm;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "atc_code")
    public NmAtcCodesEntity getAtcCode() {
        return atcCode;
    }

    public void setAtcCode(NmAtcCodesEntity atcCode) {
        this.atcCode = atcCode;
    }

    @Basic
    @Column(name = "administering_mode")
    public String getAdministratingMode() {
        return administratingMode;
    }

    public void setAdministratingMode(String administratingMode) {
        this.administratingMode = administratingMode;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "not_reg_med_id")
    public Set<NotRegMedActiveSubstEntity> getActiveSubstances() {
        return activeSubstances;
    }

    public void setActiveSubstances(Set<NotRegMedActiveSubstEntity> activeSubstances) {
        this.activeSubstances = activeSubstances;
    }

    @Basic
    @Column(name = "subjects_sc")
    public String getSubjectsSC() {
        return subjectsSC;
    }

    public void setSubjectsSC(String subjectsSC) {
        this.subjectsSC = subjectsSC;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ImportMedNotRegisteredEntity that = (ImportMedNotRegisteredEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name) &&
                Objects.equals(registrationNumber, that.registrationNumber) &&
                Objects.equals(registrationDate, that.registrationDate) &&
                Objects.equals(internationalMedicamentName, that.internationalMedicamentName) &&
                Objects.equals(manufacture, that.manufacture) &&
                Objects.equals(dose, that.dose) &&
                Objects.equals(volumeQuantityMeasurement, that.volumeQuantityMeasurement) &&
                Objects.equals(pharmaceuticalForm, that.pharmaceuticalForm) &&
                Objects.equals(atcCode, that.atcCode) &&
                Objects.equals(administratingMode, that.administratingMode) &&
                Objects.equals(activeSubstances, that.activeSubstances) &&
                Objects.equals(subjectsSC, that.subjectsSC);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, registrationNumber, registrationDate, internationalMedicamentName, manufacture, dose, volumeQuantityMeasurement, pharmaceuticalForm, atcCode, administratingMode, activeSubstances, subjectsSC);
    }
}
