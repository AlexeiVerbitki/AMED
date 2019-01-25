package com.bass.amed.entity;

import lombok.Data;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "documents", schema = "amed")
public class DocumentsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "date")
    private Timestamp date;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "path")
    private String path;
    @Basic
    @Column(name = "number")
    private String number;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "doc_type_id")
    private NmDocumentTypesEntity docType;
    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;
    @Basic
    @Column(name = "date_of_issue")
    private Timestamp dateOfIssue;

}
