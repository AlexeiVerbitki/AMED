package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "clinical_trials_types", schema = "amed", catalog = "")
public class ClinicalTrialsTypesEntity
{
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "code")
    private String code;

}
