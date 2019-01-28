package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "nm_audit_category", schema = "amed")
public class NmAuditCategoryEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer                        id;
    @Basic
    @Column(name = "name")
    private String                         name;
    @Basic
    @Column(name = "description")
    private String                         description;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "category_id")
    private Set<NmAuditSubcategoryEntity> subcategories = new HashSet<>();
}
