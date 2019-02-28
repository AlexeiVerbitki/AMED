package com.bass.amed.entity.sequence;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table( name = "seq_license_registration_number")
public class SeqLicenseNumberEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
