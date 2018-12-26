package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_manufactures_history", schema = "amed")
public class MedicamentManufactureHistoryEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )@Column(name = "id", nullable = false)
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})@JoinColumn(name = "manufacture_id")
    private NmManufacturesEntity manufacture;
    @Basic@Column(name = "producator_produs_finit_to")
    private Boolean producatorProdusFinitTo;
    @Basic@Column(name = "producator_produs_finit_from")
    private Boolean producatorProdusFinitFrom;
    @Basic@Column(name = "comment_from")
    private String commentFrom;
    @Basic@Column(name = "comment_to")
    private String commentTo;
    @Basic@Column(name = "status")
    private String status;

    public void assign(MedicamentManufactureEntity entity)
    {
        this.manufacture = entity.getManufacture();
        this.producatorProdusFinitTo = entity.getProducatorProdusFinit();
        this.commentTo = entity.getComment();
        this.status = "O";
    }

}
