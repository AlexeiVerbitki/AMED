package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_sterile_products", schema = "amed")
public class NmSterileProductsEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "description")
    private String description;
}
