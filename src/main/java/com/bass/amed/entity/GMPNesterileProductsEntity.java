package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_nesterile_products", schema = "amed")
public class GMPNesterileProductsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "nesterile_product_id")
    private NmNesterileProductsEntity nesterileProduct;
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
