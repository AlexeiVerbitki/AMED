package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_departments", schema = "amed", catalog = "")
public class NmDepartamentEntity
{
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "description")
    private String description;
}
