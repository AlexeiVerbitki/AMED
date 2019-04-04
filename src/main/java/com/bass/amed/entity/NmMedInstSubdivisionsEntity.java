package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "nm_med_inst_subdivisions")
public class NmMedInstSubdivisionsEntity {
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "med_inst_id")
    @JsonBackReference
    private NmMedicalInstitutionEntity medicalInstitutionEntity;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public NmMedicalInstitutionEntity getMedicalInstitutionEntity() {
        return medicalInstitutionEntity;
    }

    public void setMedicalInstitutionEntity(NmMedicalInstitutionEntity medicalInstitutionEntity) {
        this.medicalInstitutionEntity = medicalInstitutionEntity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NmMedInstSubdivisionsEntity that = (NmMedInstSubdivisionsEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
