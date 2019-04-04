package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "ct_med_active_subst")
public class CtMedActiveSubstEntity {
    private Integer id;
    private NmActiveSubstancesEntity activeSubstance;
    private Double quantity;
    private NmUnitsOfMeasurementEntity unitsOfMeasurement;
    private NmManufacturesEntity manufacture;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "active_substance_id" )
    public NmActiveSubstancesEntity getActiveSubstance() {
        return activeSubstance;
    }

    public void setActiveSubstance(NmActiveSubstancesEntity activeSubstance) {
        this.activeSubstance = activeSubstance;
    }

    @Basic
    @Column(name = "quantity")
    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "units_of_measurement_id" )
    public NmUnitsOfMeasurementEntity getUnitsOfMeasurement() {
        return unitsOfMeasurement;
    }

    public void setUnitsOfMeasurement(NmUnitsOfMeasurementEntity unitsOfMeasurement) {
        this.unitsOfMeasurement = unitsOfMeasurement;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "manufacture_id" )
    public NmManufacturesEntity getManufacture() {
        return manufacture;
    }

    public void setManufacture(NmManufacturesEntity manufacture) {
        this.manufacture = manufacture;
    }

    public void asign(CtMedAmendActiveSubstEntity entity)
    {
        this.activeSubstance = entity.getActiveSubstance();
        this.quantity = entity.getQuantity();
        this.unitsOfMeasurement = entity.getUnitsOfMeasurement();
        this.manufacture = entity.getManufacture();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedActiveSubstEntity that = (CtMedActiveSubstEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(activeSubstance, that.activeSubstance) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(unitsOfMeasurement, that.unitsOfMeasurement) &&
                Objects.equals(manufacture, that.manufacture);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, activeSubstance, quantity, unitsOfMeasurement, manufacture);
    }
}
