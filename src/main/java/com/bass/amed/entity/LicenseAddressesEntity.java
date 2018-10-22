package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "license_addresses", schema = "amed", catalog = "")
public class LicenseAddressesEntity
{
    private Integer id;
    private String companyType;
    private String street;
    private String building;
    private NmLocalitiesEntity locality;
    private NmStatesEntity state;

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
    @Column(name = "company_type")
    public String getCompanyType()
    {
        return companyType;
    }

    public void setCompanyType(String companyType)
    {
        this.companyType = companyType;
    }

    @Basic
    @Column(name = "street")
    public String getStreet()
    {
        return street;
    }

    public void setStreet(String street)
    {
        this.street = street;
    }

    @Basic
    @Column(name = "building")
    public String getBuilding()
    {
        return building;
    }

    public void setBuilding(String building)
    {
        this.building = building;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "locality_id")
    public NmLocalitiesEntity getLocality()
    {
        return locality;
    }

    @Transient
    public NmStatesEntity getState()
    {
        return state;
    }

    public void setState(NmStatesEntity state)
    {
        this.state = state;
    }

    public void setLocality(NmLocalitiesEntity locality)
    {
        this.locality = locality;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseAddressesEntity that = (LicenseAddressesEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(companyType, that.companyType) &&
                Objects.equals(street, that.street) &&
                Objects.equals(building, that.building);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, companyType, street, building);
    }
}
