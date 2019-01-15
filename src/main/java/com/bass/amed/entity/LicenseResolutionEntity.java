package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Data
@Entity
@Table(name = "license_resolution", schema = "amed")
public class LicenseResolutionEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "resolution")
    private String resolution;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "reason")
    private String reason;
    @Basic
    @Column(name = "license_detail_id")
    private Integer licenseDetailId;
}
