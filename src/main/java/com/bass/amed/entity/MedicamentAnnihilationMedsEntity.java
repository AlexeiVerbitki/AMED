package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "medicament_annihilation_meds", schema = "amed")
public class MedicamentAnnihilationMedsEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;

    @Column(name = "medicament_id")
    private Integer medicamentId;

    @Column(name = "medicament_annihilation_id")
    private Integer medicamentAnnihilationId;


    @Column(name="quantity")
    private Double quantity;

    @Column(name="useless_reason")
    private String uselessReason;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "destruction_method_id")
    private MedAnnihilationDestroyMethodsEntity destructionMethod;

    @Column(name="note")
    private String note;

    @Column(name = "seria")
    private String seria;

    @Column(name = "tax")
    private Double tax;

    @Column(name = "not_reg_name")
    private String notRegisteredName;

    @Column(name = "not_reg_dose")
    private String notRegisteredDose;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "form_id")
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "unit_measure_id")
    private NmUnitsOfMeasurementEntity unitsOfMeasurement;


    @Column(name = "confirmative_documents")
    private String confirmativeDocuments;

    @Column(name = "primary_package")
    private String primaryPackage;

    @Transient
    private String medicamentName;
}
