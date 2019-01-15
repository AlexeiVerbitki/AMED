package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_types_history", schema = "amed")
public class MedicamentTypesHistoryEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "type_id")
    private NmMedicamentTypeEntity type;
    @Basic@Column(name = "status")
    private String status;

    public void assign(MedicamentTypesEntity entity)
    {
        this.type = entity.getType();
        this.status = "O";
    }

}
