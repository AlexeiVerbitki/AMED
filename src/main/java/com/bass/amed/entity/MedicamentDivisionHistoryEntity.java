package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

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
    @Basic
    @Column(name = "volume")
    private String volume;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "volume_unit_measurement_id")
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;
    @Basic
    @Column(name = "serial_nr")
    private String serialNr;
    @Basic
    @Column(name = "samples_number")
    private Integer samplesNumber;
    @Basic
    @Column(name = "samples_expiration_date")
    private Date samplesExpirationDate;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)@JoinColumn(name = "division_history_id")
    private Set<MedicamentInstructionsHistoryEntity> instructionsHistory = new HashSet<>();
}
