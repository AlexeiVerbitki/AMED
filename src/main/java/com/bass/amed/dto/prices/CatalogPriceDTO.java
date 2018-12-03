package com.bass.amed.dto.prices;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@Entity
public class CatalogPriceDTO {
    public CatalogPriceDTO() {
    }

    public CatalogPriceDTO(CatalogPriceDTO c) {
        setId(c.getId());
        setOrderNr(c.getOrderNr());
        setMedicamentCode(c.getMedicamentCode());
        setCommercialName(c.getCommercialName());
        setPharmaceuticalForm(c.getPharmaceuticalForm());
        setDose(c.getDose());
        setVolume(c.getVolume());
        setDivision(c.getDivision());
        setCountry(c.getCountry());
        setManufacture(c.getManufacture());
        setRegistrationNumber(c.getRegistrationNumber());
        setRegistrationDate(c.getRegistrationDate());
        setAtcCode(c.getAtcCode());
        setInternationalName(c.getInternationalName());
        setTermsOfValidity(c.getTermsOfValidity());
        setBarCode(c.getBarCode());
        setPriceMdl(c.getPriceMdl());
        setPriceMdlNew(c.getPriceMdlNew());
        setPriceMdlDifferencePercents(c.getPriceMdlDifferencePercents());
        setPrice(c.getPrice());
        setCurrency(c.getCurrency());
        setPriceApprovDate(c.getPriceApprovDate());
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
    private Double priceMdl;
    private Double priceMdlNew;
    private String priceMdlDifferencePercents;
    private Double price;
    private String currency;
    private String priceApprovDate;
}
