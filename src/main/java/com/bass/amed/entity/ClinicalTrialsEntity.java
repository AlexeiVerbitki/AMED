package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "clinical_trials", schema = "amed", catalog = "")
public class ClinicalTrialsEntity
{
    private Integer id;
    private ClinicalTrialsTypesEntity treatment;
    private ClinicalTrialsTypesEntity provenance;
    private String phase;
    private String eudraCtNr;
    private String code;
    private String title;
    private String sponsor;
    private MedicamentEntity medicament;
    private MedicamentEntity referenceProduct;
    private Integer trialPopulation;
    private String medicamentCommitteeOpinion;
    private String eticCommitteeOpinion;
    private String approvalOrder;
    private String pharmacovigilance;
    private Integer openingDeclarationId;
    private String status;
    private Set<DocumentsEntity> documents;
    private Set<NmInvestigatorsEntity> investigators;
    private Set<ReceiptsEntity> receipts;
    private Set<PaymentOrdersEntity> paymentOrders;
    private Set<NmMedicalInstitutionsEntity> medicalInstitutions;
    private Set<OutputDocumentsEntity> outputDocuments;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "treatment_id")
    public ClinicalTrialsTypesEntity getTreatment() { return treatment; }

    public void setTreatment(ClinicalTrialsTypesEntity treatment) { this.treatment = treatment;}

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "provenance_id")
    public ClinicalTrialsTypesEntity getProvenance()
    {
        return provenance;
    }

    public void setProvenance(ClinicalTrialsTypesEntity provenance)
    {
        this.provenance = provenance;
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
    public String getSponsor()
    {
        return sponsor;
    }

    public void setSponsor(String sponsor)
    {
        this.sponsor = sponsor;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "medicament_id")
    public MedicamentEntity getMedicament()
    {
        return medicament;
    }

    public void setMedicament(MedicamentEntity medicament)
    {
        this.medicament = medicament;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "reference_product_id")
    public MedicamentEntity getReferenceProduct()
    {
        return referenceProduct;
    }

    public void setReferenceProduct(MedicamentEntity referenceProduct)
    {
        this.referenceProduct = referenceProduct;
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

//    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
//    @JoinTable(name = "CLINICAL_TRAILS_DOCUMENTS", joinColumns = {
//            @JoinColumn(name = "CLINICAL_TRAILS_ID")}, inverseJoinColumns = {
//            @JoinColumn(name = "DOCUMENT_ID")})
//    public Set<DocumentsEntity> getDocuments()
//    {
//        return documents;
//    }
//
//    public void setDocuments(Set<DocumentsEntity> documents)
//    {
//        this.documents = documents;
//    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRAILS_INVESTIGATORS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRAILS_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "NM_INVESTIGATORS_ID")})
    public Set<NmInvestigatorsEntity> getInvestigators()
    {
        return investigators;
    }

    public void setInvestigators(Set<NmInvestigatorsEntity> investigators)
    {
        this.investigators = investigators;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRAILS_RECEIPTS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRAIL_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "RECEIPT_ID")})
    public Set<ReceiptsEntity> getReceipts()
    {
        return receipts;
    }

    public void setReceipts(Set<ReceiptsEntity> receipts)
    {
        this.receipts = receipts;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRAILS_PAYMENT_ORDERS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRAIL_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "PAYMENT_ORDER_ID")})
    public Set<PaymentOrdersEntity> getPaymentOrders()
    {
        return paymentOrders;
    }

    public void setPaymentOrders(Set<PaymentOrdersEntity> paymentOrders)
    {
        this.paymentOrders = paymentOrders;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "CLINICAL_TRIALS_MEDICAL_INSTITUTIONS", joinColumns = {
            @JoinColumn(name = "CLINICAL_TRIALS_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "MEDICAL_INSTITUTIONS_ID")})
    public Set<NmMedicalInstitutionsEntity> getMedicalInstitutions()
    {
        return medicalInstitutions;
    }

    public void setMedicalInstitutions(Set<NmMedicalInstitutionsEntity> medicalInstitutions)
    {
        this.medicalInstitutions = medicalInstitutions;
    }

//    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
//    @JoinTable(name = "CLINICAL_TRAILS_OUTPUT_DOCUMENTS", joinColumns = {
//            @JoinColumn(name = "CLINICAL_TRAILS_ID")}, inverseJoinColumns = {
//            @JoinColumn(name = "OUTPUT_DOCUMENTS_ID")})
//    public Set<OutputDocumentsEntity> getOutputDocuments()
//    {
//        return outputDocuments;
//    }
//
//    public void setOutputDocuments(Set<OutputDocumentsEntity> outputDocuments)
//    {
//        this.outputDocuments = outputDocuments;
//    }

    @Override
    public int hashCode()
    {

        return Objects.hash(id, treatment, provenance, phase, eudraCtNr, code, title, sponsor, medicament, referenceProduct, trialPopulation, medicamentCommitteeOpinion, eticCommitteeOpinion, approvalOrder, pharmacovigilance, openingDeclarationId, status, documents, investigators, receipts, paymentOrders, medicalInstitutions);
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (o == null || getClass() != o.getClass())
        {
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
                Objects.equals(medicamentCommitteeOpinion, that.medicamentCommitteeOpinion) &&
                Objects.equals(eticCommitteeOpinion, that.eticCommitteeOpinion) &&
                Objects.equals(approvalOrder, that.approvalOrder) &&
                Objects.equals(pharmacovigilance, that.pharmacovigilance) &&
                Objects.equals(openingDeclarationId, that.openingDeclarationId) &&
                Objects.equals(status, that.status) &&
                Objects.equals(documents, that.documents) &&
                Objects.equals(investigators, that.investigators) &&
                Objects.equals(receipts, that.receipts) &&
                Objects.equals(paymentOrders, that.paymentOrders) &&
                Objects.equals(medicalInstitutions, that.medicalInstitutions);
    }
}
