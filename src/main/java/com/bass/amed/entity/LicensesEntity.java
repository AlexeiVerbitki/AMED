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
    private Date cessationDate; //???\
    @Basic
    @Column(name = "expiration_date")
    private Date expirationDate;
    @Basic
    @Column(name = "status")
    private String status;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "cessation_reason_id")
    private LicenseCessationReasonsEntity cessationReasons;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "resolution_id")
    private LicenseResolutionEntity resolution;

    @OneToOne( fetch = FetchType.EAGER, cascade = {CascadeType.ALL})
    @JoinColumn(name = "mandated_contact_id")
    private LicenseMandatedContactEntity mandatedContact;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "LICENSE_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "LICENSE_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    private Set<DocumentsEntity> documents;


    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private Set<LicenseAddressesEntity> addresses;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private Set<LicenseCommisionResponseEntity> commisionResponses;

    @Basic
    @Column(name = "tax")
    private Double tax;

    @Basic
    @Column(name = "tax_paid")
    private Byte taxPaid;

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

    public LicenseResolutionEntity getResolution()
    {
        return resolution;
    }

    public void setResolution(LicenseResolutionEntity resolution)
    {
        this.resolution = resolution;
    }

    public LicenseMandatedContactEntity getMandatedContact()
    {
        return mandatedContact;
    }

    public void setMandatedContact(LicenseMandatedContactEntity mandatedContact)
    {
        this.mandatedContact = mandatedContact;
    }

    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    public Set<LicenseAddressesEntity> getAddresses()
    {
        return addresses;
    }

    public void setAddresses(Set<LicenseAddressesEntity> addresses)
    {
        this.addresses = addresses;
    }

    public Set<LicenseCommisionResponseEntity> getCommisionResponses()
    {
        return commisionResponses;
    }

    public void setCommisionResponses(Set<LicenseCommisionResponseEntity> commisionResponses)
    {
        this.commisionResponses = commisionResponses;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicensesEntity that = (LicensesEntity) o;
        return id == that.id &&
                Objects.equals(serialNr, that.serialNr) &&
                Objects.equals(nr, that.nr) &&
                Objects.equals(releaseDate, that.releaseDate) &&
                Objects.equals(cessationDate, that.cessationDate) &&
                Objects.equals(expirationDate, that.expirationDate) &&
                Objects.equals(status, that.status) &&
                Objects.equals(cessationReasons, that.cessationReasons) &&
                Objects.equals(resolution, that.resolution) &&
                Objects.equals(mandatedContact, that.mandatedContact) &&
                Objects.equals(documents, that.documents);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, serialNr, nr, releaseDate, cessationDate, expirationDate, status, cessationReasons, resolution, mandatedContact, documents);
    }

    @Override
    public String toString()
    {
        return "LicensesEntity{" +
                "id=" + id +
                ", serialNr='" + serialNr + '\'' +
                ", nr=" + nr +
                ", releaseDate=" + releaseDate +
                ", cessationDate=" + cessationDate +
                ", expirationDate=" + expirationDate +
                ", status='" + status + '\'' +
                '}';
    }

    public Double getTax()
    {
        return tax;
    }

    public void setTax(Double tax)
    {
        this.tax = tax;
    }


    public Byte getTaxPaid()
    {
        return taxPaid;
    }

    public void setTaxPaid(Byte taxPaid)
    {
        this.taxPaid = taxPaid;
    }
}
