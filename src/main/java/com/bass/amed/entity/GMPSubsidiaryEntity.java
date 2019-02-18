package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_subsidiaries", schema = "amed")
public class GMPSubsidiaryEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "gmp_id")
    private Integer gmpInspectionId;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "subsidiary_id")
    private NmEconomicAgentsEntity subsidiary;

}
