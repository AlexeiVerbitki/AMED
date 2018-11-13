package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "license_agent_pharmaceutist", schema = "amed", catalog = "")
public class LicenseAgentPharmaceutistEntity
{
    private Integer id;
    private Timestamp insertionDate;
    private Timestamp selectionDate;
    private String fullName;

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
    @Column(name = "insertion_date")
    public Timestamp getInsertionDate()
    {
        return insertionDate;
    }

    public void setInsertionDate(Timestamp insertionDate)
    {
        this.insertionDate = insertionDate;
    }

    @Basic
    @Column(name = "selection_date")
    public Timestamp getSelectionDate()
    {
        return selectionDate;
    }

    public void setSelectionDate(Timestamp selectionDate)
    {
        this.selectionDate = selectionDate;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseAgentPharmaceutistEntity that = (LicenseAgentPharmaceutistEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(insertionDate, that.insertionDate) &&
                Objects.equals(selectionDate, that.selectionDate);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, insertionDate, selectionDate);
    }

    @Basic
    @Column(name = "full_name")
    public String getFullName()
    {
        return fullName;
    }

    public void setFullName(String fullName)
    {
        this.fullName = fullName;
    }
}
