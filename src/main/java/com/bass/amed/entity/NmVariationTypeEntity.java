package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "nm_variation_request_type", schema = "amed")
public class NmVariationTypeEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "parent_id")
    private Integer parentId;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "posible_values")
    private String possibleValues;

}
