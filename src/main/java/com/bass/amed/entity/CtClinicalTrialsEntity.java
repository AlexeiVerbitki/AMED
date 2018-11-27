package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
//@Entity
public class CtClinicalTrialsEntity extends ClinicalTrialsEntity {

//    @OneToMany(targetEntity=CtMedInstInvestigatorEntity.class, cascade = CascadeType.DETACH, orphanRemoval = true)
//    private Set<CtMedInstInvestigatorEntity> medInstInvestigators = new HashSet<>();

//    public void addMedicalInstitution(CtMedicalInstitutionEntity medInst) {
//        CtMedInstInvestigatorEntity mdIstInves = new CtMedInstInvestigatorEntity(this, medInst.g);
//        medInstInvestigators
//    }



//    private ClinicalTrialsEntity clinicalTrial;
//    private Set<CtMedicalInstitutionEntity> medicalInstitutionEntities;

}
