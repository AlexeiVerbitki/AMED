package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.*;

@Entity
@Table(name = "licenses", schema = "amed", catalog = "")
public class LicensesEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;

    @Basic
    @Column(name = "object_address")
    private String objectAddress; //???
    @Basic
    @Column(name = "serial_nr")
    private String serialNr; //???
    @Basic
    @Column(name = "nr")
    private Integer nr;
    @Basic
    @Column(name = "release_date")
    private Date releaseDate;
    @Basic
    @Column(name = "cessation_date")
    private Date cessationDate; //???\
    @Basic
    @Column(name = "expiration_date")
    private Date expirationDate;
    @Basic
    @Column(name = "status")
    private String status;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "license_req_type_id")
    private LicenseRequestTypeEntity requestType;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "cessation_reason_id")
    private LicenseCessationReasonsEntity cessationReasons;

    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "nm_economic_agent_id")
    private NmEconomicAgentsEntity economicAgent;

    @Basic
    @Column(name = "pharmacy_master")
    private String pharmacyMaster;

    @Basic
    @Column(name = "option_type")
    private String option;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "resolution_id")
    private LicenseResolutionEntity resolution;

    @OneToOne( fetch = FetchType.LAZY, cascade = {CascadeType.ALL})
    @JoinColumn(name = "mandated_contact_id")
    private LicenseMandatedContactEntity mandatedContact;

//    @OneToMany( fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
//    @JoinColumn( name = "license_id" )
//    private Set<DocumentsEntity> documents;


    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "LICENSE_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "LICENSE_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    private Set<DocumentsEntity> documents;



    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getObjectAddress()
    {
        return objectAddress;
    }

    public void setObjectAddress(String objectAddress)
    {
        this.objectAddress = objectAddress;
    }

    public String getSerialNr()
    {
        return serialNr;
    }

    public void setSerialNr(String serialNr)
    {
        this.serialNr = serialNr;
    }

    public Integer getNr()
    {
        return nr;
    }

    public void setNr(Integer nr)
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

    public LicenseRequestTypeEntity getRequestType()
    {
        return requestType;
    }

    public void setRequestType(LicenseRequestTypeEntity licenseRequestTypeEntity)
    {
        this.requestType = licenseRequestTypeEntity;
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

    public LicenseResolutionEntity getResolution()
    {
        return resolution;
    }

    public void setResolution(LicenseResolutionEntity resolution)
    {
        this.resolution = resolution;
    }

//    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
//    @JoinColumn(name = "mandated_contact_id")
//    @OneToOne(cascade = {CascadeType.ALL})
//    @JoinColumn(name = "mandated_contact_id")
    public LicenseMandatedContactEntity getMandatedContact()
    {
        return mandatedContact;
    }

    public void setMandatedContact(LicenseMandatedContactEntity mandatedContact)
    {
        this.mandatedContact = mandatedContact;
    }

    public String getPharmacyMaster()
    {
        return pharmacyMaster;
    }

    public void setPharmacyMaster(String pharmacyMaster)
    {
        this.pharmacyMaster = pharmacyMaster;
    }

    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicensesEntity that = (LicensesEntity) o;
        return id == that.id &&
                Objects.equals(objectAddress, that.objectAddress) &&
                Objects.equals(serialNr, that.serialNr) &&
                Objects.equals(nr, that.nr) &&
                Objects.equals(releaseDate, that.releaseDate) &&
                Objects.equals(cessationDate, that.cessationDate) &&
                Objects.equals(expirationDate, that.expirationDate) &&
                Objects.equals(status, that.status) &&
                Objects.equals(requestType, that.requestType) &&
                Objects.equals(cessationReasons, that.cessationReasons) &&
                Objects.equals(economicAgent, that.economicAgent) &&
                Objects.equals(pharmacyMaster, that.pharmacyMaster) &&
                Objects.equals(resolution, that.resolution) &&
                Objects.equals(mandatedContact, that.mandatedContact) &&
                Objects.equals(documents, that.documents);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, objectAddress, serialNr, nr, releaseDate, cessationDate, expirationDate, status, requestType, cessationReasons, economicAgent, pharmacyMaster, resolution, mandatedContact, documents);
    }

    @Override
    public String toString()
    {
        return "LicensesEntity{" +
                "id=" + id +
                ", objectAddress='" + objectAddress + '\'' +
                ", serialNr='" + serialNr + '\'' +
                ", nr=" + nr +
                ", releaseDate=" + releaseDate +
                ", cessationDate=" + cessationDate +
                ", expirationDate=" + expirationDate +
                ", status='" + status + '\'' +
                '}';
    }


    public String getOption()
    {
        return option;
    }

    public void setOption(String option)
    {
        this.option = option;
    }
}
