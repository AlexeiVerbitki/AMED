package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_import_activities", schema = "amed")
public class GMPImportActivitiesEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "import_activity_id")
    private NmImportActivitiesEntity importActivity;
    @Basic
    @Column(name = "description")
    private String description;
}
