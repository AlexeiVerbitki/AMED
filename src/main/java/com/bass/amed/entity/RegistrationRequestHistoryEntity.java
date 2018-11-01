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
    private String step;
    private Integer registrationRequestId;

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

    @Basic
    @Column(name = "start_date", nullable = true)
    public Timestamp getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Timestamp startDate)
    {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "end_date", nullable = true)
    public Timestamp getEndDate()
    {
        return endDate;
    }

    public void setEndDate(Timestamp endDate)
    {
        this.endDate = endDate;
    }

    @Basic
    @Column(name = "username", nullable = true, length = 100)
    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    @Basic
    @Column(name = "step", nullable = true, length = 2)
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
        if (!(o instanceof RegistrationRequestHistoryEntity))
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
        if (step != null ? !step.equals(that.step) : that.step != null)
        {
            return false;
        }
        return registrationRequestId != null ? registrationRequestId.equals(that.registrationRequestId) : that.registrationRequestId == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        result = 31 * result + (endDate != null ? endDate.hashCode() : 0);
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (step != null ? step.hashCode() : 0);
        result = 31 * result + (registrationRequestId != null ? registrationRequestId.hashCode() : 0);
        return result;
    }

    @Basic
    @Column(name = "registration_request_id", nullable = true)
    public Integer getRegistrationRequestId()
    {
        return registrationRequestId;
    }

    public void setRegistrationRequestId(Integer registrationRequestId)
    {
        this.registrationRequestId = registrationRequestId;
    }
}
