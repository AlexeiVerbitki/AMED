package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_auxiliary_substances", schema = "amed")
public class MedicamentAuxiliarySubstancesEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "substance_id" )
    private NmAuxiliarySubstancesEntity auxSubstance;
    @Basic@Column(name = "composition_number")
    private Integer compositionNumber;

    public void assign(MedicamentAuxiliarySubstancesHistoryEntity entity)
    {
        this.auxSubstance = entity.getAuxSubstance();
        this.compositionNumber =entity.getCompositionNumberTo();
    }
}
