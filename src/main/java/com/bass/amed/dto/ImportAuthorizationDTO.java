package com.bass.amed.dto;

import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@Entity
public class ImportAuthorizationDTO implements Serializable
{
    public ImportAuthorizationDTO()
    {

    }

    @Id
    private Integer id;
    private String authorizationsNumber;
    private String applicant;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Timestamp expirationDate;
    private String summ;
    private String currency;

}
