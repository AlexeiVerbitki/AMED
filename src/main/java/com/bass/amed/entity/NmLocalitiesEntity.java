package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "nm_localities", schema = "amed")
public class NmLocalitiesEntity
{
    private Integer id;
    private String code;
    private String description;
    private Integer stateId;
    private String stateName;

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
    @Column(name = "stateId")
    public Integer getStateId()
    {
        return stateId;
    }

    public void setStateId(Integer stateId)
    {
        this.stateId = stateId;
    }

    @Transient
    public String getStateName()
    {
        return stateName;
    }

    public void setStateName(String stateName)
    {
        this.stateName = stateName;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NmLocalitiesEntity that = (NmLocalitiesEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(code, that.code) &&
                Objects.equals(description, that.description) &&
                Objects.equals(stateId, that.stateId) &&
                Objects.equals(stateName, that.stateName);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, code, description, stateId, stateName);
    }
}
