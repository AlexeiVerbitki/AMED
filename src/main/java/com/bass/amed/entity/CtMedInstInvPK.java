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
}
