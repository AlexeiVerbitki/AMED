package com.bass.amed.entity;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "medicament_annihilation", schema = "amed")
public class MedicamentAnnihilationEntity
{
    private Integer id;
    private List<MedicamentAnnihilationMedsEntity> medicamentsMedicamentAnnihilationMeds;
    private Set<MedicamentAnnihilationInsitutionEntity> medicamentAnnihilationInsitutions;
    private String status;
    private Set<DocumentsEntity> documents;
//    private Set<AnnihilationCommisionsEntity> commisions;
    private String idno;
    private String firstname;
    private String lastname;
    private String companyName;

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

    @Transient
    public List<MedicamentAnnihilationMedsEntity> getMedicamentsMedicamentAnnihilationMeds()
    {
        return medicamentsMedicamentAnnihilationMeds;
    }

    public void setMedicamentsMedicamentAnnihilationMeds(List<MedicamentAnnihilationMedsEntity> medicamentsMedicamentAnnihilationMeds)
    {
        this.medicamentsMedicamentAnnihilationMeds = medicamentsMedicamentAnnihilationMeds;
    }

    @Basic
    @Column(name = "status")
    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "medicament_annihilation_documents", joinColumns = {
            @JoinColumn(name = "medicament_annihilation_id")}, inverseJoinColumns = {
            @JoinColumn(name = "document_id")})
    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }


//    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
//    @JoinTable(name = "med_annihilation_commisions", joinColumns = {
//            @JoinColumn(name = "med_annihilation_id")}, inverseJoinColumns = {
//            @JoinColumn(name = "annihilation_commision_id")})
//    public Set<AnnihilationCommisionsEntity> getCommisions()
//    {
//        return commisions;
//    }
//
//    public void setCommisions(Set<AnnihilationCommisionsEntity> commisions)
//    {
//        this.commisions = commisions;
//    }

    @Basic
    @Column(name = "idno")
    public String getIdno()
    {
        return idno;
    }

    public void setIdno(String idno)
    {
        this.idno = idno;
    }

    @Basic
    @Column(name = "firstname")
    public String getFirstname()
    {
        return firstname;
    }

    public void setFirstname(String firstname)
    {
        this.firstname = firstname;
    }

    @Basic
    @Column(name = "lastname")
    public String getLastname()
    {
        return lastname;
    }

    public void setLastname(String lastname)
    {
        this.lastname = lastname;
    }

    @Transient
    public String getCompanyName()
    {
        return companyName;
    }

    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "med_annihilation_id")
    public Set<MedicamentAnnihilationInsitutionEntity> getMedicamentAnnihilationInsitutions()
    {
        return medicamentAnnihilationInsitutions;
    }

    public void setMedicamentAnnihilationInsitutions(Set<MedicamentAnnihilationInsitutionEntity> medicamentAnnihilationInsitutions)
    {
        this.medicamentAnnihilationInsitutions = medicamentAnnihilationInsitutions;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicamentAnnihilationEntity that = (MedicamentAnnihilationEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(medicamentsMedicamentAnnihilationMeds, that.medicamentsMedicamentAnnihilationMeds) &&
                Objects.equals(status, that.status) &&
                Objects.equals(documents, that.documents);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, medicamentsMedicamentAnnihilationMeds, status, documents);
    }
}
