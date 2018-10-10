package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "price_expiration", schema = "amed", catalog = "")
public class PriceExpirationEntity
{
    private Integer id;
    private String description;
    private Integer expirationReasonId;
    private Integer priceId;
    private Date expirationDate;
    private Date startDate;

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
    @Column(name = "expiration_reason_id")
    public Integer getExpirationReasonId()
    {
        return expirationReasonId;
    }

    public void setExpirationReasonId(Integer expirationReasonId)
    {
        this.expirationReasonId = expirationReasonId;
    }

    @Basic
    @Column(name = "price_id")
    public Integer getPriceId()
    {
        return priceId;
    }

    public void setPriceId(Integer priceId)
    {
        this.priceId = priceId;
    }

    @Basic
    @Column(name = "expiration_date")
    public Date getExpirationDate()
    {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate)
    {
        this.expirationDate = expirationDate;
    }

    @Basic
    @Column(name = "start_date")
    public Date getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Date startDate)
    {
        this.startDate = startDate;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (expirationReasonId != null ? expirationReasonId.hashCode() : 0);
        result = 31 * result + (priceId != null ? priceId.hashCode() : 0);
        result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
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

        PriceExpirationEntity that = (PriceExpirationEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        if (expirationReasonId != null ? !expirationReasonId.equals(that.expirationReasonId) : that.expirationReasonId != null)
        {
            return false;
        }
        if (priceId != null ? !priceId.equals(that.priceId) : that.priceId != null)
        {
            return false;
        }
        if (expirationDate != null ? !expirationDate.equals(that.expirationDate) : that.expirationDate != null)
        {
            return false;
        }
        if (startDate != null ? !startDate.equals(that.startDate) : that.startDate != null)
        {
            return false;
        }

        return true;
    }
}
