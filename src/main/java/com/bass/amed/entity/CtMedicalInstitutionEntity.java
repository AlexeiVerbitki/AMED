package com.bass.amed.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.*;

@Data
@Entity
@Table(name = "ct_med_inst")
public class CtMedicalInstitutionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "nm_med_inst_id")
    private NmMedicalInstitutionEntity nmMedicalInstitution;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "ct_med_inst_id")
    private Set<CtMedInstSubdivisionsEntity> subdivisionsList = new HashSet<>();

    public void asign(CtAmendMedicalInstitutionEntity ctAmendMedicalInstitutionEntity) {
        this.nmMedicalInstitution = ctAmendMedicalInstitutionEntity.getNmMedicalInstitution();
        ctAmendMedicalInstitutionEntity.getSubdivisionsList().forEach(amendSubdiv->{
            CtMedInstSubdivisionsEntity amendMedInstSubdivisionsEntity = new CtMedInstSubdivisionsEntity();
            amendMedInstSubdivisionsEntity.asign(amendSubdiv);
            subdivisionsList.add(amendMedInstSubdivisionsEntity);
        });
    }

}
