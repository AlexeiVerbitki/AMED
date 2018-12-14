package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "output_documents", schema = "amed", catalog = "")
public class OutputDocumentsEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id")
    private Integer id;
    @Basic@Column(name = "date")
    private Timestamp date;
    @Basic@Column(name = "name")
    private String name;
    @Basic@Column(name = "number")
    private String number;
    @Basic@Column(name = "title")
    private String title;
    @Basic@Column(name = "content")
    private String content;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "type_id" )
    private NmDocumentTypesEntity docType;
    @Basic@Column(name = "response_received")
    private boolean responseReceived;
    @Basic@Column(name = "signer_name")
    private String signerName;
    @Basic@Column(name = "signer_function")
    private String signerFunction;

}
