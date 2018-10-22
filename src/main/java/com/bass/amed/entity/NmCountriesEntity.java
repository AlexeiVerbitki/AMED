package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_countries", schema = "amed", catalog = "")
public class NmCountriesEntity
{
    private Integer id;
    private String code;
    private String description;
    private NmCountryGroupEntity group;

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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "group_id" )
    public NmCountryGroupEntity getGroup()
    {
        return group;
    }

    public void setGroup(NmCountryGroupEntity group)
    {
        this.group = group;
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

        NmCountriesEntity that = (NmCountriesEntity) o;

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
        return group != null ? group.equals(that.group) : that.group == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (group != null ? group.hashCode() : 0);
        return result;
    }
}
