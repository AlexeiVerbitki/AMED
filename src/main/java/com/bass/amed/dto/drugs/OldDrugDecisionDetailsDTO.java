package com.bass.amed.dto.drugs;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Date;

@Data
@AllArgsConstructor
@Entity
public class OldDrugDecisionDetailsDTO {

    public OldDrugDecisionDetailsDTO() {
    }

    @Id
    private Integer id;

    private String protocolNr;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date protocolDate;

    private Integer registrationRequestId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date paidDate;

    private Integer paycheckNr;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date paycheckDate;

    private Integer drugCommiteId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date announcementDate;

    private Integer announcementMethodId;

    private Integer cpcdResponseNr;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date cpcdResponseDate;

    private Integer drugSubstanceTypesId;
}
