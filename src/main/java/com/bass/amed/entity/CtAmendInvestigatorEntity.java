package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "ct_amend_med_inst_subdiv_investig")
public class CtAmendInvestigatorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "nm_investigators_id")
    private NmInvestigatorsEntity nmInvestigator;

    @Basic
    @Column(name = "is_main")
    private Boolean isMain;

    public void asign(CtInvestigatorEntity ctInvestigatorEntity) {
        this.nmInvestigator = ctInvestigatorEntity.getNmInvestigator();
        this.isMain = ctInvestigatorEntity.getIsMain();
    }
}
