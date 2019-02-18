package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Data
@Entity
@Table(name = "gdp_subsidiaries", schema = "amed")
public class GDPSubsidiaryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "gdp_inspection_id")
    private Integer gdpInspectionId;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "subsidiary_id")
    private NmEconomicAgentsEntity subsidiary;

}
