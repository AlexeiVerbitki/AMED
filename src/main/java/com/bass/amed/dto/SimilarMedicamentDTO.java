package com.bass.amed.dto;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
public class SimilarMedicamentDTO implements Serializable {

    private Integer id;
    private String name;
    private String code;
    private String internationalName;
    private String country;
    private String manufacture;
    private Double dose;
    private String pharmaceuticalForm;
    private String division;
    private Integer priceId;
    private BigDecimal mdlValue;
    private BigDecimal price;
    private String currency;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getInternationalName() {
        return internationalName;
    }

    public void setInternationalName(String internationalName) {
        this.internationalName = internationalName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getManufacture() {
        return manufacture;
    }

    public void setManufacture(String manufacture) {
        this.manufacture = manufacture;
    }

    public Double getDose() {
        return dose;
    }

    public void setDose(Double dose) {
        this.dose = dose;
    }

    public String getPharmaceuticalForm() {
        return pharmaceuticalForm;
    }

    public void setPharmaceuticalForm(String pharmaceuticalForm) {
        this.pharmaceuticalForm = pharmaceuticalForm;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    @Id
    public Integer getPriceId() {
        return priceId;
    }

    public void setPriceId(Integer priceId) {
        this.priceId = priceId;
    }

    public BigDecimal getMdlValue() {
        return mdlValue;
    }

    public void setMdlValue(BigDecimal mdlValue) {
        this.mdlValue = mdlValue;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
