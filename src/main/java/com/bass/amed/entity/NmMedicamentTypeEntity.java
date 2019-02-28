package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_medicament_type", schema = "amed", catalog = "")
public class NmMedicamentTypeEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "code")
    private Integer code;
    @Basic@Column(name = "description")
    private String description;
}
