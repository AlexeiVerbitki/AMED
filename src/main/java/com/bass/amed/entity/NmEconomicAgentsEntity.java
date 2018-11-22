package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name = "nm_economic_agents", schema = "amed")
public class NmEconomicAgentsEntity
{
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "idno")
    private String idno;
    @Basic
    @Column(name = "long_name")
    private String longName;
    @Basic
    @Column(name = "lccm_name")
    private String lccmName;
    @Basic
    @Column(name = "tax_code")
    private String taxCode;
    @Basic
    @Column(name = "ocpo_code")
    private String ocpoCode;
    @Basic
    @Column(name = "registration_number")
    private String registrationNumber;
    @Basic
    @Column(name = "registration_date")
    private Date registrationDate;
    @Basic
    @Column(name = "parent_id")
    private Integer parentId;
    @Basic
    @Column(name = "statut")
    private String statut;
    @Basic
    @Column(name = "filiala")
    private Byte filiala;
    @Basic
    @Column(name = "can_use_psychotropic_drugs")
    private Byte canUsePsychotropicDrugs;
    @Basic
    @Column(name = "leader")
    private String leader;
    @Basic
    @Column(name = "director")
    private String director;
    @Basic
    @Column(name = "contract_number")
    private String contractNumber;
    @Basic
    @Column(name = "contract_date")
    private Date contractDate;
    @Basic
    @Column(name = "street")
    private String street;
    @Basic
    @Column(name = "legal_address")
    private String legalAddress;
    @Basic
    @Column(name = "email")
    private String email;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "locality_id")
    private NmLocalitiesEntity locality;


}
