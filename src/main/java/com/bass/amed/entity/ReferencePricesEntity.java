package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "reference_prices", schema = "amed")
public class ReferencePricesEntity
{

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Basic
    @Column(name = "value")
    private BigDecimal value;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    private NmCountriesEntity country;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "currency_id", referencedColumnName = "id", nullable = false)
    private NmCurrenciesEntity currency;
    @Basic
    @Column(name = "price_id")
    private Integer priceId;
    @Basic
    @Column(name = "total_quantity")
    private Integer totalQuantity;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_id", referencedColumnName = "id", nullable = false)
    private PriceTypesEntity type;
    @Basic
    @Column(name = "division")
    private String division;
}
