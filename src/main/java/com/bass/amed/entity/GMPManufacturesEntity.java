package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_manufactures", schema = "amed")
public class GMPManufacturesEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "manufacture_id")
    private NmGMPManufactureEntity manufacture;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "category")
    private String category;
}
