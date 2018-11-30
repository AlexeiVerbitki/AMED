package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

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
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "registration_number")
    private Integer registrationNumber;

    @Basic
    @Column(name = "registration_date")
    private Timestamp registrationDate;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "international_name_id")
    private NmInternationalMedicamentNameEntity internationalMedicamentName;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "manufacture_id")
    private NmManufacturesEntity manufacture;

    @Basic
    @Column(name = "dose")
    private String dose;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "unit_measurement_id")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "pharmaceutical_form_id")
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "atc_code")
    private NmAtcCodesEntity atcCode;

    @Basic
    @Column(name = "administering_mode")
    private String administratingMode;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "active_substance_id")
    private Set<CtMedAmendActiveSubstEntity> activeSubstances = new HashSet<>();

    public void asign(ImportMedNotRegisteredEntity entity){
        this.name = entity.getName();
        this.registrationNumber = entity.getRegistrationNumber();
        this.registrationDate = entity.getRegistrationDate();
        this.internationalMedicamentName = entity.getInternationalMedicamentName();
        this.manufacture = entity.getManufacture();
        this.dose = entity.getDose();
        this.volumeQuantityMeasurement = entity.getVolumeQuantityMeasurement();
        this.pharmaceuticalForm = entity.getPharmaceuticalForm();
        this.atcCode = entity.getAtcCode();
        this.administratingMode = entity.getAdministratingMode();
//        entity.getActiveSubstances().forEach(substance ->{
//            CtMedAmendActiveSubstEntity activeSubstEntity = new CtMedAmendActiveSubstEntity();
//            activeSubstEntity.asign(substance);
//            activeSubstances.add(activeSubstEntity);
//        });

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedAmendEntity that = (CtMedAmendEntity) o;
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
                Objects.equals(administratingMode, that.administratingMode);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id,
                name,
                registrationNumber,
                registrationDate,
                internationalMedicamentName,
                manufacture,
                dose,
                volumeQuantityMeasurement,
                pharmaceuticalForm,
                atcCode,
                administratingMode,
                activeSubstances);
    }
}
