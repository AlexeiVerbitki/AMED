package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "ct_med_amend_active_subst", schema = "amed", catalog = "")
public class CtMedAmendActiveSubstEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "med_amend_id")
    private Integer ctAmendmentId;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "active_substance_id" )
    private NmActiveSubstancesEntity activeSubstance;

    @Basic
    @Column(name = "quantity")
    private Double quantity;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "units_of_measurement_id" )
    private NmUnitsOfMeasurementEntity unitsOfMeasurement;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "manufacture_id" )
    private NmManufacturesEntity manufacture;

    public void asign(NotRegMedActiveSubstEntity entity){
        this.activeSubstance = entity.getActiveSubstance();
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
                Objects.equals(ctAmendmentId, that.ctAmendmentId) &&
                Objects.equals(activeSubstance, that.activeSubstance) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(unitsOfMeasurement, that.unitsOfMeasurement) &&
                Objects.equals(manufacture, that.manufacture);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, ctAmendmentId, activeSubstance, quantity, unitsOfMeasurement, manufacture);
    }
}