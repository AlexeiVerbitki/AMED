package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name="nm_medical_institutions")
public class CtMedicalInstitutionEntity {

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

    @Transient
    private Set<CtInvestigatorEntity> investigators = new HashSet<>();

    public Set<CtInvestigatorEntity> getInvestigators() {
        return investigators;
    }

    public void setInvestigators(Set<CtInvestigatorEntity> investigators) {
        this.investigators = investigators;
    }

    public void asign(CtMedicalInstitutionEntity other){
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

//    public List<CtMedInstInvestigatorEntity> getCtMedInstInvestigatorEntities() {
//        return ctMedInstInvestigatorEntities;
//    }
//
//    public void setCtMedInstInvestigatorEntities(List<CtMedInstInvestigatorEntity> ctMedInstInvestigatorEntities) {
//        this.ctMedInstInvestigatorEntities = ctMedInstInvestigatorEntities;
//    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtMedicalInstitutionEntity that = (CtMedicalInstitutionEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(codIms, that.codIms) &&
                Objects.equals(name, that.name) &&
                Objects.equals(address, that.address) /*&&
                Objects.equals(ctMedInstInvestigatorEntities, that.ctMedInstInvestigatorEntities)*/;
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, codIms, name, address/*, ctMedInstInvestigatorEntities*/);
    }
}
