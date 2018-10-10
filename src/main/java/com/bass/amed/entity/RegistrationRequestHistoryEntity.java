package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "registration_request_history", schema = "amed", catalog = "")
public class RegistrationRequestHistoryEntity
{
    private Integer id;
    private Timestamp startDate;
    private Timestamp endDate;
    private String username;
    private Integer reistrationRequestId;
    private String step;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
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
    @Column(name = "start_date")
    public Timestamp getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Timestamp startDate)
    {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "end_date")
    public Timestamp getEndDate()
    {
        return endDate;
    }

    public void setEndDate(Timestamp endDate)
    {
        this.endDate = endDate;
    }

    @Basic
    @Column(name = "username")
    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    @Basic
    @Column(name = "registration_request_id")
    public Integer getReistrationRequestId()
    {
        return reistrationRequestId;
    }

    public void setReistrationRequestId(Integer reistrationRequestId)
    {
        this.reistrationRequestId = reistrationRequestId;
    }

    @Basic
    @Column(name = "step")
    public String getStep()
    {
        return step;
    }

    public void setStep(String step)
    {
        this.step = step;
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

        RegistrationRequestHistoryEntity that = (RegistrationRequestHistoryEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (startDate != null ? !startDate.equals(that.startDate) : that.startDate != null)
        {
            return false;
        }
        if (endDate != null ? !endDate.equals(that.endDate) : that.endDate != null)
        {
            return false;
        }
        if (username != null ? !username.equals(that.username) : that.username != null)
        {
            return false;
        }
        if (reistrationRequestId != null ? !reistrationRequestId.equals(that.reistrationRequestId) : that.reistrationRequestId != null)
        {
            return false;
        }
        return step != null ? step.equals(that.step) : that.step == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        result = 31 * result + (endDate != null ? endDate.hashCode() : 0);
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (reistrationRequestId != null ? reistrationRequestId.hashCode() : 0);
        result = 31 * result + (step != null ? step.hashCode() : 0);
        return result;
    }
}
