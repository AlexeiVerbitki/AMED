package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "annihilation_modes", schema = "amed")
public class AnnihilationModesEntity
{
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "description")
    private String description;

}
