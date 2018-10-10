package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "nm_traffic_archive", schema = "amed", catalog = "")
public class NmTrafficArchiveEntity
{
    private Integer id;
    private String code;
    private Integer startSeries;
    private Integer endSeries;
    private Integer documentId;
    private String ceritificateNumber;
    private Date certificateDate;
    private String medicamentSeries;

    @Id
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
    @Column(name = "code", nullable = true, length = 10)
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "start_series", nullable = true)
    public Integer getStartSeries()
    {
        return startSeries;
    }

    public void setStartSeries(Integer startSeries)
    {
        this.startSeries = startSeries;
    }

    @Basic
    @Column(name = "end_series", nullable = true)
    public Integer getEndSeries()
    {
        return endSeries;
    }

    public void setEndSeries(Integer endSeries)
    {
        this.endSeries = endSeries;
    }

    @Basic
    @Column(name = "document_id", nullable = true)
    public Integer getDocumentId()
    {
        return documentId;
    }

    public void setDocumentId(Integer documentId)
    {
        this.documentId = documentId;
    }

    @Basic
    @Column(name = "ceritificate_number", nullable = true, length = 10)
    public String getCeritificateNumber()
    {
        return ceritificateNumber;
    }

    public void setCeritificateNumber(String ceritificateNumber)
    {
        this.ceritificateNumber = ceritificateNumber;
    }

    @Basic
    @Column(name = "certificate_date", nullable = true)
    public Date getCertificateDate()
    {
        return certificateDate;
    }

    public void setCertificateDate(Date certificateDate)
    {
        this.certificateDate = certificateDate;
    }

    @Basic
    @Column(name = "medicament_series", nullable = true, length = 10)
    public String getMedicamentSeries()
    {
        return medicamentSeries;
    }

    public void setMedicamentSeries(String medicamentSeries)
    {
        this.medicamentSeries = medicamentSeries;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (startSeries != null ? startSeries.hashCode() : 0);
        result = 31 * result + (endSeries != null ? endSeries.hashCode() : 0);
        result = 31 * result + (documentId != null ? documentId.hashCode() : 0);
        result = 31 * result + (ceritificateNumber != null ? ceritificateNumber.hashCode() : 0);
        result = 31 * result + (certificateDate != null ? certificateDate.hashCode() : 0);
        result = 31 * result + (medicamentSeries != null ? medicamentSeries.hashCode() : 0);
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

        NmTrafficArchiveEntity that = (NmTrafficArchiveEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (startSeries != null ? !startSeries.equals(that.startSeries) : that.startSeries != null)
        {
            return false;
        }
        if (endSeries != null ? !endSeries.equals(that.endSeries) : that.endSeries != null)
        {
            return false;
        }
        if (documentId != null ? !documentId.equals(that.documentId) : that.documentId != null)
        {
            return false;
        }
        if (ceritificateNumber != null ? !ceritificateNumber.equals(that.ceritificateNumber) : that.ceritificateNumber != null)
        {
            return false;
        }
        if (certificateDate != null ? !certificateDate.equals(that.certificateDate) : that.certificateDate != null)
        {
            return false;
        }
        if (medicamentSeries != null ? !medicamentSeries.equals(that.medicamentSeries) : that.medicamentSeries != null)
        {
            return false;
        }

        return true;
    }
}
