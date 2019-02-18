package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "seq_clinical_trial", schema = "amed")
public class ClinicalTrialCodeSequenceEntity {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
