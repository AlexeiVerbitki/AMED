package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "clinic_trial_amend", schema = "amed", catalog = "")
public class ClinicTrialAmendEntity {
    private Integer id;
    private Integer registrationRequestId;
    private Integer clinicalTrialsEntityId;
    private ClinicalTrialsTypesEntity treatment;
    private ClinicalTrialsTypesEntity provenance;
    private NmClinicTrailPhasesEntity phase;
    private String eudraCtNr;
    private String code;
    private String title;
    private String sponsor;
    private ImportMedNotRegisteredEntity medicament;
    private ImportMedNotRegisteredEntity referenceProduct;
    private ImportMedNotRegisteredEntity placebo;
    private Integer trialPopNat;
    private Integer trialPopInternat;
    private String status;
    private Set<NmInvestigatorsEntity> investigators;
    private Set<NmMedicalInstitutionsEntity> medicalInstitutions;
//    private List<ClinicTrialAmendEntity> clinicTrialAmendEntities;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "registration_request_id")
    public Integer getRegistrationRequestId() {
        return registrationRequestId;
    }

    public void setRegistrationRequestId(Integer registrationRequestId) {
        this.registrationRequestId = registrationRequestId;
    }

    @Basic
    @Column(name = "clinical_trails_id")
    public Integer getClinicalTrialsEntityId() {
        return clinicalTrialsEntityId;
    }

    public void setClinicalTrialsEntityId(Integer clinicalTrialsEntityId) {
        this.clinicalTrialsEntityId = clinicalTrialsEntityId;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "treatment_id")
    public ClinicalTrialsTypesEntity getTreatment() {
        return treatment;
    }

    public void setTreatment(ClinicalTrialsTypesEntity treatment) {
        this.treatment = treatment;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "provenance_id")
    public ClinicalTrialsTypesEntity getProvenance() {
        return provenance;
    }

    public void setProvenance(ClinicalTrialsTypesEntity provenance) {
        this.provenance = provenance;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "phase_id")
    public NmClinicTrailPhasesEntity getPhase() {
        return phase;
    }

    public void setPhase(NmClinicTrailPhasesEntity phase) {
        this.phase = phase;
    }

    @Basic
    @Column(name = "EudraCT_nr")
    public String getEudraCtNr() {
        return eudraCtNr;
    }

    public void setEudraCtNr(String eudraCtNr) {
        this.eudraCtNr = eudraCtNr;
    }

    @Basic
    @Column(name = "code")
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Basic
    @Column(name = "title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Basic
    @Column(name = "sponsor")
    public String getSponsor() {
        return sponsor;
    }

    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    public ImportMedNotRegisteredEntity getMedicament() {
        return medicament;
    }

    public void setMedicament(ImportMedNotRegisteredEntity medicament) {
        this.medicament = medicament;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "reference_product_id")
    public ImportMedNotRegisteredEntity getReferenceProduct() {
        return referenceProduct;
    }

    public void setReferenceProduct(ImportMedNotRegisteredEntity referenceProduct) {
        this.referenceProduct = referenceProduct;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "placebo_id")
    public ImportMedNotRegisteredEntity getPlacebo() {
        return placebo;
    }

    public void setPlacebo(ImportMedNotRegisteredEntity placebo) {
        this.placebo = placebo;
    }

    @Basic
    @Column(name = "trial_population_national")
    public Integer getTrialPopNat() {
        return trialPopNat;
    }

    public void setTrialPopNat(Integer trialPopulationNational) {
        this.trialPopNat = trialPopulationNational;
    }

    @Basic
    @Column(name = "trial_population_international")
    public Integer getTrialPopInternat() {
        return trialPopInternat;
    }

    public void setTrialPopInternat(Integer trialPopulationInternational) {
        this.trialPopInternat = trialPopulationInternational;
    }

    @Basic
    @Column(name = "status", nullable = true, length = 1)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "CLINIC_TRAIL_AMEND_INVESTIGAT", joinColumns = {
            @JoinColumn(name = "CLINIC_TRAIL_AMEND_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "NM_INVESTIGATORS_ID")})
    public Set<NmInvestigatorsEntity> getInvestigators() {
        return investigators;
    }

    public void setInvestigators(Set<NmInvestigatorsEntity> investigators) {
        this.investigators = investigators;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "CLINIC_TRAIL_AMEND_MED_INSTITUT", joinColumns = {
            @JoinColumn(name = "CLINIC_TRAIL_AMEND_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "MEDICAL_INSTITUTIONS_ID")})
    public Set<NmMedicalInstitutionsEntity> getMedicalInstitutions() {
        return medicalInstitutions;
    }

    public void setMedicalInstitutions(Set<NmMedicalInstitutionsEntity> medicalInstitutions) {
        this.medicalInstitutions = medicalInstitutions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClinicTrialAmendEntity that = (ClinicTrialAmendEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(registrationRequestId, that.registrationRequestId) &&
                Objects.equals(clinicalTrialsEntityId, that.clinicalTrialsEntityId) &&
                Objects.equals(treatment, that.treatment) &&
                Objects.equals(provenance, that.provenance) &&
                Objects.equals(phase, that.phase) &&
                Objects.equals(eudraCtNr, that.eudraCtNr) &&
                Objects.equals(code, that.code) &&
                Objects.equals(title, that.title) &&
                Objects.equals(sponsor, that.sponsor) &&
                Objects.equals(medicament, that.medicament) &&
                Objects.equals(referenceProduct, that.referenceProduct) &&
                Objects.equals(placebo, that.placebo) &&
                Objects.equals(trialPopNat, that.trialPopNat) &&
                Objects.equals(trialPopInternat, that.trialPopInternat) &&
                Objects.equals(status, that.status) &&
                Objects.equals(investigators, that.investigators) &&
                Objects.equals(medicalInstitutions, that.medicalInstitutions);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, registrationRequestId, clinicalTrialsEntityId, treatment, provenance, phase, eudraCtNr, code, title, sponsor, medicament, referenceProduct, placebo, trialPopNat, trialPopInternat, status, investigators, medicalInstitutions);
    }
}
