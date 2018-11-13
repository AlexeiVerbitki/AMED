package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "license_resolution", schema = "amed", catalog = "")
public class LicenseResolutionEntity
{
    private Integer id;
    private String resolution;
    private Date date;
    private String reason;
    private Integer registrationId;

    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "resolution")
    public String getResolution()
    {
        return resolution;
    }

    public void setResolution(String resolution)
    {
        this.resolution = resolution;
    }

    @Basic
    @Column(name = "date")
    public Date getDate()
    {
        return date;
    }

    public void setDate(Date date)
    {
        this.date = date;
    }

    @Basic
    @Column(name = "reason")
    public String getReason()
    {
        return reason;
    }

    public void setReason(String reason)
    {
        this.reason = reason;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseResolutionEntity that = (LicenseResolutionEntity) o;
        return id == that.id &&
                Objects.equals(resolution, that.resolution) &&
                Objects.equals(date, that.date) &&
                Objects.equals(reason, that.reason);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, resolution, date, reason);
    }

    @Basic
    @Column(name = "registration_id")
    public Integer getRegistrationId()
    {
        return registrationId;
    }

    public void setRegistrationId(Integer registrationId)
    {
        this.registrationId = registrationId;
    }
}
