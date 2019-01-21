package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "medicament_active_substances", schema = "amed")
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
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "active_substance_id")
    private Set<MedicamentActiveSubstanceManufacturesEntity> manufactures = new HashSet<>();
    @Basic@Column(name = "composition_number")
    private Integer compositionNumber;

    public void assign(MedicamentActiveSubstancesHistoryEntity entity)
    {
        this.activeSubstance = entity.getActiveSubstance();
        this.quantity = entity.getQuantityTo();
        this.unitsOfMeasurement = entity.getUnitsOfMeasurementTo();
        this.compositionNumber =entity.getCompositionNumberTo();
        this.manufactures.clear();
        for (MedicamentActiveSubstanceManufactureHistoryEntity manufactureHistoryEntity : entity.getManufactures())
        {
            MedicamentActiveSubstanceManufacturesEntity substanceManufacturesEntity = new MedicamentActiveSubstanceManufacturesEntity();
            substanceManufacturesEntity.setManufacture(manufactureHistoryEntity.getManufacture());
            this.manufactures.add(substanceManufacturesEntity);
        }
    }

}
