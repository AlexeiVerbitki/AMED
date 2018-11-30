package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@Table(name = "ct_amend_med_inst_investigator", schema = "amed", catalog = "")
public class CtAmendMedInstInvestigatorEntity {
    @EmbeddedId
    private CtAmendMedInstInvPK embededId;

//    @Basic
//    @Column(name = "clinical_trail_amend_id")
//    private Integer clinicalTrialsAmendId;
//
//    @Basic
//    @Column(name = "medical_institution_id")
//    private Integer medicalInstitutionsEntity;
//
//    @Basic
//    @Column(name = "investigator_id")
//    private Integer investigatorsEntity;

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

    public CtAmendMedInstInvestigatorEntity(ClinicTrialAmendEntity clinicalTrialsAmendEntity, CtMedicalInstitutionEntity medicalInstitutionsEntity,CtInvestigatorEntity investigatorsEntity, Boolean mainInvestigator){
        this.clinicalTrialsAmendEntity = clinicalTrialsAmendEntity;
        this.medicalInstitutionsEntity = medicalInstitutionsEntity;
        this.investigatorsEntity = investigatorsEntity;
        this.mainInvestigator = mainInvestigator;
        this.embededId = new CtAmendMedInstInvPK(clinicalTrialsAmendEntity.getId(),medicalInstitutionsEntity.getId(), investigatorsEntity.getId());
    }

    public CtAmendMedInstInvestigatorEntity(Integer ctId, Integer medInstId, Integer investigID, Boolean mainInvestigator){
        this.mainInvestigator = mainInvestigator;
        this.embededId = new CtAmendMedInstInvPK(ctId,medInstId, investigID);
    }

    public CtAmendMedInstInvestigatorEntity(){}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtAmendMedInstInvestigatorEntity that = (CtAmendMedInstInvestigatorEntity) o;
        return Objects.equals(embededId, that.embededId) &&
                Objects.equals(mainInvestigator, that.mainInvestigator);
    }

    @Override
    public int hashCode() {

        return Objects.hash(embededId, mainInvestigator);
    }
}
