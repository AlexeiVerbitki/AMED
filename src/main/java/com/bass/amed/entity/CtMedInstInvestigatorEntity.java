package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Entity
@Data
@EqualsAndHashCode
@Table(name = "ct_med_inst_investigator", schema = "amed", catalog = "")
public class CtMedInstInvestigatorEntity {
    @EmbeddedId
    private CtMedInstInvPK embededId;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @MapsId("clinicalTrailId")
    @JoinColumn(name = "clinical_trail_id")
    private ClinicalTrialsEntity clinicalTrialsEntity;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @MapsId("medicaInstitutionId")
    @JoinColumn(name = "medical_institution_id")
    private CtMedicalInstitutionEntity medicalInstitutionsEntity;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @MapsId("investigator")
    @JoinColumn(name = "investigator_id")
    private CtInvestigatorEntity investigatorsEntity;

    @Column(name = "main_investigator")
    private Boolean mainInvestigator;

    public CtMedInstInvestigatorEntity(Integer ctId, Integer medInstId, Integer investigID, Boolean mainInvestigator){
        this.mainInvestigator = mainInvestigator;
        this.embededId = new CtMedInstInvPK(ctId,medInstId, investigID);
    }

    public CtMedInstInvestigatorEntity(){}

}
