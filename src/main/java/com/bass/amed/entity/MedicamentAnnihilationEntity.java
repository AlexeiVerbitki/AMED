package com.bass.amed.entity;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "medicament_annihilation", schema = "amed", catalog = "")
public class MedicamentAnnihilationEntity
{
    private Integer id;
    private Set<PaymentOrdersEntity> paymentOrders;
    private List<MedicamentAnnihilationMedsEntity> medicamentsMedicamentAnnihilationMeds;
    private String status;
    private Set<DocumentsEntity> documents;
    private Set<AnnihilationCommisionsEntity> commisions;

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

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "medicament_annihilation_payment_orders", joinColumns = {
            @JoinColumn(name = "medicament_annihilation_id")}, inverseJoinColumns = {
            @JoinColumn(name = "payment_id")})
    public Set<PaymentOrdersEntity> getPaymentOrders()
    {
        return paymentOrders;
    }

    public void setPaymentOrders(Set<PaymentOrdersEntity> paymentOrders)
    {
        this.paymentOrders = paymentOrders;
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


    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "med_annihilation_commisions", joinColumns = {
            @JoinColumn(name = "med_annihilation_id")}, inverseJoinColumns = {
            @JoinColumn(name = "annihilation_commision_id")})
    public Set<AnnihilationCommisionsEntity> getCommisions()
    {
        return commisions;
    }

    public void setCommisions(Set<AnnihilationCommisionsEntity> commisions)
    {
        this.commisions = commisions;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicamentAnnihilationEntity that = (MedicamentAnnihilationEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(paymentOrders, that.paymentOrders) &&
                Objects.equals(medicamentsMedicamentAnnihilationMeds, that.medicamentsMedicamentAnnihilationMeds) &&
                Objects.equals(status, that.status) &&
                Objects.equals(documents, that.documents);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, paymentOrders, medicamentsMedicamentAnnihilationMeds, status, documents);
    }
}
