package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "ct_pay_ord_serv", schema = "amed", catalog = "")
public class CtPayOrdServEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "quantity")
    private Integer quantity;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "service_id")
    private ServiceChargesEntity serviceCharge;

    @Basic
    @Column(name = "additional_payment")
    private Double additionalPayment;
}
