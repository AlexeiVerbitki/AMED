package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "samsa", schema = "amed", catalog = "")
public class SamsaEntity
{
    private Integer id;
    private Integer medicamentId;
    private Integer distributionMandateNr;
    private Date distributionMandateDate;

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
    @Column(name = "distribution_mandate_nr")
    public Integer getDistributionMandateNr()
    {
        return distributionMandateNr;
    }

    public void setDistributionMandateNr(Integer distributionMandateNr)
    {
        this.distributionMandateNr = distributionMandateNr;
    }

    @Basic
    @Column(name = "distribution_mandate_date")
    public Date getDistributionMandateDate()
    {
        return distributionMandateDate;
    }

    public void setDistributionMandateDate(Date distributionMandateDate)
    {
        this.distributionMandateDate = distributionMandateDate;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (medicamentId != null ? medicamentId.hashCode() : 0);
        result = 31 * result + (distributionMandateNr != null ? distributionMandateNr.hashCode() : 0);
        result = 31 * result + (distributionMandateDate != null ? distributionMandateDate.hashCode() : 0);
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

        SamsaEntity that = (SamsaEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (medicamentId != null ? !medicamentId.equals(that.medicamentId) : that.medicamentId != null)
        {
            return false;
        }
        if (distributionMandateNr != null ? !distributionMandateNr.equals(that.distributionMandateNr) : that.distributionMandateNr != null)
        {
            return false;
        }
        if (distributionMandateDate != null ? !distributionMandateDate.equals(that.distributionMandateDate) : that.distributionMandateDate != null)
        {
            return false;
        }

        return true;
    }
}
