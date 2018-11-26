package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

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
    @Column(name = "approv_date")
    private Date approvDate;
}
