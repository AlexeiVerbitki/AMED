package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_active_substances", schema = "amed", catalog = "")
public class NmActiveSubstancesEntity
{
    private Integer id;
    private String code;
    private String description;
    private Integer manufactureId;
    private Double quantity;

    @Id
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "code")
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "description")
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @Basic
    @Column(name = "manufacture_id")
    public Integer getManufactureId()
    {
        return manufactureId;
    }

    public void setManufactureId(Integer manufactureId)
    {
        this.manufactureId = manufactureId;
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

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (manufactureId != null ? manufactureId.hashCode() : 0);
        result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
        return result;
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

        NmActiveSubstancesEntity that = (NmActiveSubstancesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        if (manufactureId != null ? !manufactureId.equals(that.manufactureId) : that.manufactureId != null)
        {
            return false;
        }
        if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null)
        {
            return false;
        }

        return true;
    }
}
