package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "ct_med_inst_subdiv_investig")
public class CtInvestigatorEntity {
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

    public void asign(CtAmendInvestigatorEntity ctAmendInvestigatorEntity) {
        this.nmInvestigator = ctAmendInvestigatorEntity.getNmInvestigator();
        this.isMain = ctAmendInvestigatorEntity.getIsMain();
    }
}
