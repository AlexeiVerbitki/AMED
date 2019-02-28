package com.bass.amed.entity.sequence;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table( name = "seq_annihilation_registration_number" )
public class SeqAnnihilationRegistrationNumberEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
