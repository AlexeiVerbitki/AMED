package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_tests_for_quality_control", schema = "amed")
public class NmTestsForQualityControlEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "description_en")
    private String descriptionEn;
}
