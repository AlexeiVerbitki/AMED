package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "service_charges", schema = "amed")
public class ServiceChargesEntity
{
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "amount")
    private Double amount;
    @Basic
    @Column(name = "category")
    private String category;

}
