package com.bass.amed.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;

@Data
public class DrugsNomenclator implements Serializable
{
    //    private Integer   id;
    private String    codulMed                          = "";
    private Integer   codVamal                          = 0;
    private String    denumireComerciala                = "";
    private String    formaFarmaceutica                 = "";
    private String    doza                              = "";
    private String    volum                             = "";
    private String    divizare                          = "";
    private String    atc                               = "";
    private String    firmaProducatoare                 = "";
    private Integer nrDeInregistrare                 = 0 ;
    private Timestamp dataInregistrarii;
    private Integer termenValabilitate = 0;
    private String    detinatorulCertificatuluiDeIntreg = "";
    private String    taraDetinatorului                 = "";
    private String    statutDeEliberare                 = "";
    private String    original                          = "";
    private String    instructiunea                     = "";
    private String    machetaAmbalajului                = "";
    private String    dci                               = "";

}
