package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_annihilation_meds", schema = "amed")
@IdClass(MedicamentAnnihilationIdentity.class)
public class MedicamentAnnihilationMedsEntity
{
    @Id
    @Column(name = "medicament_id")
    private Integer medicamentId;

    @Id
    @Column(name = "medicament_annihilation_id")
    private Integer medicamentAnnihilationId;


    @Column(name="quantity")
    private Double quantity;

    @Column(name="useless_reason")
    private String uselessReason;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "destruction_method_id")
    private MedAnnihilationDestroyMethodsEntity destructionMethod;

    @Column(name="note")
    private String note;

    @Column(name = "seria")
    private String seria;

    @Column(name = "tax")
    private Double tax;

    @Transient
    private String medicamentName;
}
