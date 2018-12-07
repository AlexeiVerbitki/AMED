package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

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
    private Date expirationDate;
    @Basic
    @Column(name = "revision_date")
    private Date revisionDate;

    @Basic
    @Column(name = "price")
    private Double price;

    @Basic
    @Column(name = "price_mdl")
    private Double priceMdl;

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
