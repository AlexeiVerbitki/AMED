package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "gmp_authorization", schema = "amed")
public class GMPAuthorizationEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "company_id")
    private NmEconomicAgentsEntity company;
    @Basic
    @Column(name = "manufacturing_address")
    private String manufacturingAddress;
    @Basic
    @Column(name = "manufacturing_name")
    private String manufacturingName;
    @Basic
    @Column(name = "status")
    private String status;
    @Basic
    @Column(name = "medicament_veterinary")
    private Boolean medicamentVeterinary;
    @Basic
    @Column(name = "medicament_human_use")
    private Boolean medicamentHumanUse;
    @Basic
    @Column(name = "veterinary_details")
    private String veterinaryDetails;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPSterileProductsEntity> sterileProducts = new HashSet<>();
}
