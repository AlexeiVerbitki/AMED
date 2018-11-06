package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "nm_units_of_measurement", schema = "amed", catalog = "")
public class NmUnitsOfMeasurementEntity
{
    private Integer id;
    private String code;
    private String description;
    private String category;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
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
    @Column(name = "category")
    public String getCategory()
    {
        return category;
    }

    public void setCategory(String category)
    {
        this.category = category;
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

        NmUnitsOfMeasurementEntity that = (NmUnitsOfMeasurementEntity) o;

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
        return category != null ? category.equals(that.category) : that.category == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (category != null ? category.hashCode() : 0);
        return result;
    }
}
