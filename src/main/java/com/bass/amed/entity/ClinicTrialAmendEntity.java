package com.bass.amed.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "clinic_trial_amend", schema = "amed", catalog = "")
public class ClinicTrialAmendEntity {
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
    @Basic
    @Column(name="amend_code")
    private String amendCode;
    @Basic
    @Column(name = "note")
    private String note;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "treatment_id_from")
    private ClinicalTrialsTypesEntity treatmentFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "treatment_id_to")
    private ClinicalTrialsTypesEntity treatmentTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "provenance_id_from")
    private ClinicalTrialsTypesEntity provenanceFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "provenance_id_to")
    private ClinicalTrialsTypesEntity provenanceTo;
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "phase_id_from")
    private NmClinicTrailPhasesEntity phaseFrom;
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "phase_id_to")
    private NmClinicTrailPhasesEntity phaseTo;
    @Basic
    @Column(name = "EudraCT_nr_from")
    private String eudraCtNrFrom;
    @Basic
    @Column(name = "EudraCT_nr_to")
    private String eudraCtNrTo;
    @Basic
    @Column(name = "code_from")
    private String codeFrom;
    @Basic
    @Column(name = "code_to")
    private String codeTo;
    @Basic
    @Column(name = "title_from")
    private String titleFrom;
    @Basic
    @Column(name = "title_to")
    private String titleTo;
    @Basic
    @Column(name = "sponsor_from")
    private String sponsorFrom;
    @Basic
    @Column(name = "sponsor_to")
    private String sponsorTo;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    private CtMedAmendEntity medicament/* = new CtMedAmendRepository()*/;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "reference_product_id")
    private CtMedAmendEntity referenceProduct /*= new CtMedAmendRepository()*/;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "placebo_id")
    private CtMedAmendEntity placebo /*= new CtMedAmendRepository()*/;

    @Basic
    @Column(name = "trial_pop_nat_from")
    private Integer trialPopNatFrom;
    @Basic
    @Column(name = "trial_pop_nat_to")
    private Integer trialPopNatTo;
    @Basic
    @Column(name = "trial_pop_internat_from")
    private Integer trialPopInternatFrom;
    @Basic
    @Column(name = "trial_pop_internat_to")
    private Integer trialPopInternatTo;

    @Basic
    @Column(name = "med_comission_nr")
    private String comissionNr;
    @Basic
    @Column(name = "med_comission_date")
    private Timestamp comissionDate;

//    @Basic
//    @Column(name = "appr_order_nr")
//    private String apprOrderNr;
//    @Basic
//    @Column(name = "appr_order_date")
//    private Timestamp apprOrderDate;

    @Basic
    @Column(name = "status", nullable = true, length = 1)
    private String status;

    @Transient
    private Set<CtMedicalInstitutionEntity> medicalInstitutionsFrom = new HashSet<>();

    @Transient
    private Set<CtMedicalInstitutionEntity> medicalInstitutionsTo = new HashSet<>();


//    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH}, orphanRemoval = true)
//    @JoinColumn(name = "clinical_trail_amend_id")
//    private Set<CtAmendMedInstInvestigatorEntity> amendMedInstInvestigators = new HashSet<>();

    public void assignTo(ClinicalTrialsEntity entity) {
        this.clinicalTrialsEntityId = entity.getId();
        this.phaseTo = entity.getPhase();
        this.treatmentTo = entity.getTreatment();
        this.provenanceTo = entity.getProvenance();
        this.eudraCtNrTo = entity.getEudraCtNr();
        this.codeTo = entity.getCode();
        this.titleTo = entity.getTitle();
        this.sponsorTo = entity.getSponsor();

        this.trialPopNatTo = entity.getTrialPopNat();
        this.trialPopInternatTo = entity.getTrialPopInternat();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClinicTrialAmendEntity that = (ClinicTrialAmendEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(registrationRequestId, that.registrationRequestId) &&
                Objects.equals(clinicalTrialsEntityId, that.clinicalTrialsEntityId) &&
                Objects.equals(treatmentFrom, that.treatmentFrom) &&
                Objects.equals(treatmentTo, that.treatmentTo) &&
                Objects.equals(provenanceFrom, that.provenanceFrom) &&
                Objects.equals(provenanceTo, that.provenanceTo) &&
                Objects.equals(phaseFrom, that.phaseFrom) &&
                Objects.equals(phaseTo, that.phaseTo) &&
                Objects.equals(eudraCtNrFrom, that.eudraCtNrFrom) &&
                Objects.equals(eudraCtNrTo, that.eudraCtNrTo) &&
                Objects.equals(codeFrom, that.codeFrom) &&
                Objects.equals(codeTo, that.codeTo) &&
                Objects.equals(titleFrom, that.titleFrom) &&
                Objects.equals(titleTo, that.titleTo) &&
                Objects.equals(sponsorFrom, that.sponsorFrom) &&
                Objects.equals(sponsorTo, that.sponsorTo) &&
                Objects.equals(medicament, that.medicament) &&
                Objects.equals(referenceProduct, that.referenceProduct) &&
                Objects.equals(placebo, that.placebo) &&
                Objects.equals(trialPopNatFrom, that.trialPopNatFrom) &&
                Objects.equals(trialPopNatTo, that.trialPopNatTo) &&
                Objects.equals(trialPopInternatFrom, that.trialPopInternatFrom) &&
                Objects.equals(trialPopInternatTo, that.trialPopInternatTo) &&
                Objects.equals(comissionNr, that.comissionNr) &&
                Objects.equals(comissionDate, that.comissionDate) &&
                Objects.equals(status, that.status);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, registrationRequestId, clinicalTrialsEntityId, treatmentFrom, treatmentTo, provenanceFrom, provenanceTo, phaseFrom, phaseTo, eudraCtNrFrom, eudraCtNrTo, codeFrom, codeTo, titleFrom, titleTo, sponsorFrom, sponsorTo, medicament, referenceProduct, placebo, trialPopNatFrom, trialPopNatTo, trialPopInternatFrom, trialPopInternatTo, comissionNr, comissionDate, status);
    }
}
