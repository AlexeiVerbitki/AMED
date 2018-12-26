package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_active_substances", schema = "amed", catalog = "")
public class NmActiveSubstancesEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "code")
    private String code;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "quantity")
    private Double quantity;

}
