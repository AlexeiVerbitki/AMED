package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "clinical_trials", schema = "amed")
public class ClinicalTrialsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "start_date_international")
    private Timestamp startDateInternational;

    @Basic
    @Column(name = "start_date_national")
    private Timestamp startDateNational;

    @Basic
    @Column(name = "end_date_national")
    private Timestamp endDateNational;

    @Basic
    @Column(name = "end_date_international")
    private Timestamp endDateInternational;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "treatment_id")
    private ClinicalTrialsTypesEntity treatment;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "provenance_id")
    private ClinicalTrialsTypesEntity provenance;
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "phase_id")
    private NmClinicTrailPhasesEntity phase;
    @Basic
    @Column(name = "EudraCT_nr")
    private String eudraCtNr;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "title")
    private String title;
    @Basic
    @Column(name = "sponsor")
    private String sponsor;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    private ImportMedNotRegisteredEntity medicament;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "reference_product_id")
    private ImportMedNotRegisteredEntity referenceProduct;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "placebo_id")
    private ImportMedNotRegisteredEntity placebo;
    @Basic
    @Column(name = "trial_population_national")
    private Integer trialPopNat;
    @Basic
    @Column(name = "trial_population_international")
    private Integer trialPopInternat;
    @Basic
    @Column(name = "pharmacovigilance")
    private String pharmacovigilance;
    @Basic
    @Column(name = "status", nullable = true, length = 1)
    private String status;

    @Basic
    @Column(name = "med_comission_nr")
    private String comissionNr;

    @Basic
    @Column(name = "med_comission_date")
    private Timestamp comissionDate;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "ct_id")
    private Set<CtMedicalInstitutionEntity> medicalInstitutions = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "clinical_trails_id")
    private Set<ClinicTrialAmendEntity> clinicTrialAmendEntities = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "clinical_trails_id")
    private Set<ClinicTrailNotificationEntity> clinicTrialNotificationEntities = new HashSet<>();
}
