package com.bass.amed.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "prices", schema = "amed")
public class PricesEntity
{
    private Integer id;
    private BigDecimal value;
    private PriceTypesEntity type;
    private NmCurrenciesEntity currency;
    private Timestamp expirationDate;
    private PriceExpirationReasonsEntity expirationReason;
    private Set<ReferencePricesEntity> referencePrices;
    private MedicamentEntity medicament;
    private String folderNr;
    private Timestamp orderApprovDate;
    private Timestamp revisionDate;
    private BigDecimal mdlValue;
    private String orderNr;

    @Basic
    @Column(name = "order_approv_date")
    public Timestamp getOrderApprovDate() {
        return orderApprovDate;
    }

    public void setOrderApprovDate(Timestamp orderApprovDate) {
        this.orderApprovDate = orderApprovDate;
    }

    @Basic
    @Column(name = "order_nr")
    public String getOrderNr() {
        return orderNr;
    }

    public void setOrderNr(String orderNr) {
        this.orderNr = orderNr;
    }

    @Basic
    @Column(name = "revision_date")
    public Timestamp getRevisionDate() {
        return revisionDate;
    }

    public void setRevisionDate(Timestamp revisionDate) {
        this.revisionDate = revisionDate;
    }

    @Basic
    @Column(name = "mdl_value")
    public BigDecimal getMdlValue() {
        return mdlValue;
    }

    public void setMdlValue(BigDecimal mdlValue) {
        this.mdlValue = mdlValue;
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

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "price_id")
    public Set<ReferencePricesEntity> getReferencePrices() {
        return referencePrices;
    }

    public void setReferencePrices(Set<ReferencePricesEntity> referencePrices) {
        this.referencePrices = referencePrices;
    }

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
    @Column(name = "folder_nr")
    public String getFolderNr() {
        return folderNr;
    }

    public void setFolderNr(String folderNr) {
        this.folderNr = folderNr;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PricesEntity that = (PricesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (value != null ? !value.equals(that.value) : that.value != null) return false;
        if (type != null ? !type.equals(that.type) : that.type != null) return false;
        if (currency != null ? !currency.equals(that.currency) : that.currency != null) return false;
        if (expirationDate != null ? !expirationDate.equals(that.expirationDate) : that.expirationDate != null)
            return false;
        if (expirationReason != null ? !expirationReason.equals(that.expirationReason) : that.expirationReason != null)
            return false;
        if (referencePrices != null ? !referencePrices.equals(that.referencePrices) : that.referencePrices != null)
            return false;
        if (medicament != null ? !medicament.equals(that.medicament) : that.medicament != null) return false;
        if (folderNr != null ? !folderNr.equals(that.folderNr) : that.folderNr != null) return false;
        if (orderApprovDate != null ? !orderApprovDate.equals(that.orderApprovDate) : that.orderApprovDate != null)
            return false;
        if (revisionDate != null ? !revisionDate.equals(that.revisionDate) : that.revisionDate != null) return false;
        if (mdlValue != null ? !mdlValue.equals(that.mdlValue) : that.mdlValue != null) return false;
        return orderNr != null ? orderNr.equals(that.orderNr) : that.orderNr == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (currency != null ? currency.hashCode() : 0);
        result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
        result = 31 * result + (expirationReason != null ? expirationReason.hashCode() : 0);
        result = 31 * result + (referencePrices != null ? referencePrices.hashCode() : 0);
        result = 31 * result + (medicament != null ? medicament.hashCode() : 0);
        result = 31 * result + (folderNr != null ? folderNr.hashCode() : 0);
        result = 31 * result + (orderApprovDate != null ? orderApprovDate.hashCode() : 0);
        result = 31 * result + (revisionDate != null ? revisionDate.hashCode() : 0);
        result = 31 * result + (mdlValue != null ? mdlValue.hashCode() : 0);
        result = 31 * result + (orderNr != null ? orderNr.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "PricesEntity{" +
                "id=" + id +
                ", value=" + value +
                ", type=" + type +
                ", currency=" + currency +
                ", expirationDate=" + expirationDate +
                ", expirationReason=" + expirationReason +
                ", referencePrices=" + referencePrices +
                ", medicament=" + medicament +
                ", folderNr='" + folderNr + '\'' +
                ", orderApprovDate=" + orderApprovDate +
                ", revisionDate=" + revisionDate +
                ", mdlValue=" + mdlValue +
                ", orderNr='" + orderNr + '\'' +
                '}';
    }
}
