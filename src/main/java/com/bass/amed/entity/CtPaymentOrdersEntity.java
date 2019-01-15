package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "ct_payment_orders", schema = "amed", catalog = "")
public class CtPaymentOrdersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;
    @Basic
    @Column(name = "number")
    private Integer number;
    @Basic
    @Column(name = "date")
    private Timestamp date;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "paymant_order_id")
    private Set<CtPayOrdServEntity> ctPayOrderServices = new HashSet<>();



//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        CtPaymentOrdersEntity that = (CtPaymentOrdersEntity) o;
//        return Objects.equals(id, that.id) &&
//                Objects.equals(registrationRequestId, that.registrationRequestId) &&
//                Objects.equals(number, that.number) &&
//                Objects.equals(date, that.date) &&
//                Objects.equals(supplementaryPayment, that.supplementaryPayment);
//    }
//
//    @Override
//    public int hashCode() {
//
//        return Objects.hash(id, registrationRequestId, number, date, supplementaryPayment);
//    }
}
