package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "drug_import_export_details", schema = "amed")
public class DrugImportExportDetailsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "authorized_drug_substances_id")
    private AuthorizedDrugSubstancesEntity authorizedDrugSubstance;

    @Basic
    @Column(name = "authorized_quantity")
    private Double authorizedQuantity;

    @Basic
    @Column(name = "subst_active_quantity_unit_code")
    private String authorizedQuantityUnitCode;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "import_export_id")
    private Set<DrugImportExportDeclarationsEntity> declarations = new HashSet<>();
}
