package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "ct_medicament")
public class CtMedicamentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "name")
    private String name;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "manufacture_id")
    private NmManufacturesEntity manufacture;

    @Basic
    @Column(name = "dose")
    private String dose;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "pharmaceutical_form_id")
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "atc_code_id")
    private NmAtcCodesEntity atcCode;

    @Basic
    @Column(name = "administering_mode")
    private String administratingMode;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    private Set<CtMedActiveSubstEntity> activeSubstances = new HashSet<>();

    @Basic
    @Column(name = "subjects_sc")
    private String subjectsSC;

    public void asign(CtMedAmendEntity ctMedAmendEntity) {
        this.name = ctMedAmendEntity.getName();
        this.manufacture = ctMedAmendEntity.getManufacture();
        this.dose = ctMedAmendEntity.getDose();
        this.pharmaceuticalForm = ctMedAmendEntity.getPharmaceuticalForm();
        this.atcCode = ctMedAmendEntity.getAtcCode();
        this.administratingMode = ctMedAmendEntity.getAdministratingMode();
        this.subjectsSC = ctMedAmendEntity.getSubjectsSC();
        ctMedAmendEntity.getActiveSubstances().forEach(activeSubstance -> {
            CtMedActiveSubstEntity activeSubstEntity = new CtMedActiveSubstEntity();
            activeSubstEntity.asign(activeSubstance);
            this.activeSubstances.add(activeSubstEntity);
        });
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedicamentEntity that = (CtMedicamentEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name) &&
                Objects.equals(manufacture, that.manufacture) &&
                Objects.equals(dose, that.dose) &&
                Objects.equals(pharmaceuticalForm, that.pharmaceuticalForm) &&
                Objects.equals(atcCode, that.atcCode) &&
                Objects.equals(administratingMode, that.administratingMode) &&
                Objects.equals(activeSubstances, that.activeSubstances) &&
                Objects.equals(subjectsSC, that.subjectsSC);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, manufacture, dose, pharmaceuticalForm, atcCode, administratingMode, activeSubstances, subjectsSC);
    }
}
