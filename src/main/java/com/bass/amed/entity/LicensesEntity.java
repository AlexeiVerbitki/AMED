package com.bass.amed.entity;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "licenses", schema = "amed")
public class LicensesEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;

    @Basic
    @Column(name = "serial_nr")
    private String serialNr;
    @Basic
    @Column(name = "nr")
    private String nr;
    @Basic
    @Column(name = "release_date")
    private Date releaseDate;
    @Basic
    @Column(name = "cessation_date")
    private Date cessationDate;
    @Basic
    @Column(name = "expiration_date")
    private Date expirationDate;
    @Basic
    @Column(name = "status")
    private String status;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "ec_agent_id" )
    private NmEconomicAgentsEntity economicAgent;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "cessation_reason_id")
    private LicenseCessationReasonsEntity cessationReasons;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private Set<LicenseAddressesEntity> addresses;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private Set<LicenseDetailsEntity> details = new HashSet<>();

    @Transient
    private LicenseDetailsEntity detail;

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getSerialNr()
    {
        return serialNr;
    }

    public void setSerialNr(String serialNr)
    {
        this.serialNr = serialNr;
    }

    public String getNr()
    {
        return nr;
    }

    public void setNr(String nr)
    {
        this.nr = nr;
    }

    public Date getReleaseDate()
    {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate)
    {
        this.releaseDate = releaseDate;
    }

    public Date getCessationDate()
    {
        return cessationDate;
    }

    public void setCessationDate(Date cessationDate)
    {
        this.cessationDate = cessationDate;
    }

    public Date getExpirationDate()
    {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate)
    {
        this.expirationDate = expirationDate;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public LicenseCessationReasonsEntity getCessationReasons()
    {
        return cessationReasons;
    }

    public void setCessationReasons(LicenseCessationReasonsEntity cessationReasons)
    {
        this.cessationReasons = cessationReasons;
    }

    public NmEconomicAgentsEntity getEconomicAgent()
    {
        return economicAgent;
    }

    public void setEconomicAgent(NmEconomicAgentsEntity economicAgent)
    {
        this.economicAgent = economicAgent;
    }


    public Set<LicenseAddressesEntity> getAddresses()
    {
        return addresses;
    }

    public void setAddresses(Set<LicenseAddressesEntity> addresses)
    {
        this.addresses = addresses;
    }

    public Set<LicenseDetailsEntity> getDetails()
    {
        return details;
    }

    public void setDetails(Set<LicenseDetailsEntity> details)
    {
        this.details = details;
    }

    public LicenseDetailsEntity getDetail()
    {
        return detail;
    }

    public void setDetail(LicenseDetailsEntity detail)
    {
        this.detail = detail;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicensesEntity that = (LicensesEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(serialNr, that.serialNr) &&
                Objects.equals(nr, that.nr) &&
                Objects.equals(releaseDate, that.releaseDate) &&
                Objects.equals(cessationDate, that.cessationDate) &&
                Objects.equals(expirationDate, that.expirationDate) &&
                Objects.equals(status, that.status) &&
                Objects.equals(economicAgent, that.economicAgent) &&
                Objects.equals(cessationReasons, that.cessationReasons) &&
                Objects.equals(addresses, that.addresses);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, serialNr, nr, releaseDate, cessationDate, expirationDate, status, economicAgent, cessationReasons, addresses);
    }
}
