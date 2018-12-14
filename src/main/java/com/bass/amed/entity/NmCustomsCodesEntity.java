package com.bass.amed.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "nm_customs_codes", schema = "amed", catalog = "")
public class NmCustomsCodesEntity implements Serializable
{
    private Integer id;
    private String code;
    private String description;
    private Integer groupId;
    private String longDescription;
    private String units;

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
    @Column(name = "group_id")
    public Integer getGroupId()
    {
        return groupId;
    }

    public void setGroupId(Integer groupId)
    {
        this.groupId = groupId;
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
    @Column(name = "units")
    public String getUnits()
    {
        return units;
    }

    public void setUnits(String units)
    {
        this.units = units;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (groupId != null ? groupId.hashCode() : 0);
        result = 31 * result + (longDescription != null ? longDescription.hashCode() : 0);
        result = 31 * result + (units != null ? units.hashCode() : 0);
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

        NmCustomsCodesEntity that = (NmCustomsCodesEntity) o;

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
        if (groupId != null ? !groupId.equals(that.groupId) : that.groupId != null)
        {
            return false;
        }
        if (longDescription != null ? !longDescription.equals(that.longDescription) : that.longDescription != null)
        {
            return false;
        }
        if (units != null ? !units.equals(that.units) : that.units != null)
        {
            return false;
        }

        return true;
    }
}
