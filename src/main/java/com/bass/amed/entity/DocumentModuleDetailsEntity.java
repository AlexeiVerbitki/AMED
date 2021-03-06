package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "document_module_details", schema = "amed")
public class DocumentModuleDetailsEntity
{
    @Id
    @Column(name = "id", nullable = false)
    private Integer                             id;
    @Basic
    @Column(name = "recipient", nullable = false, length = 30)
    private String                              recipient;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "document_module_id")
    private Set<DocumentModuleRecipientsEntity> executors             = new HashSet<>();
    @Basic
    @Column(name = "execution_date", nullable = false)
    private Timestamp                           executionDate;
    @Basic
    @Column(name = "problem_description", nullable = true, length = 5000)
    private String                              problemDescription;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @MapsId
    @JoinColumn(name = "id")
    private RegistrationRequestsEntity          registrationRequestsEntity;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "document_module_id")
    private Set<DocumentModuleHistoryEntity>    documentHistoryEntity = new HashSet<>();
    @Basic
    @Column(name = "letter_number", length = 20)
    private String                              letterNumber;

}
