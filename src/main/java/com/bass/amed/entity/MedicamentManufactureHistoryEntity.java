package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "medicament_manufactures_history", schema = "amed")
public class MedicamentManufactureHistoryEntity
{
    private Integer id;
    private NmManufacturesEntity manufacture;
    private Byte producatorProdusFinit;
    private String status;

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
    public Byte getProducatorProdusFinit()
    {
        return producatorProdusFinit;
    }

    public void setProducatorProdusFinit(Byte producatorProdusFinit)
    {
        this.producatorProdusFinit = producatorProdusFinit;
    }

    @Basic
    @Column(name = "status")
    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public void assign(MedicamentManufactureEntity entity)
    {
        this.manufacture = entity.getManufacture();
        this.producatorProdusFinit = entity.getProducatorProdusFinit();
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

        MedicamentManufactureHistoryEntity that = (MedicamentManufactureHistoryEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (manufacture != null ? !manufacture.equals(that.manufacture) : that.manufacture != null)
        {
            return false;
        }
        if (producatorProdusFinit != null ? !producatorProdusFinit.equals(that.producatorProdusFinit) : that.producatorProdusFinit != null)
        {
            return false;
        }
        return status != null ? status.equals(that.status) : that.status == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (manufacture != null ? manufacture.hashCode() : 0);
        result = 31 * result + (producatorProdusFinit != null ? producatorProdusFinit.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        return result;
    }
}
