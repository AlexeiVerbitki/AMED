package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "document_module_details", schema = "amed")
public class DocumentModuleDetailsEntity
{
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "sender", nullable = false, length = 30)
    private String sender;
    @Basic
    @Column(name = "recipient", nullable = false, length = 30)
    private String recipient;
    @Basic
    @Column(name = "execution_date", nullable = false)
    private Timestamp executionDate;
    @Basic
    @Column(name = "problem_description", nullable = true, length = 5000)
    private String problemDescription;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    private RegistrationRequestsEntity registrationRequestsEntity;


}
