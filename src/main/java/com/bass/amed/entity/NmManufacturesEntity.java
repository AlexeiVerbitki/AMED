package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_manufactures", schema = "amed", catalog = "")
public class NmManufacturesEntity
{
    private Integer id;
    private String code;
    private String description;
    private String longDescription;
    private String idno;
    private NmCountriesEntity country;
    private Byte authorizationHolder;
    private String address;

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
    @Column(name = "idno")
    public String getIdno()
    {
        return idno;
    }

    public void setIdno(String idno)
    {
        this.idno = idno;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "country_id" )
    public NmCountriesEntity getCountry()
    {
        return country;
    }

    public void setCountry(NmCountriesEntity country)
    {
        this.country = country;
    }


    @Basic
    @Column(name = "authorization_holder")
    public Byte getAuthorizationHolder()
    {
        return authorizationHolder;
    }

    public void setAuthorizationHolder(Byte authorizationHolder)
    {
        this.authorizationHolder = authorizationHolder;
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

        NmManufacturesEntity that = (NmManufacturesEntity) o;

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
        if (longDescription != null ? !longDescription.equals(that.longDescription) : that.longDescription != null)
        {
            return false;
        }
        if (idno != null ? !idno.equals(that.idno) : that.idno != null)
        {
            return false;
        }
        if (country != null ? !country.equals(that.country) : that.country != null)
        {
            return false;
        }
        if (authorizationHolder != null ? !authorizationHolder.equals(that.authorizationHolder) : that.authorizationHolder != null)
        {
            return false;
        }
        return address != null ? address.equals(that.address) : that.address == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (longDescription != null ? longDescription.hashCode() : 0);
        result = 31 * result + (idno != null ? idno.hashCode() : 0);
        result = 31 * result + (country != null ? country.hashCode() : 0);
        result = 31 * result + (authorizationHolder != null ? authorizationHolder.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        return result;
    }
}
