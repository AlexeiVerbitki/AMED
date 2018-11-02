package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "license_activity_type", schema = "amed", catalog = "")
public class LicenseActivityTypeEntity
{
    private Integer id;
    private String description;

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
    @Column(name = "description")
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseActivityTypeEntity that = (LicenseActivityTypeEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(description, that.description);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, description);
    }
}