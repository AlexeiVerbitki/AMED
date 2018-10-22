package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "medicament_active_substances", schema = "amed", catalog = "")
public class MedicamentActiveSubstancesEntity
{
    private Integer id;
    private NmActiveSubstancesEntity activeSubstance;
    private Double quantity;
    private NmUnitsOfMeasurementEntity unitsOfMeasurement;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id", nullable = false)
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "active_substance_id" )
    public NmActiveSubstancesEntity getActiveSubstance()
    {
        return activeSubstance;
    }

    public void setActiveSubstance(NmActiveSubstancesEntity activeSubstance)
    {
        this.activeSubstance = activeSubstance;
    }

    @Basic
    @Column(name = "quantity")
    public Double getQuantity()
    {
        return quantity;
    }

    public void setQuantity(Double quantity)
    {
        this.quantity = quantity;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "units_of_measurement_id" )
    public NmUnitsOfMeasurementEntity getUnitsOfMeasurement()
    {
        return unitsOfMeasurement;
    }

    public void setUnitsOfMeasurement(NmUnitsOfMeasurementEntity unitsOfMeasurement)
    {
        this.unitsOfMeasurement = unitsOfMeasurement;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (o == null || getClass() != o.getClass())
        {
            return false;
        }

        MedicamentActiveSubstancesEntity that = (MedicamentActiveSubstancesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (activeSubstance != null ? !activeSubstance.equals(that.activeSubstance) : that.activeSubstance != null)
        {
            return false;
        }
        if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null)
        {
            return false;
        }
        return unitsOfMeasurement != null ? unitsOfMeasurement.equals(that.unitsOfMeasurement) : that.unitsOfMeasurement == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (activeSubstance != null ? activeSubstance.hashCode() : 0);
        result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
        result = 31 * result + (unitsOfMeasurement != null ? unitsOfMeasurement.hashCode() : 0);
        return result;
    }
}
