package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "gmp_authorizations", schema = "amed")
public class GMPAuthorizationsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "company_id")
    private NmEconomicAgentsEntity company;
    @Basic
    @Column(name = "request_id")
    private Integer requestId;
    @Basic
    @Column(name = "release_request_id")
    private Integer releaseRequestId;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "authorization_id")
    private DocumentsEntity authorization;
    @Basic
    @Column(name = "authorization_number")
    private String authorizationNumber;
    @Basic
    @Column(name = "authorization_start_date")
    private Date authorizationStartDate;
    @Basic
    @Column(name = "authorization_end_date")
    private Date authorizationEndDate;
    @Basic
    @Column(name = "certificate_number")
    private String certificateNumber;
    @Basic
    @Column(name = "certificate_start_date")
    private Date certificateStartDate;
    @Basic
    @Column(name = "certificate_end_date")
    private Date certificateEndDate;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "certificate_id")
    private DocumentsEntity certification;
    @Basic
    @Column(name = "status")
    private String status;
    @Basic
    @Column(name = "from_date")
    private LocalDateTime fromDate;
    @Basic
    @Column(name = "to_date")
    private LocalDateTime toDate;
}
