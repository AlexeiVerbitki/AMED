package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "clinical_trails_investigators", schema = "amed", catalog = "")
public class ClinicalTrailsInvestigatorsEntity {
    private Integer id;
    private Integer clinicalTrailsId;
    private String firstName;
    private String lastName;
    private String title;

    @Id
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "clinical_trails_id")
    public Integer getClinicalTrailsId() {
        return clinicalTrailsId;
    }

    public void setClinicalTrailsId(Integer clinicalTrailsId) {
        this.clinicalTrailsId = clinicalTrailsId;
    }

    @Basic
    @Column(name = "first_name")
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Basic
    @Column(name = "last_name")
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Basic
    @Column(name = "title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClinicalTrailsInvestigatorsEntity that = (ClinicalTrailsInvestigatorsEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(firstName, that.firstName) &&
                Objects.equals(lastName, that.lastName) &&
                Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, firstName, lastName, title);
    }
}
