package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "medicament_annihilation", schema = "amed", catalog = "")
public class MedicamentAnnihilationEntity
{
    private Integer id;
    private String note;
    private Set<PaymentOrdersEntity> paymentOrders;
    private Set<ReceiptsEntity> receipts;
    private List<MedicamentAnnihilationMedsEntity> medicamentsMedicamentAnnihilationMeds;
    private String status;
    private Set<DocumentsEntity> documents;

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
    @Column(name = "note")
    public String getNote()
    {
        return note;
    }

    public void setNote(String note)
    {
        this.note = note;
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

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "medicament_annihilation_receipts", joinColumns = {
            @JoinColumn(name = "medicament_annihilation_id")}, inverseJoinColumns = {
            @JoinColumn(name = "receipt_id")})
    public Set<ReceiptsEntity> getReceipts()
    {
        return receipts;
    }

    public void setReceipts(Set<ReceiptsEntity> receipts)
    {
        this.receipts = receipts;
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


    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedicamentAnnihilationEntity that = (MedicamentAnnihilationEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(note, that.note) &&
                Objects.equals(paymentOrders, that.paymentOrders) &&
                Objects.equals(receipts, that.receipts) &&
                Objects.equals(medicamentsMedicamentAnnihilationMeds, that.medicamentsMedicamentAnnihilationMeds) &&
                Objects.equals(status, that.status) &&
                Objects.equals(documents, that.documents);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, note, paymentOrders, receipts, medicamentsMedicamentAnnihilationMeds, status, documents);
    }
}
