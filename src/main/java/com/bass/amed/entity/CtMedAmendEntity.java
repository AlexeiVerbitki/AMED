package com.bass.amed.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.*;

@Setter
@Getter
@Entity
@Table(name = "ct_medicament_amend")
public class CtMedAmendEntity {
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
    @JoinColumn(name = "med_amend_id")
    private Set<CtMedAmendActiveSubstEntity> activeSubstances = new HashSet<>();

    @Basic
    @Column(name = "subjects_sc")
    private String subjectsSC;

    @Basic
    @Column(name = "is_new")
    private Boolean isNew;

    public void asign(CtMedicamentEntity ctMedicamentEntity, boolean isNew) {
        this.name = ctMedicamentEntity.getName();
        this.manufacture = ctMedicamentEntity.getManufacture();
        this.dose = ctMedicamentEntity.getDose();
        this.pharmaceuticalForm = ctMedicamentEntity.getPharmaceuticalForm();
        this.atcCode = ctMedicamentEntity.getAtcCode();
        this.administratingMode = ctMedicamentEntity.getAdministratingMode();
        this.subjectsSC = ctMedicamentEntity.getSubjectsSC();
        this.isNew = isNew;
        ctMedicamentEntity.getActiveSubstances().forEach(activeSubstance -> {
            CtMedAmendActiveSubstEntity amendActiveSubstEntity = new CtMedAmendActiveSubstEntity();
            amendActiveSubstEntity.asign(activeSubstance);
            this.activeSubstances.add(amendActiveSubstEntity);
        });
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedAmendEntity that = (CtMedAmendEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name) &&
                Objects.equals(manufacture, that.manufacture) &&
                Objects.equals(dose, that.dose) &&
                Objects.equals(pharmaceuticalForm, that.pharmaceuticalForm) &&
                Objects.equals(atcCode, that.atcCode) &&
                Objects.equals(administratingMode, that.administratingMode) &&
                Objects.equals(activeSubstances, that.activeSubstances) &&
                Objects.equals(subjectsSC, that.subjectsSC) &&
                Objects.equals(isNew, that.isNew);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, manufacture, dose, pharmaceuticalForm, atcCode, administratingMode, activeSubstances, subjectsSC, isNew);
    }
}
