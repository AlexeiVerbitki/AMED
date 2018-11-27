package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Embeddable
@EqualsAndHashCode
public class CtMedInstInvPK implements Serializable {

    @NotNull
    @Column(name ="clinical_trail_id")
    private Integer clinicalTrailId;

    @NotNull
    @Column(name ="medical_institution_id")
    private Integer medicaInstitutionId;

    @NotNull
    @Column(name ="investigator_id")
    private Integer investigator;

    public CtMedInstInvPK() {}

    public CtMedInstInvPK(@NotNull Integer clinicalTrailId, @NotNull Integer medicaInstitutionId, @NotNull Integer investigator) {
        this.clinicalTrailId = clinicalTrailId;
        this.medicaInstitutionId = medicaInstitutionId;
        this.investigator = investigator;
    }

    public Integer getClinicalTrailId() {
        return clinicalTrailId;
    }

    public void setClinicalTrailId(Integer clinicalTrailId) {
        this.clinicalTrailId = clinicalTrailId;
    }

    public Integer getMedicaInstitutionId() {
        return medicaInstitutionId;
    }

    public void setMedicaInstitutionId(Integer medicaInstitutionId) {
        this.medicaInstitutionId = medicaInstitutionId;
    }

    public Integer getInvestigator() {
        return investigator;
    }

    public void setInvestigator(Integer investigator) {
        this.investigator = investigator;
    }

    //    @NotNull
//    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
//    @JoinColumn(name="medical_institution_id")
//    private NmMedicalInstitutionsEntity medicalInstitutionId;
//
//    @NotNull
//    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
//    @JoinColumn(name = "investigator_id")
//    private NmInvestigatorsEntity investigatorId;
//
//    public CtMedInstInvestigatorEntityPK() {
//
//    }
//
//    public CtMedInstInvestigatorEntityPK(Integer clinicalTrailId,NmMedicalInstitutionsEntity medicalInstitutionId,  NmInvestigatorsEntity investigatorsEntity) {
//        this.clinicalTrailId = clinicalTrailId;
//        this.medicalInstitutionId = medicalInstitutionId;
//        this.investigatorId = investigatorsEntity;
//    }

}
