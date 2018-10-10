package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_banks", schema = "amed", catalog = "")
public class NmBanksEntity
{
    private Integer id;
    private String code;
    private String description;
    private Integer parent;
    private String longDescription;
    private String address;
    private String bankCode;
    private String phonenumbers;

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
    @Column(name = "parent")
    public Integer getParent()
    {
        return parent;
    }

    public void setParent(Integer parent)
    {
        this.parent = parent;
    }

    @Basic
    @Column(name = "long_description")
    public String getLongDescription()
    {
        return longDescription;
    }

    public void setLongDescription(String longDescription)
    {
        this.longDescription = longDescription;
    }

    @Basic
    @Column(name = "address")
    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    @Basic
    @Column(name = "bank_code")
    public String getBankCode()
    {
        return bankCode;
    }

    public void setBankCode(String bankCode)
    {
        this.bankCode = bankCode;
    }

    @Basic
    @Column(name = "phonenumbers")
    public String getPhonenumbers()
    {
        return phonenumbers;
    }

    public void setPhonenumbers(String phonenumbers)
    {
        this.phonenumbers = phonenumbers;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (parent != null ? parent.hashCode() : 0);
        result = 31 * result + (longDescription != null ? longDescription.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (bankCode != null ? bankCode.hashCode() : 0);
        result = 31 * result + (phonenumbers != null ? phonenumbers.hashCode() : 0);
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

        NmBanksEntity that = (NmBanksEntity) o;

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
        if (parent != null ? !parent.equals(that.parent) : that.parent != null)
        {
            return false;
        }
        if (longDescription != null ? !longDescription.equals(that.longDescription) : that.longDescription != null)
        {
            return false;
        }
        if (address != null ? !address.equals(that.address) : that.address != null)
        {
            return false;
        }
        if (bankCode != null ? !bankCode.equals(that.bankCode) : that.bankCode != null)
        {
            return false;
        }
        if (phonenumbers != null ? !phonenumbers.equals(that.phonenumbers) : that.phonenumbers != null)
        {
            return false;
        }

        return true;
    }
}
