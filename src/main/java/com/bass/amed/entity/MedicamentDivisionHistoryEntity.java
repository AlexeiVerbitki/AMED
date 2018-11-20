package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "medicament_division_history", schema = "amed")
public class MedicamentDivisionHistoryEntity
{
    private Integer id;
    private String description;
    private Integer old;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Column(name = "old")
    public Integer getOld()
    {
        return old;
    }

    public void setOld(Integer old)
    {
        this.old = old;
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

        MedicamentDivisionHistoryEntity that = (MedicamentDivisionHistoryEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        return old != null ? old.equals(that.old) : that.old == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (old != null ? old.hashCode() : 0);
        return result;
    }
}
