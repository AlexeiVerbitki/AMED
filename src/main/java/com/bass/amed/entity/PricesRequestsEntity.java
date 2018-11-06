package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "prices_requests", schema = "amed", catalog = "")
public class PricesRequestsEntity {
    private int id;
    private MedicamentEntity medicament;
    private Set<DocumentsEntity> documents;
    private Set<PricesEntity> prices;
    private Set<ReferencePricesEntity> referencePrices;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "price_request_id" )
    public Set<PricesEntity> getPrices() {
        return prices;
    }

    public void setPrices(Set<PricesEntity> prices) {
        this.prices = prices;
    }


    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "price_request_id")
    public Set<ReferencePricesEntity> getReferencePrices() {
        return referencePrices;
    }

    public void setReferencePrices(Set<ReferencePricesEntity> referencePrices) {
        this.referencePrices = referencePrices;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "PRICES_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "PRICE_REQUEST_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }
    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }


    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    public MedicamentEntity getMedicament()
    {
        return medicament;
    }

    public void setMedicament(MedicamentEntity medicamentId)
    {
        this.medicament = medicamentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PricesRequestsEntity that = (PricesRequestsEntity) o;

        if (id != that.id) return false;
        if (medicament != null ? !medicament.equals(that.medicament) : that.medicament != null) return false;
        if (documents != null ? !documents.equals(that.documents) : that.documents != null) return false;
        if (prices != null ? !prices.equals(that.prices) : that.prices != null) return false;
        return referencePrices != null ? referencePrices.equals(that.referencePrices) : that.referencePrices == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (medicament != null ? medicament.hashCode() : 0);
        result = 31 * result + (documents != null ? documents.hashCode() : 0);
        result = 31 * result + (prices != null ? prices.hashCode() : 0);
        result = 31 * result + (referencePrices != null ? referencePrices.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "PricesRequestsEntity{" +
                "id=" + id +
                ", medicament=" + medicament +
                ", documents=" + documents +
                ", prices=" + prices +
                ", referencePrices=" + referencePrices +
                '}';
    }
}
