package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_document_types", schema = "amed", catalog = "")
public class NmDocumentTypesEntity
{
    @Id@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "category")
    private String category;
    @Basic@Column(name = "need_doc_nr")
    private boolean needDocNr;
    @Basic@Column(name = "need_date")
    private boolean needDate;


}
