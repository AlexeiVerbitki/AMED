package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "document_module_recipients", schema = "amed")
public class DocumentModuleRecipientsEntity
{
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "name", nullable = true)
    private Integer name;
    @Basic
    @Column(name = "comment", nullable = true, length = 5000)
    private String comment;
    @Basic
    @Column(name = "confirmed", nullable = true)
    private boolean confirmed;

}
