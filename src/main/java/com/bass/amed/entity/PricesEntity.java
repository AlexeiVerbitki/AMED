package com.bass.amed.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "prices", schema = "amed", catalog = "")
public class PricesEntity
{
    private Integer id;
    private BigDecimal value;
    private PriceTypesEntity type;
    private NmCurrenciesEntity currency;
    private Timestamp expirationDate;
    private Integer requestId;
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

    @Basic //, cascade = CascadeType.DETACH)
    @Column(name = "price_request_id")
    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
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
        if (requestId != null ? !requestId.equals(that.requestId) : that.requestId != null) return false;
        return expirationReason != null ? expirationReason.equals(that.expirationReason) : that.expirationReason == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (currency != null ? currency.hashCode() : 0);
        result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
        result = 31 * result + (requestId != null ? requestId.hashCode() : 0);
        result = 31 * result + (expirationReason != null ? expirationReason.hashCode() : 0);
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
                ", requestId=" + requestId +
                ", expirationReason=" + expirationReason +
                '}';
    }
}
