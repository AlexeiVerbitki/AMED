package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Data
@Table(name = "invoice_details", schema = "amed", catalog = "")
public class InvoiceDetailsEntity {
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "approve_date")
    private Date approveDate;
    @OneToOne
    @JoinColumn(name = "medicament_id")
    private MedicamentEntity medicament;
    @Basic
    @Column(name = "price")
    private Double price;
    @Basic
    @Column(name = "priceMdl")
    private Double priceMdl;
    @OneToOne
    @JoinColumn(name = "currency_id")
    private NmCurrenciesEntity currency;
    @Basic
    @Column(name = "authorizations_number")
    private String authorizationsNumber;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
}
