package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "nm_documents_archive", schema = "amed", catalog = "")
public class NmDocumentsArchiveEntity
{
    private Integer id;
    private String code;
    private String description;
    private Date documentDate;
    private Integer documentTypeId;
    private Integer partnerId;
    private String analysisNumber;
    private Date analysisDate;

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
    @Column(name = "code")
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
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
    @Column(name = "document_date")
    public Date getDocumentDate()
    {
        return documentDate;
    }

    public void setDocumentDate(Date documentDate)
    {
        this.documentDate = documentDate;
    }

    @Basic
    @Column(name = "document_type_id")
    public Integer getDocumentTypeId()
    {
        return documentTypeId;
    }

    public void setDocumentTypeId(Integer documentTypeId)
    {
        this.documentTypeId = documentTypeId;
    }

    @Basic
    @Column(name = "partner_id")
    public Integer getPartnerId()
    {
        return partnerId;
    }

    public void setPartnerId(Integer partnerId)
    {
        this.partnerId = partnerId;
    }

    @Basic
    @Column(name = "analysis_number")
    public String getAnalysisNumber()
    {
        return analysisNumber;
    }

    public void setAnalysisNumber(String analysisNumber)
    {
        this.analysisNumber = analysisNumber;
    }

    @Basic
    @Column(name = "analysis_date")
    public Date getAnalysisDate()
    {
        return analysisDate;
    }

    public void setAnalysisDate(Date analysisDate)
    {
        this.analysisDate = analysisDate;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (documentDate != null ? documentDate.hashCode() : 0);
        result = 31 * result + (documentTypeId != null ? documentTypeId.hashCode() : 0);
        result = 31 * result + (partnerId != null ? partnerId.hashCode() : 0);
        result = 31 * result + (analysisNumber != null ? analysisNumber.hashCode() : 0);
        result = 31 * result + (analysisDate != null ? analysisDate.hashCode() : 0);
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

        NmDocumentsArchiveEntity that = (NmDocumentsArchiveEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        if (documentDate != null ? !documentDate.equals(that.documentDate) : that.documentDate != null)
        {
            return false;
        }
        if (documentTypeId != null ? !documentTypeId.equals(that.documentTypeId) : that.documentTypeId != null)
        {
            return false;
        }
        if (partnerId != null ? !partnerId.equals(that.partnerId) : that.partnerId != null)
        {
            return false;
        }
        if (analysisNumber != null ? !analysisNumber.equals(that.analysisNumber) : that.analysisNumber != null)
        {
            return false;
        }
        if (analysisDate != null ? !analysisDate.equals(that.analysisDate) : that.analysisDate != null)
        {
            return false;
        }

        return true;
    }
}
