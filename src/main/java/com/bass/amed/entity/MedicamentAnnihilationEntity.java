package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
@Table(name = "medicament_annihilation")
public class MedicamentAnnihilationEntity
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;
    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_annihilation_id")
    private Set<MedicamentAnnihilationMedsEntity> medicamentsMedicamentAnnihilationMeds;
    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "med_annihilation_id")
    private Set<MedicamentAnnihilationInsitutionEntity> medicamentAnnihilationInsitutions;
    @Basic
    @Column(name = "status")
    private String status;
    @Basic
    @Column(name = "firstname")
    private String firstname;
    @Basic
    @Column(name = "lastname")
    private String lastname;
    @Transient
    private Boolean attachedLNDocument;
}
