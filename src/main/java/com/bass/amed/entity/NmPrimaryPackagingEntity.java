package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_primary_packaging", schema = "amed")
public class NmPrimaryPackagingEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "description_en")
    private String descriptionEn;
}
