package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "ct_med_inst_subdiv")
public class CtMedInstSubdivisionsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "nm_med_inst_subdiv_id")
    private NmMedInstSubdivisionsEntity nmSubdivision;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "ct_med_inst_subdiv_id")
    private Set<CtInvestigatorEntity> investigatorsList = new HashSet<>();

    public void asign(CtAmendMedInstSubdivisionsEntity ctAmendMedInstSubdivisionsEntity) {
        this.nmSubdivision = ctAmendMedInstSubdivisionsEntity.getNmSubdivision();
        ctAmendMedInstSubdivisionsEntity.getInvestigatorsList().forEach(amendInvestig->{
            CtInvestigatorEntity amendInvestigatorEntity = new CtInvestigatorEntity();
            amendInvestigatorEntity.asign(amendInvestig);
            investigatorsList.add(amendInvestigatorEntity);
        });

    };
}
