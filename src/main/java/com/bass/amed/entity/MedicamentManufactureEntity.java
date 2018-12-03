package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "medicament_manufactures", schema = "amed")
public class MedicamentManufactureEntity
{
    private Integer id;
    private NmManufacturesEntity manufacture;
    private Boolean producatorProdusFinit;

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

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "manufacture_id")
    public NmManufacturesEntity getManufacture()
    {
        return manufacture;
    }

    public void setManufacture(NmManufacturesEntity manufacture)
    {
        this.manufacture = manufacture;
    }

    @Basic
    @Column(name = "producator_produs_finit")
    public Boolean getProducatorProdusFinit()
    {
        return producatorProdusFinit;
    }

    public void setProducatorProdusFinit(Boolean producatorProdusFinit)
    {
        this.producatorProdusFinit = producatorProdusFinit;
    }

    public void assign(MedicamentManufactureHistoryEntity entity)
    {
        this.manufacture = entity.getManufacture();
        this.producatorProdusFinit = entity.getProducatorProdusFinitTo();
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

        MedicamentManufactureEntity that = (MedicamentManufactureEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (manufacture != null ? !manufacture.equals(that.manufacture) : that.manufacture != null)
        {
            return false;
        }
        return producatorProdusFinit != null ? producatorProdusFinit.equals(that.producatorProdusFinit) : that.producatorProdusFinit == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (manufacture != null ? manufacture.hashCode() : 0);
        result = 31 * result + (producatorProdusFinit != null ? producatorProdusFinit.hashCode() : 0);
        return result;
    }
}
