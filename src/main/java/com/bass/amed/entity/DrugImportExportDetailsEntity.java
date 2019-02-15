package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "drug_import_export_details", schema = "amed")
public class DrugImportExportDetailsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "company_code")
    private String companyCode;

    @Basic
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "drug_check_decisions_id")
    private Integer drugCheckDecisionsId;

//    @Basic
//    @Column(name = "substance_name")
//    private String substanceName;

//    @Basic
//    @Column(name = "authorized_drug_substances_id")
//    private Integer authorizedDrugSubstancesId;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "authorized_drug_substances_id")
    private AuthorizedDrugSubstancesEntity authorizedDrugSubstance;

    @Basic
    @Column(name = "from_date")
    private Timestamp fromDate;

    @Basic
    @Column(name = "to_date")
    private Timestamp toDate;

    @Basic
    @Column(name = "authorized_quantity")
    private Double authorizedQuantity;

    @Basic
    @Column(name = "used_quantity")
    private Double usedQuantity;

    @Basic
    @Column(name = "commercial_name")
    private String commercialName;

    @Basic
    @Column(name = "packaging")
    private String packaging;

    @Basic
    @Column(name = "packaging_quantity")
    private String packagingQuantity;

    @Basic
    @Column(name = "authorized_quantity_unit")
    private String authorizedQuantityUnit;
}
