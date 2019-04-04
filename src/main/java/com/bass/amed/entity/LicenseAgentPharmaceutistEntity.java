package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Data
@Entity
@Table(name = "license_agent_pharmaceutist", schema = "amed")
public class LicenseAgentPharmaceutistEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "insertion_date")
    private Timestamp insertionDate;
    @Basic
    @Column(name = "selection_date")
    private Timestamp selectionDate;
    @Basic
    @Column(name = "full_name")
    private String fullName;
    @Transient
    private Integer ecAgentId;
}
