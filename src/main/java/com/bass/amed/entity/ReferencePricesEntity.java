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
    private Integer medicamentId;
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

    @Basic
    @Column(name = "medicament_id")
    public Integer getMedicamentId() {
        return medicamentId;
    }

    public void setMedicamentId(Integer medicamentId) {
        this.medicamentId = medicamentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ReferencePricesEntity that = (ReferencePricesEntity) o;

        if (id != that.id) return false;
        if (value != null ? !value.equals(that.value) : that.value != null) return false;
        if (country != null ? !country.equals(that.country) : that.country != null) return false;
        if (currency != null ? !currency.equals(that.currency) : that.currency != null) return false;
        if (medicamentId != null ? !medicamentId.equals(that.medicamentId) : that.medicamentId != null) return false;
        return type != null ? type.equals(that.type) : that.type == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (country != null ? country.hashCode() : 0);
        result = 31 * result + (currency != null ? currency.hashCode() : 0);
        result = 31 * result + (medicamentId != null ? medicamentId.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        return result;
    }
}
