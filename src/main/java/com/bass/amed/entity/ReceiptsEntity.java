package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "receipts", schema = "amed")
public class ReceiptsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "receipt_number")
    private String receiptNumber;
    @Basic
    @Column(name = "date")
    private Timestamp date;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "service_charge_id")
    private ServiceChargesEntity serviceCharge;
    @Basic
    @Column(name = "amount")
    private Double amount;
    @Basic
    @Column(name = "supplementary_payment")
    private Boolean sP;

}
