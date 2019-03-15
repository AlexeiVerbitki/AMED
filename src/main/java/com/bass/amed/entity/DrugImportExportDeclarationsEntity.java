package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Data
@Entity
@Table(name = "drug_import_export_declarations", schema = "amed")
public class DrugImportExportDeclarationsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "subst_active_quantity_used")
    private Double substActiveQuantityUsed;
    @Basic
    @Column(name = "declaration_date")
    private Timestamp declarationDate;
    @Basic
    @Column(name = "quantity")
    private Double quantity;
    @Column(name = "group_key")
    private Integer groupKey;


}
