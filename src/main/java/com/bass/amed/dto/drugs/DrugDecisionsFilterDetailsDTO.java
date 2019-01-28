package com.bass.amed.dto.drugs;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@Entity
public class DrugDecisionsFilterDetailsDTO implements Serializable {

    public DrugDecisionsFilterDetailsDTO() {
    }

    @Id
    private Integer id;
    private String protocolNr;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date protocolDate;
    private String drugSubstanceTypesId;
    private String drugSubstanceTypesCode;
    private String requestNumber;
    private String companyName;
    private String companyId;
    private String drugSubstanceTypeDescription;

}
