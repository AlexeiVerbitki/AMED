package com.bass.amed.dto;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.sql.Date;

@Data
@Entity
public class DrugsNomenclator implements Serializable
{
    @Id
    private Integer id;

    private String denumireComerciala;
    private String codulMed;
    private String codVamal;
    private String formaFarmaceutica;
    private String doza;
    private String volum;
    private String divizare;
    private String atc;
    private String firmaProducatoare;
    private Integer nrDeInregistrare;
    private Date dataInregistrarii;
    private boolean original;
    private String instructiunea;
    private String machetaAmbalajului;
    private String dci;
    private boolean statutDeEliberare;

    private String informatiaDespreProducator;
    private String detinatorulCertificatuluiDeIntreg;
    private String taraDetinatorului;

}
