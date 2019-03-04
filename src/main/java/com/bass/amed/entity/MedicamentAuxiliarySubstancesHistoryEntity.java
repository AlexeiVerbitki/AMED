package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_auxiliary_substances_history", schema = "amed")
public class MedicamentAuxiliarySubstancesHistoryEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "substance_id" )
    private NmAuxiliarySubstancesEntity auxSubstance;
    @Basic@Column(name = "status")
    private String status;
    @Basic@Column(name = "composition_number_to")
    private Integer compositionNumberTo;

    public void assign(MedicamentAuxiliarySubstancesEntity entity)
    {
        this.auxSubstance = entity.getAuxSubstance();
        this.status = "O";
        this.compositionNumberTo = entity.getCompositionNumber();
    }
}
