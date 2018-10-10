package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_partners", schema = "amed", catalog = "")
public class NmPartnersEntity
{
    private Integer id;
    private String code;
    private String description;
    private String fiscalCode;
    private String vatCode;

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
    @Column(name = "fiscal_code")
    public String getFiscalCode()
    {
        return fiscalCode;
    }

    public void setFiscalCode(String fiscalCode)
    {
        this.fiscalCode = fiscalCode;
    }

    @Basic
    @Column(name = "vat_code")
    public String getVatCode()
    {
        return vatCode;
    }

    public void setVatCode(String vatCode)
    {
        this.vatCode = vatCode;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (fiscalCode != null ? fiscalCode.hashCode() : 0);
        result = 31 * result + (vatCode != null ? vatCode.hashCode() : 0);
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

        NmPartnersEntity that = (NmPartnersEntity) o;

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
        if (fiscalCode != null ? !fiscalCode.equals(that.fiscalCode) : that.fiscalCode != null)
        {
            return false;
        }
        if (vatCode != null ? !vatCode.equals(that.vatCode) : that.vatCode != null)
        {
            return false;
        }

        return true;
    }
}
