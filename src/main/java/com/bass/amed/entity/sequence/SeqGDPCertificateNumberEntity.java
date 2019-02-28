package com.bass.amed.entity.sequence;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table( name = "seq_gdp_certificate_nr" )
public class SeqGDPCertificateNumberEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
