package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Data
@Entity
@Table(name = "ct_report_sar_llr", schema = "amed", catalog = "")
public class CtReportSarLlrEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "clinicatl_trial_id")
    private Integer clinicalTrailsId;

    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;

    @Basic
    @Column(name = "date_from")
    private Timestamp dateFrom;

    @Basic
    @Column(name = "date_to")
    private Timestamp dateTo;

    @Basic
    @Column(name = "report")
    private String report;

    @Basic
    @Column(name = "recorded_cases")
    private Integer recordedCases;

    @Basic
    @Column(name = "conclusions")
    private String conclusions;
}
