package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
@Table(name = "clinic_trial_amend", schema = "amed", catalog = "")
public class ClinicTrialAmendEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;
    @Basic
    @Column(name = "clinical_trails_id")
    private Integer clinicalTrialsEntityId;
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
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    private ImportMedNotRegisteredEntity medicament;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "reference_product_id")
    private ImportMedNotRegisteredEntity referenceProduct;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "placebo_id")
    private ImportMedNotRegisteredEntity placebo;
    @Basic
    @Column(name = "trial_population_national")
    private Integer trialPopNat;
    @Basic
    @Column(name = "trial_population_international")
    private Integer trialPopInternat;
    @Basic
    @Column(name = "status", nullable = true, length = 1)
    private String status;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "CLINIC_TRAIL_AMEND_INVESTIGAT", joinColumns = {
            @JoinColumn(name = "CLINIC_TRAIL_AMEND_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "NM_INVESTIGATORS_ID")})
    private Set<NmInvestigatorsEntity> investigators;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "CLINIC_TRAIL_AMEND_MED_INSTITUT", joinColumns = {
            @JoinColumn(name = "CLINIC_TRAIL_AMEND_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "MEDICAL_INSTITUTIONS_ID")})
    private Set<NmMedicalInstitutionsEntity> medicalInstitutions;
    //    private List<ClinicTrialAmendEntity> clinicTrialAmendEntities;

}
