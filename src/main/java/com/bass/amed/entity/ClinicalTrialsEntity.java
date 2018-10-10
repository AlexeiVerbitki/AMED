package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "clinical_trials", schema = "amed", catalog = "")
public class ClinicalTrialsEntity
{
    private Integer id;
    private Integer treatmentId;
    private Integer provenanceId;
    private String phase;
    private String eudraCtNr;
    private String code;
    private String title;
    private Integer sponsor;
    private Integer medicalInstitution;
    private Integer trialPopulation;
    private String medicamentCommitteeOpinion;
    private String eticCommitteeOpinion;
    private String approvalOrder;
    private String pharmacovigilance;
    private Integer openingDeclarationId;
    private String status;
    private Set<DocumentsEntity> documents;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "treatment_id")
    public Integer getTreatmentId()
    {
        return treatmentId;
    }

    public void setTreatmentId(Integer treatmentId)
    {
        this.treatmentId = treatmentId;
    }

    @Basic
    @Column(name = "provenance_id")
    public Integer getProvenanceId()
    {
        return provenanceId;
    }

    public void setProvenanceId(Integer provenanceId)
    {
        this.provenanceId = provenanceId;
    }

    @Basic
    @Column(name = "phase")
    public String getPhase()
    {
        return phase;
    }

    public void setPhase(String phase)
    {
        this.phase = phase;
    }

    @Basic
    @Column(name = "EudraCT_nr")
    public String getEudraCtNr()
    {
        return eudraCtNr;
    }

    public void setEudraCtNr(String eudraCtNr)
    {
        this.eudraCtNr = eudraCtNr;
    }

    @Basic
    @Column(name = "code")
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "title")
    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    @Basic
    @Column(name = "sponsor")
    public Integer getSponsor()
    {
        return sponsor;
    }

    public void setSponsor(Integer sponsor)
    {
        this.sponsor = sponsor;
    }

    @Basic
    @Column(name = "medical_institution")
    public Integer getMedicalInstitution()
    {
        return medicalInstitution;
    }

    public void setMedicalInstitution(Integer medicalInstitution)
    {
        this.medicalInstitution = medicalInstitution;
    }

    @Basic
    @Column(name = "trial_population")
    public Integer getTrialPopulation()
    {
        return trialPopulation;
    }

    public void setTrialPopulation(Integer trialPopulation)
    {
        this.trialPopulation = trialPopulation;
    }

    @Basic
    @Column(name = "medicament_committee_opinion")
    public String getMedicamentCommitteeOpinion()
    {
        return medicamentCommitteeOpinion;
    }

    public void setMedicamentCommitteeOpinion(String medicamentCommitteeOpinion)
    {
        this.medicamentCommitteeOpinion = medicamentCommitteeOpinion;
    }

    @Basic
    @Column(name = "etic_committee_opinion")
    public String getEticCommitteeOpinion()
    {
        return eticCommitteeOpinion;
    }

    public void setEticCommitteeOpinion(String eticCommitteeOpinion)
    {
        this.eticCommitteeOpinion = eticCommitteeOpinion;
    }

    @Basic
    @Column(name = "approval_order")
    public String getApprovalOrder()
    {
        return approvalOrder;
    }

    public void setApprovalOrder(String approvalOrder)
    {
        this.approvalOrder = approvalOrder;
    }

    @Basic
    @Column(name = "pharmacovigilance")
    public String getPharmacovigilance()
    {
        return pharmacovigilance;
    }

    public void setPharmacovigilance(String pharmacovigilance)
    {
        this.pharmacovigilance = pharmacovigilance;
    }

    @Basic
    @Column(name = "opening_declaration_id")
    public Integer getOpeningDeclarationId()
    {
        return openingDeclarationId;
    }

    public void setOpeningDeclarationId(Integer openingDeclarationId)
    {
        this.openingDeclarationId = openingDeclarationId;
    }

    @Basic
    @Column(name = "status", nullable = true, length = 1)
    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRAILS_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRAILS_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClinicalTrialsEntity that = (ClinicalTrialsEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(treatmentId, that.treatmentId) &&
                Objects.equals(provenanceId, that.provenanceId) &&
                Objects.equals(phase, that.phase) &&
                Objects.equals(eudraCtNr, that.eudraCtNr) &&
                Objects.equals(code, that.code) &&
                Objects.equals(title, that.title) &&
                Objects.equals(sponsor, that.sponsor) &&
                Objects.equals(medicalInstitution, that.medicalInstitution) &&
                Objects.equals(trialPopulation, that.trialPopulation) &&
                Objects.equals(medicamentCommitteeOpinion, that.medicamentCommitteeOpinion) &&
                Objects.equals(eticCommitteeOpinion, that.eticCommitteeOpinion) &&
                Objects.equals(approvalOrder, that.approvalOrder) &&
                Objects.equals(pharmacovigilance, that.pharmacovigilance) &&
                Objects.equals(openingDeclarationId, that.openingDeclarationId) &&
                Objects.equals(status, that.status) &&
                Objects.equals(documents, that.documents);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, treatmentId, provenanceId, phase, eudraCtNr, code, title, sponsor, medicalInstitution, trialPopulation, medicamentCommitteeOpinion, eticCommitteeOpinion, approvalOrder, pharmacovigilance, openingDeclarationId, status, documents);
    }
}
