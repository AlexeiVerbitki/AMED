package com.bass.amed.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "medicament_instructions", schema = "amed")
public class MedicamentInstructionsEntity
{
    @Id@GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic@Column(name = "date")
    private Timestamp date;
    @Basic@Column(name = "name")
    private String name;
    @Basic@Column(name = "path")
    private String path;
    @Basic@Column(name = "type")
    private String type;
    @Basic@Column(name = "division")
    private String division;
    @Basic@Column(name = "type_doc")
    private String typeDoc;
    @Basic
    @Column(name = "volume")
    private String volume;
    @Basic@Column(name = "medicament_id")
    private Integer medicamentId;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "volume_unit_measurement_id")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;

    public void assign(MedicamentInstructionsHistoryEntity entity)
    {
        this.date = entity.getDate();
        this.name = entity.getName();
        this.division=entity.getDivision();
        this.path = entity.getPath();
        this.type = entity.getType();
        this.typeDoc = entity.getTypeDoc();
        this.volume = entity.getVolume();
        this.volumeQuantityMeasurement = entity.getVolumeQuantityMeasurement();
    }
}
