package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_division_history", schema = "amed")
public class MedicamentDivisionHistoryEntity
{
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)@Column(name = "id", nullable = false)
    private Integer id;
    @Basic@Column(name = "description")
    private String description;
    @Basic@Column(name = "old")
    private Integer old;
    @Basic@Column(name = "status")
    private String status;
    @Basic@Column(name = "medicament_id")
    private Integer medicamentId;
    @Basic@Column(name = "medicament_code")
    private String medicamentCode;
}
