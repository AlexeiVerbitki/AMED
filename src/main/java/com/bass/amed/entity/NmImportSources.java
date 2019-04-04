package com.bass.amed.entity;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_import_sources", schema = "amed", catalog = "")
public class NmImportSources
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "description")
    private String description;

}
