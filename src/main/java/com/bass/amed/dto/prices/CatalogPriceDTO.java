package com.bass.amed.dto.prices;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Data
@AllArgsConstructor
@Entity
public class CatalogPriceDTO {
    public CatalogPriceDTO() {
    }

    @Id
    private Integer id;
    private String orderNr;
    private String medicamentCode;
    private String commercialName;
    private String pharmaceuticalForm;
    private String dose;
    private String volume;
    private String division;
    private String country;
    private String manufacture;
    private String registrationNumber;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date registrationDate;
    private String atcCode;
    private String internationalName;
    private Integer termsOfValidity;
    private String barCode;
    private String priceMdl;
    private String price;
    private String currency;
    private String priceApprovDate;
}
