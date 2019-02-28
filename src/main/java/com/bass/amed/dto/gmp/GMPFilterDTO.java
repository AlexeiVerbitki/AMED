package com.bass.amed.dto.gmp;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
public class GMPFilterDTO implements Serializable
{
    private String requestNumber;
    private NmEconomicAgentsEntity company;
    private String authorizationNumber;
    private String certificateNumber;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date authorizationStartDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date authorizationStartDateTo;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date certificateStartDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date certificateEndDateTo;

    public GMPFilterDTO()
    {

    }
}


