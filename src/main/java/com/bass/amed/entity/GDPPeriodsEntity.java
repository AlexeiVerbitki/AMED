package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "gdp_periods", schema = "amed")
public class GDPPeriodsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "gdp_inspection_id")
    private Integer gdpInspectionId;

    @Basic
    @Column(name = "from_date")
    private Timestamp fromDate;

    @Basic
    @Column(name = "to_date")
    private Timestamp toDate;

}
