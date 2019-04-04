package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "ct_amend_med_inst")
public class CtAmendMedicalInstitutionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "nm_med_inst_id")
    private NmMedicalInstitutionEntity nmMedicalInstitution;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "ct_amend_med_inst_id")
    private Set<CtAmendMedInstSubdivisionsEntity> subdivisionsList = new HashSet<>();

    @Basic
    @Column(name = "is_new")
    private Boolean isNew;

    public void asign(CtMedicalInstitutionEntity ctMedicalInstitutionEntity, boolean isNew) {
        this.nmMedicalInstitution = ctMedicalInstitutionEntity.getNmMedicalInstitution();
        ctMedicalInstitutionEntity.getSubdivisionsList().forEach(subdiv->{
            CtAmendMedInstSubdivisionsEntity amendMedInstSubdivisionsEntity = new CtAmendMedInstSubdivisionsEntity();
            amendMedInstSubdivisionsEntity.asign(subdiv);
            subdivisionsList.add(amendMedInstSubdivisionsEntity);
        });
        this.isNew = isNew;
    }
}
