package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "med_annihilation_commisions", schema = "amed")
public class MedicamentAnnihilationInsitutionEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

    @Column(name = "med_annihilation_id")
    private Integer medicamentAnnihilationId;

//    @Column(name = "annihilation_commision_id")
//    private Integer institutionId;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "annihilation_commision_id")
    private AnnihilationCommisionsEntity institution;

    @Column(name = "president")
    private Boolean president;


    @Column(name = "name")
    private String name;


    @Column(name = "function")
    private String function;
}
