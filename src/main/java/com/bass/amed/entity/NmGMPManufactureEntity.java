package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_gmp_manufacture", schema = "amed")
public class NmGMPManufactureEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "description_en")
    private String descriptionEn;
}
