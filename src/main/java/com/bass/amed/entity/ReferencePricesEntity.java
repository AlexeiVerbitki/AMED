package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "reference_prices", schema = "amed", catalog = "")
public class ReferencePricesEntity {
    private int id;
    private int price;
    private NmCountriesEntity country;
    private NmCurrenciesEntity currency;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "price")
    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ReferencePricesEntity that = (ReferencePricesEntity) o;

        if (id != that.id) return false;
        if (price != that.price) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + price;
        return result;
    }

    @OneToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    public NmCountriesEntity getCountry() {
        return country;
    }

    public void setCountry(NmCountriesEntity country) {
        this.country = country;
    }

    @OneToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "id", nullable = false)
    public NmCurrenciesEntity getCurrency() {
        return currency;
    }

    public void setCurrency(NmCurrenciesEntity curreny) {
        this.currency = curreny;
    }
}
