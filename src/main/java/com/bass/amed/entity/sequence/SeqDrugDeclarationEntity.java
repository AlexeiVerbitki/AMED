package com.bass.amed.entity.sequence;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table( name = "seq_drug_declaration")
public class SeqDrugDeclarationEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id" )
    private Integer id;
}
