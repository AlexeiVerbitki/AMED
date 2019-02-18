package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "nm_register_catalog_codes", schema = "amed", catalog = "")
public class NmRegisterCatalogCodesEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Basic
    @Column(name = "register_code")
    private String registerCode;

    @Basic
    @Column(name = "register_code_description")
    private String registerCodeDescription;
}
