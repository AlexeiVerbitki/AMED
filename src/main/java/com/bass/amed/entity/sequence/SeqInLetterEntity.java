package com.bass.amed.entity.sequence;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "seq_in_letter", schema = "amed")
public class SeqInLetterEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

}
