package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "prices", schema = "amed", catalog = "")
public class PricesEntity
{
    private Integer id;
    private String description;
    private Integer medicamentId;
    private Integer typeId;
    private Integer currencyHistoryId;

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
    @Column(name = "medicament_id")
    public Integer getMedicamentId()
    {
        return medicamentId;
    }

    public void setMedicamentId(Integer medicamentId)
    {
        this.medicamentId = medicamentId;
    }

    @Basic
    @Column(name = "type_id")
    public Integer getTypeId()
    {
        return typeId;
    }

    public void setTypeId(Integer typeId)
    {
        this.typeId = typeId;
    }

    @Basic
    @Column(name = "currency_history_id")
    public Integer getCurrencyHistoryId()
    {
        return currencyHistoryId;
    }

    public void setCurrencyHistoryId(Integer currencyHistoryId)
    {
        this.currencyHistoryId = currencyHistoryId;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (medicamentId != null ? medicamentId.hashCode() : 0);
        result = 31 * result + (typeId != null ? typeId.hashCode() : 0);
        result = 31 * result + (currencyHistoryId != null ? currencyHistoryId.hashCode() : 0);
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

        PricesEntity that = (PricesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        if (medicamentId != null ? !medicamentId.equals(that.medicamentId) : that.medicamentId != null)
        {
            return false;
        }
        if (typeId != null ? !typeId.equals(that.typeId) : that.typeId != null)
        {
            return false;
        }
        if (currencyHistoryId != null ? !currencyHistoryId.equals(that.currencyHistoryId) : that.currencyHistoryId != null)
        {
            return false;
        }

        return true;
    }
}
