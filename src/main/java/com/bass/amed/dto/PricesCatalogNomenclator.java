package com.bass.amed.dto;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity
public class PricesCatalogNomenclator {
    @Id
    private Integer id;
    private String medCode;
    private String customsCode;
    private String comercialName;
    private String farmaceuticalForm;
    private String dose;
    private String volume;
    private String division;
    private String country;
    private String manufacture;
    private String regNr;
    private Date regDate;
    private String atc;
    private String internationalName;
    private Integer termsOfValidity;
    private String bareCode;
    private Double priceMdl;
    private Double price;
    private String currency;
    private String orderNr;
    private Date orderApprovDate;
}
