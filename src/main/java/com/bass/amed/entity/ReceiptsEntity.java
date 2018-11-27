package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "receipts", schema = "amed", catalog = "")
public class ReceiptsEntity {
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "number")
    private String number;
    @Basic@Column(name = "payment_date")
    private Timestamp paymentDate;
    @Basic@Column(name = "payment_order_number")
    private String paymentOrderNumber;
    @Basic@Column(name = "amount")
    private Double amount;
    @Basic@Column(name = "insert_date")
    private Double insertDate;

}
