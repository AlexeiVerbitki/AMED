package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_active_substances", schema = "amed", catalog = "")
public class MedicamentActiveSubstancesEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "active_substance_id" )
    private NmActiveSubstancesEntity activeSubstance;
    @Basic@Column(name = "quantity")
    private Double quantity;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "units_of_measurement_id" )
    private NmUnitsOfMeasurementEntity unitsOfMeasurement;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "manufacture_id" )
    private NmManufacturesEntity manufacture;

    public void assign(MedicamentActiveSubstancesHistoryEntity entity)
    {
        this.activeSubstance = entity.getActiveSubstance();
        this.quantity = entity.getQuantityTo();
        this.unitsOfMeasurement = entity.getUnitsOfMeasurementTo();
        this.manufacture = entity.getManufactureTo();
    }

}
