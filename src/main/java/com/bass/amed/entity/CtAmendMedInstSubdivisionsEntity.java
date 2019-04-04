package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "ct_amend_med_inst_subdiv")
public class CtAmendMedInstSubdivisionsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "nm_med_inst_subdiv_id")
    private NmMedInstSubdivisionsEntity nmSubdivision;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "ct_amend_med_inst_subdiv_id")
    private Set<CtAmendInvestigatorEntity> investigatorsList = new HashSet<>();

    public void asign(CtMedInstSubdivisionsEntity ctMedInstSubdivisionsEntity) {
        this.nmSubdivision = ctMedInstSubdivisionsEntity.getNmSubdivision();
        ctMedInstSubdivisionsEntity.getInvestigatorsList().forEach(investig->{
            CtAmendInvestigatorEntity amendInvestigatorEntity = new CtAmendInvestigatorEntity();
            amendInvestigatorEntity.asign(investig);
            investigatorsList.add(amendInvestigatorEntity);
        });

    };

}
