package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_types", schema = "amed")
public class MedicamentTypesEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "type_id")
    private NmMedicamentTypeEntity type;

    public void assign(MedicamentTypesHistoryEntity entity)
    {
        this.type = entity.getType();
    }
}
