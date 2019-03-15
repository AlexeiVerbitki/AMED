package com.bass.amed.dto;

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
public class ImportAuthorizationSearchCriteria implements Serializable
{
    public ImportAuthorizationSearchCriteria()
    {

    }

    @Id
    private String id;
    private String authorizationsNumber;
    private String importer;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date expirationDate;
    private String summ;
    private String currency;
    private String medicament;
    private String medType;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date lessThanToday;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date moreThanToday;
//    private Boolean expired;

}
