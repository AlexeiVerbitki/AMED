package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "nm_prices", schema = "amed", catalog = "")
public class NmPricesEntity
{
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

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "price_request_id")
    @JsonBackReference
    private PricesEntity priceRequest;

    @Basic
    @Column(name = "expiration_date")
    private Timestamp expirationDate;
    @Basic
    @Column(name = "revision_date")
    private Timestamp revisionDate;

    @Basic
    @Column(name = "price")
    private BigDecimal price;

    @Basic
    @Column(name = "price_mdl")
    private BigDecimal priceMdl;

    @Basic
    @Column(name = "status")
    private String status;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "currency_id")
    private NmCurrenciesEntity currency;

    @Override
    public String toString() {
        return "NmPricesEntity{" +
                "id=" + id +
                ", orderNr='" + orderNr + '\'' +
                ", orderApprovDate=" + orderApprovDate +
                ", medicament=" + medicament +
                ", expirationDate=" + expirationDate +
                ", revisionDate=" + revisionDate +
                ", price=" + price +
                ", status=" + status +
                ", priceMdl=" + priceMdl +
                ", currency=" + currency +
                '}';
    }
}
