package com.bass.amed.entity;

import com.bass.amed.repository.CtAmendMedInstInvestigatorRepository;
import lombok.Data;
import lombok.EqualsAndHashCode;
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
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    private CtMedAmendEntity medicament/* = new CtMedAmendEntity()*/;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "reference_product_id")
    private CtMedAmendEntity referenceProduct /*= new CtMedAmendEntity()*/;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "placebo_id")
    private CtMedAmendEntity placebo /*= new CtMedAmendEntity()*/;
    @Basic
    @Column(name = "trial_population_national")
    private Integer trialPopNat;
    @Basic
    @Column(name = "trial_population_international")
    private Integer trialPopInternat;
    @Basic
    @Column(name = "med_comission_nr")
    private String comissionNr;
    @Basic
    @Column(name = "med_comission_date")
    private Timestamp comissionDate;
    @Basic
    @Column(name = "status", nullable = true, length = 1)
    private String status;

    @Transient
    private Set<CtMedicalInstitutionEntity> medicalInstitutions = new HashSet<>();

    public void assign(ClinicalTrialsEntity entity){
        this.clinicalTrialsEntityId = entity.getId();
        this.treatment = entity.getTreatment();
        this.provenance = entity.getProvenance();
        this.phase = entity.getPhase();
        this.eudraCtNr = entity.getEudraCtNr();
        this.code = entity.getCode();
        this.title = entity.getTitle();
        this.sponsor = entity.getSponsor();

//        this.medicament.asign(entity.getMedicament());
//        this.referenceProduct.asign(entity.getReferenceProduct());
//        this.placebo.asign(entity.getPlacebo());

        this.trialPopNat = entity.getTrialPopNat();
        this.trialPopInternat = entity.getTrialPopInternat();
        this.comissionNr = entity.getComissionNr();
        this.comissionDate = entity.getComissionDate();
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
                Objects.equals(comissionNr, that.comissionNr) &&
                Objects.equals(comissionDate, that.comissionDate) &&
                Objects.equals(status, that.status) &&
                Objects.equals(medicalInstitutions, that.medicalInstitutions);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, registrationRequestId, clinicalTrialsEntityId, treatment, provenance, phase, eudraCtNr, code, title, sponsor, medicament, referenceProduct, placebo, trialPopNat, trialPopInternat, comissionNr, comissionDate, status, medicalInstitutions);
    }
}
