package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_biological_medicines", schema = "amed")
public class GMPBiologicalMedicinesEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "biological_medicine_id")
    private NmBiologicalMedicinesEntity biologicalMedicine;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "category")
    private String category;
    @Basic
    @Column(name = "type")
    private String type;
}
