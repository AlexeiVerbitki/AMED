package com.bass.amed.dto.clinicaltrial;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.sql.Timestamp;

@Data
@Entity
//@Table(name = "clinical_trials", schema = "amed")
public class ClinicalTrialDTO implements Serializable {
    @Id
    private Integer id;
    private String code;
    private String EudraCt_nr;
    private String treatment;
    private String provenance;
    private String sponsor;
    private String cometee;
    private Timestamp cometeeDate;
//    private String company;
}
