package com.bass.amed.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.*;

@Setter
@Getter
@Entity
@Table(name = "ct_medicament_amendments", schema = "amed", catalog = "")
public class CtMedAmendEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "registration_number")
    private Integer registrationNumber;

    @Basic
    @Column(name = "registration_date")
    private Timestamp registrationDate;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "international_name_id")
    private NmInternationalMedicamentNameEntity internationalMedicamentName;

    @Basic
    @Column(name = "name_from")
    private String nameFrom;

    @Basic
    @Column(name = "name_to")
    private String nameTo;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "manufacture_id_from")
    private NmManufacturesEntity manufactureFrom;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "manufacture_id_to")
    private NmManufacturesEntity manufactureTo;

    @Basic
    @Column(name = "dose_from")
    private String doseFrom;

    @Basic
    @Column(name = "dose_to")
    private String doseTo;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "unit_measur_id_from")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurementFrom;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "unit_measur_id_to")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurementTo;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "pharm_form_id_from")
    private NmPharmaceuticalFormsEntity pharmFormFrom;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "pharm_form_id_to")
    private NmPharmaceuticalFormsEntity pharmFormTo;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "atc_code_from")
    private NmAtcCodesEntity atcCodeFrom;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "atc_code_to")
    private NmAtcCodesEntity atcCodeTo;

    @Basic
    @Column(name = "administ_mode_from")
    private String administModeFrom;

    @Basic
    @Column(name = "administ_mode_to")
    private String administModeTo;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "med_amend_id")
    private Set<CtMedAmendActiveSubstEntity> activeSubstances = new HashSet<>();

//    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
//    @JoinColumn(name = "med_amend_id")
//    private List<CtMedAmendActiveSubstEntity> activeSubstances2 = new ArrayList<>();

    public void asign(ImportMedNotRegisteredEntity entity){
        this.nameTo = entity.getName();
        this.registrationNumber = entity.getRegistrationNumber();
        this.registrationDate = entity.getRegistrationDate();
        this.internationalMedicamentName = entity.getInternationalMedicamentName();
        this.manufactureTo = entity.getManufacture();
        this.doseTo = entity.getDose();
        this.volumeQuantityMeasurementTo = entity.getVolumeQuantityMeasurement();
        this.pharmFormTo = entity.getPharmaceuticalForm();
        this.atcCodeTo = entity.getAtcCode();
        this.administModeTo = entity.getAdministratingMode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedAmendEntity that = (CtMedAmendEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(registrationNumber, that.registrationNumber) &&
                Objects.equals(registrationDate, that.registrationDate) &&
                Objects.equals(internationalMedicamentName, that.internationalMedicamentName) &&
                Objects.equals(nameFrom, that.nameFrom) &&
                Objects.equals(nameTo, that.nameTo) &&
                Objects.equals(manufactureFrom, that.manufactureFrom) &&
                Objects.equals(manufactureTo, that.manufactureTo) &&
                Objects.equals(doseFrom, that.doseFrom) &&
                Objects.equals(doseTo, that.doseTo) &&
                Objects.equals(volumeQuantityMeasurementFrom, that.volumeQuantityMeasurementFrom) &&
                Objects.equals(volumeQuantityMeasurementTo, that.volumeQuantityMeasurementTo) &&
                Objects.equals(pharmFormFrom, that.pharmFormFrom) &&
                Objects.equals(pharmFormTo, that.pharmFormTo) &&
                Objects.equals(atcCodeFrom, that.atcCodeFrom) &&
                Objects.equals(atcCodeTo, that.atcCodeTo) &&
                Objects.equals(administModeFrom, that.administModeFrom) &&
                Objects.equals(administModeTo, that.administModeTo) &&
                Objects.equals(activeSubstances, that.activeSubstances);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, registrationNumber, registrationDate, internationalMedicamentName, nameFrom, nameTo, manufactureFrom, manufactureTo, doseFrom, doseTo, volumeQuantityMeasurementFrom, volumeQuantityMeasurementTo, pharmFormFrom, pharmFormTo, atcCodeFrom, atcCodeTo, administModeFrom, administModeTo, activeSubstances);
    }
}
