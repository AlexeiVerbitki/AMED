package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_localities", schema = "amed")
public class NmLocalitiesEntity
{
    @Id@Column(name = "id")@GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic@Column(name = "code")
    private String code;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "stateId")
    private Integer stateId;
    @Transient
    private String stateName;

}
