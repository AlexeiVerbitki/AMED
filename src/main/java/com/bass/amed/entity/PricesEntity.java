package com.bass.amed.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "prices", schema = "amed", catalog = "")
public class PricesEntity
{
    private Integer id;
    private String description;
    private BigDecimal value;
    private Integer medicamentId;
    private PriceTypesEntity type;
    private NmCurrenciesEntity currency;
    private Set<DocumentsEntity> documents;
    private Timestamp expirationDate;
    private PriceExpirationReasonsEntity expirationReason;

    @Basic
    @Column(name = "expiration_date")
    public Timestamp getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Timestamp expirationDate) {
        this.expirationDate = expirationDate;
    }

    @OneToOne(fetch = FetchType.EAGER) //, cascade = CascadeType.DETACH)
    @JoinColumn(name = "expiration_reason_id")
    public PriceExpirationReasonsEntity getExpirationReason() {
        return expirationReason;
    }

    public void setExpirationReason(PriceExpirationReasonsEntity expirationReason) {
        this.expirationReason = expirationReason;
    }

    @Basic
    @Column(name = "value")
    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    @OneToOne(fetch = FetchType.EAGER) //, cascade = CascadeType.DETACH)
    @JoinColumn(name = "type_id")
    public PriceTypesEntity getType() {
        return type;
    }

    public void setType(PriceTypesEntity type) {
        this.type = type;
    }

    @OneToOne( fetch = FetchType.EAGER)//, cascade = CascadeType.DETACH )
    @JoinColumn( name = "currency_id" )
    public NmCurrenciesEntity getCurrency() {
        return currency;
    }

    public void setCurrency(NmCurrenciesEntity currency) {
        this.currency = currency;
    }

    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "PRICES_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "PRICE_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }
    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "description")
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @Basic
    @Column(name = "medicament_id")
    public Integer getMedicamentId()
    {
        return medicamentId;
    }

    public void setMedicamentId(Integer medicamentId)
    {
        this.medicamentId = medicamentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PricesEntity that = (PricesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (value != null ? !value.equals(that.value) : that.value != null) return false;
        if (medicamentId != null ? !medicamentId.equals(that.medicamentId) : that.medicamentId != null) return false;
        if (type != null ? !type.equals(that.type) : that.type != null) return false;
        if (currency != null ? !currency.equals(that.currency) : that.currency != null) return false;
        return documents != null ? documents.equals(that.documents) : that.documents == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (medicamentId != null ? medicamentId.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (currency != null ? currency.hashCode() : 0);
        result = 31 * result + (documents != null ? documents.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "PricesEntity{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", value=" + value +
                ", medicamentId=" + medicamentId +
                ", type=" + type +
                ", currency=" + currency +
                ", documents=" + documents +
                '}';
    }
}
