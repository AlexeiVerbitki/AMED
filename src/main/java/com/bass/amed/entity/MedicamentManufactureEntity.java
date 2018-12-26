package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_manufactures", schema = "amed")
public class MedicamentManufactureEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "manufacture_id")
    private NmManufacturesEntity manufacture;
    @Basic@Column(name = "comment")
    private String comment;
    @Basic@Column(name = "producator_produs_finit")
    private Boolean producatorProdusFinit;

    public void assign(MedicamentManufactureHistoryEntity entity)
    {
        this.manufacture = entity.getManufacture();
        this.producatorProdusFinit = entity.getProducatorProdusFinitTo();
        this.comment = entity.getCommentTo();
    }

}
