package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "medicament_instructions_history", schema = "amed")
public class MedicamentInstructionsHistoryEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @Basic@Column(name = "date")
    private Timestamp date;
    @Basic@Column(name = "name")
    private String name;
    @Basic@Column(name = "path")
    private String path;
    @Basic@Column(name = "type")
    private String type;
    @Basic@Column(name = "status")
    private String status;
    @Basic@Column(name = "division")
    private String division;
    @Basic@Column(name = "type_doc")
    private String typeDoc;

    public void assign(MedicamentInstructionsEntity entity)
    {
        this.date = entity.getDate();
        this.name = entity.getName();
        this.path = entity.getPath();
        this.type = entity.getType();
        this.status = "O";
        this.division=entity.getDivision();
        this.typeDoc=entity.getTypeDoc();
    }

}
