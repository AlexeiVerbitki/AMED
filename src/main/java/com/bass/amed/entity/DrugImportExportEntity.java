package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "drug_import_export", schema = "amed")
public class DrugImportExportEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer   id;
    @Basic
    @Column(name = "from_date")
    private Timestamp fromDate;
    @Basic
    @Column(name = "to_date")
    private Timestamp toDate;
    @Basic
    @Column(name = "commercial_name")
    private String    commercialName;
    @Basic
    @Column(name = "packaging")
    private String    packaging;
    @Basic
    @Column(name = "packaging_quantity")
    private Double    packagingQuantity;
    @Basic
    @Column(name = "request_quantity_unit_code")
    private String    requestQuantityUnitCode;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "drug_import_export_id")
    private Set<DrugImportExportDetailsEntity> details = new HashSet<>();
}
