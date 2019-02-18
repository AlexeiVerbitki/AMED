package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "gmp_periods", schema = "amed")
public class GMPPeriodsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "gmp_id")
    private Integer gmpId;

    @Basic
    @Column(name = "from_date")
    private Timestamp fromDate;

    @Basic
    @Column(name = "to_date")
    private Timestamp toDate;

}
