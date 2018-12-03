package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_active_substances_history", schema = "amed", catalog = "")
public class MedicamentActiveSubstancesHistoryEntity
{
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "active_substance_id")
    private NmActiveSubstancesEntity activeSubstance;
    @Basic@Column(name = "quantity_to")
    private Double quantityTo;
    @Basic@Column(name = "quantity_from")
    private Double quantityFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "units_of_measurement_id_to")
    private NmUnitsOfMeasurementEntity unitsOfMeasurementTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "units_of_measurement_id_from")
    private NmUnitsOfMeasurementEntity unitsOfMeasurementFrom;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "manufacture_id_to" )
    private NmManufacturesEntity manufactureTo;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "manufacture_id_from" )
    private NmManufacturesEntity manufactureFrom;
    @Basic@Column(name = "status")
    private String status;

    public void assign(MedicamentActiveSubstancesEntity entity)
    {
        this.activeSubstance = entity.getActiveSubstance();
        this.quantityTo = entity.getQuantity();
        this.unitsOfMeasurementTo = entity.getUnitsOfMeasurement();
        this.manufactureTo = entity.getManufacture();
        this.status = "O";
    }

}
