package com.bass.amed.entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "drug_substance_types")
public class DrugSubstanceTypesEntity {

    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

}
