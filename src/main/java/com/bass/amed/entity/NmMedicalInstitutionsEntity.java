package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "nm_medical_institutions", schema = "amed", catalog = "")
public class NmMedicalInstitutionsEntity {
    private Integer id;
    private Integer codIms;
    private String name;
    private String address;

    @Id
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "cod_ims")
    public Integer getCodIms() {
        return codIms;
    }

    public void setCodIms(Integer codIms) {
        this.codIms = codIms;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NmMedicalInstitutionsEntity that = (NmMedicalInstitutionsEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(codIms, that.codIms) &&
                Objects.equals(name, that.name) &&
                Objects.equals(address, that.address);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, codIms, name, address);
    }
}
