package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table( name = "seq_drug_authorization_registration_number")
public class SeqDrugAuthorizationNumberEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
