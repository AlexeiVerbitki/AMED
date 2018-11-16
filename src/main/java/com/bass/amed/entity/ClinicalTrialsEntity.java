package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "clinical_trials", schema = "amed")
public class ClinicalTrialsEntity {
    private Integer id;
    private ClinicalTrialsTypesEntity treatment;
    private ClinicalTrialsTypesEntity provenance;
    private String phase;
    private String eudraCtNr;
    private String code;
    private String title;
    private String sponsor;
    private ImportMedNotRegisteredEntity medicament;
    private ImportMedNotRegisteredEntity referenceProduct;
    private ImportMedNotRegisteredEntity placebo;
    private Integer trialPopulation;
    private String pharmacovigilance;
    private String status;
    private Set<NmInvestigatorsEntity> investigators;
    private Set<NmMedicalInstitutionsEntity> medicalInstitutions;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    @Basic
    @Column(name = "phase")
    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
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

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    public ImportMedNotRegisteredEntity getMedicament() {
        return medicament;
    }

    public void setMedicament(ImportMedNotRegisteredEntity medicament) {
        this.medicament = medicament;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "reference_product_id")
    public ImportMedNotRegisteredEntity getReferenceProduct() {
        return referenceProduct;
    }

    public void setReferenceProduct(ImportMedNotRegisteredEntity referenceProduct) {
        this.referenceProduct = referenceProduct;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "placebo_id")
    public ImportMedNotRegisteredEntity getPlacebo() {
        return placebo;
    }

    public void setPlacebo(ImportMedNotRegisteredEntity placebo) {
        this.placebo = placebo;
    }

    @Basic
    @Column(name = "trial_population")
    public Integer getTrialPopulation() {
        return trialPopulation;
    }

    public void setTrialPopulation(Integer trialPopulation) {
        this.trialPopulation = trialPopulation;
    }

    @Basic
    @Column(name = "pharmacovigilance")
    public String getPharmacovigilance() {
        return pharmacovigilance;
    }

    public void setPharmacovigilance(String pharmacovigilance) {
        this.pharmacovigilance = pharmacovigilance;
    }

    @Basic
    @Column(name = "status", nullable = true, length = 1)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRAILS_INVESTIGATORS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRAILS_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "NM_INVESTIGATORS_ID")})
    public Set<NmInvestigatorsEntity> getInvestigators() {
        return investigators;
    }

    public void setInvestigators(Set<NmInvestigatorsEntity> investigators) {
        this.investigators = investigators;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRIALS_MEDICAL_INSTITUTIONS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRIALS_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "MEDICAL_INSTITUTIONS_ID")})
    public Set<NmMedicalInstitutionsEntity> getMedicalInstitutions() {
        return medicalInstitutions;
    }

    public void setMedicalInstitutions(Set<NmMedicalInstitutionsEntity> medicalInstitutions) {
        this.medicalInstitutions = medicalInstitutions;
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, treatment, provenance, phase, eudraCtNr, code, title, sponsor, medicament, referenceProduct, trialPopulation, pharmacovigilance, status, investigators, /*receipts, paymentOrders,*/ medicalInstitutions);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ClinicalTrialsEntity that = (ClinicalTrialsEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(treatment, that.treatment) &&
                Objects.equals(provenance, that.provenance) &&
                Objects.equals(phase, that.phase) &&
                Objects.equals(eudraCtNr, that.eudraCtNr) &&
                Objects.equals(code, that.code) &&
                Objects.equals(title, that.title) &&
                Objects.equals(sponsor, that.sponsor) &&
                Objects.equals(medicament, that.medicament) &&
                Objects.equals(referenceProduct, that.referenceProduct) &&
                Objects.equals(trialPopulation, that.trialPopulation) &&
                Objects.equals(pharmacovigilance, that.pharmacovigilance) &&
                Objects.equals(status, that.status) &&
                Objects.equals(investigators, that.investigators) &&             
                Objects.equals(medicalInstitutions, that.medicalInstitutions);
    }
}
