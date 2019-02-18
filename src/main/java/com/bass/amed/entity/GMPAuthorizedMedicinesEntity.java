package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_authorized_medicines", schema = "amed")
public class GMPAuthorizedMedicinesEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    private MedicamentEntity medicament;
}
