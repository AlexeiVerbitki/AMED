package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_active_substances_manufactures_history", schema = "amed")
public class MedicamentActiveSubstanceManufactureHistoryEntity
{
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )@JoinColumn( name = "manufacture_id" )
    private NmManufacturesEntity manufacture;
    @Basic@Column(name = "status")
    private String status;
}
