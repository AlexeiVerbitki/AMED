package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "license_commision_response", schema = "amed", catalog = "")
public class LicenseCommisionResponseEntity
{
    private Integer id;
    private Date date;
    private String entryRspNumber;
    private String organization;
    private LicenseAnnounceMethodsEntity announcedMethods;
    private String extraData;

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
    @Column(name = "entry_rsp_number")
    public String getEntryRspNumber()
    {
        return entryRspNumber;
    }

    public void setEntryRspNumber(String entryRspNumber)
    {
        this.entryRspNumber = entryRspNumber;
    }

    @Basic
    @Column(name = "organization")
    public String getOrganization()
    {
        return organization;
    }

    public void setOrganization(String organization)
    {
        this.organization = organization;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "method_id")
    public LicenseAnnounceMethodsEntity getAnnouncedMethods()
    {
        return announcedMethods;
    }

    public void setAnnouncedMethods(LicenseAnnounceMethodsEntity announcedMethods)
    {
        this.announcedMethods = announcedMethods;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseCommisionResponseEntity that = (LicenseCommisionResponseEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(date, that.date) &&
                Objects.equals(entryRspNumber, that.entryRspNumber) &&
                Objects.equals(organization, that.organization);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, date, entryRspNumber, organization);
    }

    @Basic
    @Column(name = "extra_data")
    public String getExtraData()
    {
        return extraData;
    }

    public void setExtraData(String extraData)
    {
        this.extraData = extraData;
    }
}
