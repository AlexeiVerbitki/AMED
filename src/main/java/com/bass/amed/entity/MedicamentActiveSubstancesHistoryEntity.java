package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "medicament_active_substances_history", schema = "amed")
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
    @Basic@Column(name = "status")
    private String status;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "manufacture_id")
    private Set<MedicamentActiveSubstanceManufactureHistoryEntity> manufactures = new HashSet<>();

    public void assign(MedicamentActiveSubstancesEntity entity)
    {
        this.activeSubstance = entity.getActiveSubstance();
        this.quantityTo = entity.getQuantity();
        this.unitsOfMeasurementTo = entity.getUnitsOfMeasurement();
        this.status = "O";
    }

}
