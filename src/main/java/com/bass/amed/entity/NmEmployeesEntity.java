package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name = "nm_employees", schema = "amed")
public class NmEmployeesEntity
{
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "lastname")
    private String lastname;

    @Basic
    @Column(name = "firstname")
    private String firstname;

    @Basic
    @Column(name = "middlename")
    private String middlename;

    @Basic
    @Column(name = "birth_date")
    private Date birthDate;

    @Basic
    @Column(name = "phonenumbers")
    private String phonenumbers;

    @Basic
    @Column(name = "address")
    private String address;

    @Basic
    @Column(name = "idnp")
    private String idnp;

    @Basic
    @Column(name = "identification_document_type_id")
    private Integer identificationDocumentTypeId;

    @Basic
    @Column(name = "document_series")
    private String documentSeries;

    @Basic
    @Column(name = "document_number")
    private String documentNumber;

    @Basic
    @Column(name = "issue_date")
    private Date issueDate;

    @Basic
    @Column(name = "function")
    private String function;

    @Basic
    @Column(name = "science_degree")
    private String scienceDegree;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "profession_id" )
    private NmProfessionsEntity profession;

    @Basic
    @Column(name = "commission_order")
    private Integer commissionOrder;

    @Basic
    @Column(name = "chairman_of_experts")
    private Byte chairmanOfExperts;

    @Basic
    @Column(name = "email")
    private String email;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "departament_id" )
    private NmDepartamentEntity departament;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        NmEmployeesEntity that = (NmEmployeesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null) {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null) {
            return false;
        }
        if (name != null ? !name.equals(that.name) : that.name != null) {
            return false;
        }
        if (lastname != null ? !lastname.equals(that.lastname) : that.lastname != null) {
            return false;
        }
        if (firstname != null ? !firstname.equals(that.firstname) : that.firstname != null) {
            return false;
        }
        if (middlename != null ? !middlename.equals(that.middlename) : that.middlename != null) {
            return false;
        }
        if (birthDate != null ? !birthDate.equals(that.birthDate) : that.birthDate != null) {
            return false;
        }
        if (phonenumbers != null ? !phonenumbers.equals(that.phonenumbers) : that.phonenumbers != null) {
            return false;
        }
        if (address != null ? !address.equals(that.address) : that.address != null) {
            return false;
        }
        if (idnp != null ? !idnp.equals(that.idnp) : that.idnp != null) {
            return false;
        }
        if (identificationDocumentTypeId != null ? !identificationDocumentTypeId.equals(that.identificationDocumentTypeId) : that.identificationDocumentTypeId != null) {
            return false;
        }
        if (documentSeries != null ? !documentSeries.equals(that.documentSeries) : that.documentSeries != null) {
            return false;
        }
        if (documentNumber != null ? !documentNumber.equals(that.documentNumber) : that.documentNumber != null) {
            return false;
        }
        if (issueDate != null ? !issueDate.equals(that.issueDate) : that.issueDate != null) {
            return false;
        }
        if (function != null ? !function.equals(that.function) : that.function != null) {
            return false;
        }
        if (scienceDegree != null ? !scienceDegree.equals(that.scienceDegree) : that.scienceDegree != null) {
            return false;
        }
        if (profession != null ? !profession.equals(that.profession) : that.profession != null) {
            return false;
        }
        if (commissionOrder != null ? !commissionOrder.equals(that.commissionOrder) : that.commissionOrder != null) {
            return false;
        }
        if (chairmanOfExperts != null ? !chairmanOfExperts.equals(that.chairmanOfExperts) : that.chairmanOfExperts != null) {
            return false;
        }
        if (email != null ? !email.equals(that.email) : that.email != null) {
            return false;
        }
        return departament != null ? departament.equals(that.departament) : that.departament == null;

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (lastname != null ? lastname.hashCode() : 0);
        result = 31 * result + (firstname != null ? firstname.hashCode() : 0);
        result = 31 * result + (middlename != null ? middlename.hashCode() : 0);
        result = 31 * result + (birthDate != null ? birthDate.hashCode() : 0);
        result = 31 * result + (phonenumbers != null ? phonenumbers.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (idnp != null ? idnp.hashCode() : 0);
        result = 31 * result + (identificationDocumentTypeId != null ? identificationDocumentTypeId.hashCode() : 0);
        result = 31 * result + (documentSeries != null ? documentSeries.hashCode() : 0);
        result = 31 * result + (documentNumber != null ? documentNumber.hashCode() : 0);
        result = 31 * result + (issueDate != null ? issueDate.hashCode() : 0);
        result = 31 * result + (function != null ? function.hashCode() : 0);
        result = 31 * result + (scienceDegree != null ? scienceDegree.hashCode() : 0);
        result = 31 * result + (profession != null ? profession.hashCode() : 0);
        result = 31 * result + (commissionOrder != null ? commissionOrder.hashCode() : 0);
        result = 31 * result + (chairmanOfExperts != null ? chairmanOfExperts.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (departament != null ? departament.hashCode() : 0);
        return result;
    }
}
