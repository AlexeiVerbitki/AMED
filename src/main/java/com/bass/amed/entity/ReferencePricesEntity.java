package com.bass.amed.entity;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "reference_prices", schema = "amed", catalog = "")
public class ReferencePricesEntity {

    private int id;
    private BigDecimal value;
    private NmCountriesEntity country;
    private NmCurrenciesEntity currency;
    private Integer priceId;
    private PriceTypesEntity type;

    @OneToOne(fetch = FetchType.EAGER )//, cascade = CascadeType.DETACH)
    @JoinColumn(name = "type_id", referencedColumnName = "id", nullable = false)
    public PriceTypesEntity getType() {
        return type;
    }

    public void setType(PriceTypesEntity typeId) {
        this.type = typeId;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    public NmCountriesEntity getCountry() {
        return country;
    }

    public void setCountry(NmCountriesEntity country) {
        this.country = country;
    }

    @OneToOne(fetch = FetchType.EAGER )//, cascade = CascadeType.DETACH)
    @JoinColumn(name = "currency_id", referencedColumnName = "id", nullable = false)
    public NmCurrenciesEntity getCurrency() {
        return currency;
    }

    public void setCurrency(NmCurrenciesEntity currency) {
        this.currency = currency;
    }

    @Basic //, cascade = CascadeType.DETACH)
    @Column(name = "price_id")
    public Integer getPriceId() {
        return priceId;
    }

    public void setPriceId(Integer requestId) {
        this.priceId = requestId;
    }

}
