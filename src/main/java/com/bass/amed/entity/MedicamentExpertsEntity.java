package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "medicament_experts", schema = "amed")
public class MedicamentExpertsEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id")
    private Integer id;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "chairman_id" )
    private NmEmployeesEntity chairman;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "farmacolog_id" )
    private NmEmployeesEntity farmacolog;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "farmacist_id" )
    private NmEmployeesEntity farmacist;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "medic_id" )
    private NmEmployeesEntity medic;
    @Basic@Column(name = "date")
    private Timestamp date;
    @Basic@Column(name = "comment")
    private String comment;
    @Basic@Column(name = "number")
    private String number;
    @Basic@Column(name = "status")
    private Integer status;
    @Basic@Column(name = "decision_chairman")
    private String decisionChairman;
    @Basic@Column(name = "decision_farmacist")
    private String decisionFarmacist;
    @Basic@Column(name = "decision_farmacolog")
    private String decisionFarmacolog;
    @Basic@Column(name = "decision_medic")
    private String decisionMedic;


}
