package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "payment_orders", schema = "amed")
public class PaymentOrdersEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    private String number;
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
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;
}
