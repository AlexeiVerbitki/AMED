package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "drug_check_decisions", schema = "amed")
public class DrugCheckDecisionsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "protocol_nr")
    private String protocolNr;
    @Basic
    @Column(name = "protocol_date")
    private Date protocolDate;
    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;
    @Basic
    @Column(name = "paid_date")
    private Date paidDate;
    @Basic
    @Column(name = "paycheck_nr")
    private Integer paycheckNr;
    @Basic
    @Column(name = "paycheck_date")
    private Date paycheckDate;
    @Basic
    @Column(name = "drug_commite_id")
    private Integer drugCommiteId;
    @Basic
    @Column(name = "announcement_date")
    private Date announcementDate;
    @Basic
    @Column(name = "announcement_method_id")
    private Integer announcementMethodId;
    @Basic
    @Column(name = "cpcd_response_nr")
    private Integer cpcdResponseNr;
    @Basic
    @Column(name = "cpcd_response_date")
    private Date cpcdResponseDate;
    @Basic
    @Column(name = "drug_substance_types_id")
    private Integer drugSubstanceTypesId;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "drug_check_decisions_id")
    private Set<MedicamentEntity> medicaments = new HashSet<>();

}
