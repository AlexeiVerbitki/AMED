package com.bass.amed.entity.sequence;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table( name = "seq_gmp_request_number" )
public class SeqGMPRequestNumberEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
