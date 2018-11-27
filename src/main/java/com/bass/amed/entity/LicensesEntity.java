package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.*;

@Data
@Entity
@Table(name = "licenses", schema = "amed")
public class LicensesEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;

    @Basic
    @Column(name = "serial_nr")
    private String serialNr;
    @Basic
    @Column(name = "nr")
    private String nr;
    @Basic
    @Column(name = "release_date")
    private Date releaseDate;
    @Basic
    @Column(name = "cessation_date")
    private Date cessationDate;
    @Basic
    @Column(name = "expiration_date")
    private Date expirationDate;
    @Basic
    @Column(name = "status")
    private String status;

    @Basic
    @Column(name = "current_status")
    private String currentStatus;

    @Basic
    @Column(name = "idno")
    private String idno;

    @Basic
    @Column(name = "closed_date")
    private Date closedDate;


    @Basic
    @Column(name = "suspend_date")
    private Date suspendDate;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private Set<NmEconomicAgentsEntity> economicAgents;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "cessation_reason_id")
    private LicenseCessationReasonsEntity cessationReasons;

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private Set<LicenseDetailsEntity> details = new HashSet<>();

    @Transient
    private LicenseDetailsEntity detail;

    @Basic
    @Column(name = "reason")
    private String reason;
}
