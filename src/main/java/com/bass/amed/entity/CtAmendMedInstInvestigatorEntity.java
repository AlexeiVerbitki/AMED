package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@Table(name = "ct_amend_med_inst_investigator", schema = "amed", catalog = "")
public class CtAmendMedInstInvestigatorEntity {
    @EmbeddedId
    private CtAmendMedInstInvPK embededId;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @MapsId("clinicalTrailAmendId")
    @JoinColumn(name = "clinical_trail_amend_id")
    private ClinicTrialAmendEntity clinicalTrialsAmendEntity;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @MapsId("medicalInstitutionId")
    @JoinColumn(name = "medical_institution_id")
    private CtMedicalInstitutionEntity medicalInstitutionsEntity;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @MapsId("investigatorId")
    @JoinColumn(name = "investigator_id")
    private CtInvestigatorEntity investigatorsEntity;

    @Column(name = "main_investigator")
    private Boolean mainInvestigator;

//    @Basic
//    @Column(name = "status")
//    private Character status;

    public boolean meaningfulyEquals(CtMedInstInvestigatorEntity o) {
        if (o == null) return false;

        return Objects.equals(medicalInstitutionsEntity.getId(), o.getMedicalInstitutionsEntity().getId()) &&
                Objects.equals(investigatorsEntity.getId(), o.getInvestigatorsEntity().getId()) &&
                Objects.equals(mainInvestigator, o.getMainInvestigator());
    }

    public CtAmendMedInstInvestigatorEntity(ClinicTrialAmendEntity clinicalTrialsAmendEntity, CtMedicalInstitutionEntity medicalInstitutionsEntity, CtInvestigatorEntity investigatorsEntity, Character status, Boolean mainInvestigator) {
        this.clinicalTrialsAmendEntity = clinicalTrialsAmendEntity;
        this.medicalInstitutionsEntity = medicalInstitutionsEntity;
        this.investigatorsEntity = investigatorsEntity;
        this.mainInvestigator = mainInvestigator;
        this.embededId = new CtAmendMedInstInvPK(clinicalTrialsAmendEntity.getId(), medicalInstitutionsEntity.getId(), investigatorsEntity.getId(), status);
    }

    public CtAmendMedInstInvestigatorEntity(Integer ctId, Integer medInstId, Integer investigID, Boolean mainInvestigator, Character status) {
        this.mainInvestigator = mainInvestigator;
        this.embededId = new CtAmendMedInstInvPK(ctId, medInstId, investigID, status);
    }

    public CtAmendMedInstInvestigatorEntity() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtAmendMedInstInvestigatorEntity that = (CtAmendMedInstInvestigatorEntity) o;
        return Objects.equals(embededId, that.embededId) &&
                Objects.equals(clinicalTrialsAmendEntity, that.clinicalTrialsAmendEntity) &&
                Objects.equals(medicalInstitutionsEntity, that.medicalInstitutionsEntity) &&
                Objects.equals(investigatorsEntity, that.investigatorsEntity) &&
                Objects.equals(mainInvestigator, that.mainInvestigator);
    }

    @Override
    public int hashCode() {

        return Objects.hash(embededId, clinicalTrialsAmendEntity, medicalInstitutionsEntity, investigatorsEntity, mainInvestigator);
    }

    //    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        CtAmendMedInstInvestigatorEntity that = (CtAmendMedInstInvestigatorEntity) o;
//        return Objects.equals(medicalInstitutionsEntity, that.medicalInstitutionsEntity) &&
//                Objects.equals(investigatorsEntity, that.investigatorsEntity) &&
//                Objects.equals(mainInvestigator, that.mainInvestigator);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(medicalInstitutionsEntity,investigatorsEntity, mainInvestigator);
//    }
}
