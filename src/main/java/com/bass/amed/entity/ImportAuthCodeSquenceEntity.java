package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "seq_import_auth", schema = "amed")
public class ImportAuthCodeSquenceEntity {
    private Integer id;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    public Integer getId() {
        return id;
    }
}
