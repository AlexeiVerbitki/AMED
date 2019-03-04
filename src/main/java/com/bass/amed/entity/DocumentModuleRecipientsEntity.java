package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "document_module_recipients", schema = "amed")
public class DocumentModuleRecipientsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "name", nullable = true, length = 60)
    private String name;
    @Basic
    @Column(name = "fullname", nullable = true, length = 200)
    private String fullname;
    @Basic
    @Column(name = "confirmed", nullable = true)
    private Boolean confirmed;

}
