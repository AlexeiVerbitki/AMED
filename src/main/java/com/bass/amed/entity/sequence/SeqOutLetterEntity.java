package com.bass.amed.entity.sequence;

import lombok.*;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.*;

@Data
@Entity
@Table(name = "seq_out_letter", schema = "amed")
public class SeqOutLetterEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

}
