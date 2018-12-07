package com.bass.amed.entity;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "prices_history", schema = "amed", catalog = "")
public class PricesHistoryEntity
{
    public PricesHistoryEntity(){}

    public PricesHistoryEntity(NmPricesEntity nmPrice){
        setOrderNr(nmPrice.getOrderNr());
        setOrderApprovDate(nmPrice.getOrderApprovDate());
        setMedicament(nmPrice.getMedicament());
        setRevisionDate(nmPrice.getRevisionDate());
        setPrice(nmPrice.getPrice());
        setPriceMdl(nmPrice.getPriceMdl());
        setCurrency(nmPrice.getCurrency());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "order_nr")
    private String orderNr;

    @Basic
    @Column(name = "order_approv_date")
    private Date orderApprovDate;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    private MedicamentEntity medicament;

    @Basic
    @Column(name = "revision_date")
    private Date revisionDate;

    @Basic
    @Column(name = "price")
    private Double price;

    @Basic
    @Column(name = "price_mdl")
    private Double priceMdl;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "currency_id")
    private NmCurrenciesEntity currency;
}
