package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "request_variation_type", schema = "amed")
public class RequestVariationTypeEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "variation_id")
    private NmVariationTypeEntity variation;
    @Basic
    @Column(name = "value")
    private String value;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
    @Basic
    @Column(name = "comment")
    private String comment;
    @Basic
    @Column(name = "code")
    private String code;
}
