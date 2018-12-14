package com.bass.amed.dto.clinicaltrial;

import lombok.Data;

import java.io.Serializable;

@Data
public class ClinicalTrailFilterDTO implements Serializable {

    private Integer id;
    private String code;
    private String eudraCtNr;
    private Integer treatmentId;
    private Integer provenanceId;
}
