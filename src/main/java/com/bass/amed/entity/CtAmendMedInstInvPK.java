package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Embeddable
@EqualsAndHashCode
public class CtAmendMedInstInvPK implements Serializable {

    @NotNull
    @Column(name="clinical_trail_amend_id")
    private Integer clinicalTrailAmendId;

    @NotNull
    @Column(name="medical_institution_id")
    private Integer medicalInstitutionId;

    @NotNull
    @Column(name = "investigator_id")
    private Integer investigatorId;

    public CtAmendMedInstInvPK() {}

    public CtAmendMedInstInvPK(@NotNull Integer clinicalTrailAmendId, @NotNull Integer medicalInstitutionId, @NotNull Integer investigatorId){
        this.clinicalTrailAmendId = clinicalTrailAmendId;
        this.medicalInstitutionId = medicalInstitutionId;
        this.investigatorId = investigatorId;
    }

}
