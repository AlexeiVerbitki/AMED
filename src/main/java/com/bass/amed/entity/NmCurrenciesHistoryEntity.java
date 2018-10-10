package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "nm_currencies_history", schema = "amed", catalog = "")
public class NmCurrenciesHistoryEntity
{
    private Integer id;
    private Date period;
    private Integer value;
    private Integer multiplicity;
    private Integer currencyId;

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
    @Column(name = "period")
    public Date getPeriod()
    {
        return period;
    }

    public void setPeriod(Date period)
    {
        this.period = period;
    }

    @Basic
    @Column(name = "value")
    public Integer getValue()
    {
        return value;
    }

    public void setValue(Integer value)
    {
        this.value = value;
    }

    @Basic
    @Column(name = "multiplicity")
    public Integer getMultiplicity()
    {
        return multiplicity;
    }

    public void setMultiplicity(Integer multiplicity)
    {
        this.multiplicity = multiplicity;
    }

    @Basic
    @Column(name = "currency_id")
    public Integer getCurrencyId()
    {
        return currencyId;
    }

    public void setCurrencyId(Integer currencyId)
    {
        this.currencyId = currencyId;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (period != null ? period.hashCode() : 0);
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (multiplicity != null ? multiplicity.hashCode() : 0);
        result = 31 * result + (currencyId != null ? currencyId.hashCode() : 0);
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

        NmCurrenciesHistoryEntity that = (NmCurrenciesHistoryEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (period != null ? !period.equals(that.period) : that.period != null)
        {
            return false;
        }
        if (value != null ? !value.equals(that.value) : that.value != null)
        {
            return false;
        }
        if (multiplicity != null ? !multiplicity.equals(that.multiplicity) : that.multiplicity != null)
        {
            return false;
        }
        if (currencyId != null ? !currencyId.equals(that.currencyId) : that.currencyId != null)
        {
            return false;
        }

        return true;
    }
}
