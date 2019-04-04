package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "nm_medical_institutions")
public class NmMedicalInstitutionEntity {

    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "cod_ims")
    private Integer codIms;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "address")
    private String address;

    @OneToMany(mappedBy = "medicalInstitutionEntity")
    @JsonManagedReference
    private Set<NmMedInstSubdivisionsEntity> instSubdivisionsEntities = new HashSet<>();

    public void asign(NmMedicalInstitutionEntity other) {
        this.id = other.id;
        this.codIms = other.codIms;
        this.name = other.name;
        this.address = other.address;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCodIms() {
        return codIms;
    }

    public void setCodIms(Integer codIms) {
        this.codIms = codIms;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<NmMedInstSubdivisionsEntity> getInstSubdivisionsEntities() {
        return instSubdivisionsEntities;
    }

    public void setInstSubdivisionsEntities(Set<NmMedInstSubdivisionsEntity> instSubdivisionsEntities) {
        this.instSubdivisionsEntities = instSubdivisionsEntities;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NmMedicalInstitutionEntity that = (NmMedicalInstitutionEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, codIms, name, address);
    }
}
