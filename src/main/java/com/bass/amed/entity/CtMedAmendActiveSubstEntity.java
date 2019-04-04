package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "ct_med_amend_active_subst")
public class CtMedAmendActiveSubstEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "med_amend_id")
    private Integer ctMedAmendId;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "activ_subst_id")
    private NmActiveSubstancesEntity activeSubstance;

    @Basic
    @Column(name = "act_subst_name")
    private String actSubstName;

    @Basic
    @Column(name = "quantity")
    private Double quantity;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "units_of_meas_id")
    private NmUnitsOfMeasurementEntity unitsOfMeasurement;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "manufacture_id")
    private NmManufacturesEntity manufacture;

    public void asign(CtMedActiveSubstEntity entity) {
        this.activeSubstance = entity.getActiveSubstance();
        this.actSubstName = entity.getActSubstName();
        this.quantity = entity.getQuantity();
        this.unitsOfMeasurement = entity.getUnitsOfMeasurement();
        this.manufacture = entity.getManufacture();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedAmendActiveSubstEntity that = (CtMedAmendActiveSubstEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(ctMedAmendId, that.ctMedAmendId) &&
                Objects.equals(activeSubstance, that.activeSubstance) &&
                Objects.equals(actSubstName, that.actSubstName) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(unitsOfMeasurement, that.unitsOfMeasurement) &&
                Objects.equals(manufacture, that.manufacture);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, ctMedAmendId, activeSubstance, actSubstName, quantity, unitsOfMeasurement, manufacture);
    }
}
