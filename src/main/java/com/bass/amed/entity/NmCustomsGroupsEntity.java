package com.bass.amed.entity;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.*;

@Entity
@Table(name = "nm_customs_groups", schema = "amed", catalog = "")
public class NmCustomsGroupsEntity
{
    private Integer id;
    private String code;
    private String description;
    private String oldId;

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
    @Column(name = "code", nullable = true, length = 45)
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "description", nullable = true, length = 150)
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @Basic
    @Column(name = "old_id", nullable = true, length = 40)
    public String getOldId()
    {
        return oldId;
    }

    public void setOldId(String oldId)
    {
        this.oldId = oldId;
    }

    @Override
    public int hashCode()
    {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(code)
                .append(description)
                .append(oldId)
                .toHashCode();
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

        NmCustomsGroupsEntity that = (NmCustomsGroupsEntity) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(code, that.code)
                .append(description, that.description)
                .append(oldId, that.oldId)
                .isEquals();
    }
}
