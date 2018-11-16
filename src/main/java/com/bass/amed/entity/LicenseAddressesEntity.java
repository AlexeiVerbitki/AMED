package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "license_addresses", schema = "amed")
public class LicenseAddressesEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "company_type")
    private String companyType;
    @Basic
    @Column(name = "street")
    private String street;
    @Basic
    @Column(name = "building")
    private String building;
    @OneToOne( fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "locality_id")
    private NmLocalitiesEntity locality;
    @Transient
    private NmStatesEntity state;


    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "LICENSE_ACTIVITIES", joinColumns = {
            @JoinColumn(name = "license_addresse_id")}, inverseJoinColumns = {
            @JoinColumn(name = "license_activity_type_id")})
    private Set<LicenseActivityTypeEntity> activities;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_addres_id")
    private Set<LicenseAgentPharmaceutistEntity> agentPharmaceutist;

    @Transient
    private LicenseAgentPharmaceutistEntity selectedPharmaceutist;


    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }


    public String getCompanyType()
    {
        return companyType;
    }

    public void setCompanyType(String companyType)
    {
        this.companyType = companyType;
    }


    public String getStreet()
    {
        return street;
    }

    public void setStreet(String street)
    {
        this.street = street;
    }


    public String getBuilding()
    {
        return building;
    }

    public void setBuilding(String building)
    {
        this.building = building;
    }


    public NmLocalitiesEntity getLocality()
    {
        return locality;
    }


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


    public Set<LicenseActivityTypeEntity> getActivities()
    {
        return activities;
    }

    public void setActivities(Set<LicenseActivityTypeEntity> activities)
    {
        this.activities = activities;
    }

    public Set<LicenseAgentPharmaceutistEntity> getAgentPharmaceutist()
    {
        return agentPharmaceutist;
    }

    public void setAgentPharmaceutist(Set<LicenseAgentPharmaceutistEntity> agentPharmaceutist)
    {
        this.agentPharmaceutist = agentPharmaceutist;
    }

    public LicenseAgentPharmaceutistEntity getSelectedPharmaceutist()
    {
        return selectedPharmaceutist;
    }

    public void setSelectedPharmaceutist(LicenseAgentPharmaceutistEntity selectedPharmaceutist)
    {
        this.selectedPharmaceutist = selectedPharmaceutist;
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
                Objects.equals(building, that.building) &&
                Objects.equals(locality, that.locality) &&
                Objects.equals(state, that.state) &&
                Objects.equals(activities, that.activities) &&
                Objects.equals(agentPharmaceutist, that.agentPharmaceutist) &&
                Objects.equals(selectedPharmaceutist, that.selectedPharmaceutist);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, companyType, street, building, locality, state, activities, agentPharmaceutist, selectedPharmaceutist);
    }
}
