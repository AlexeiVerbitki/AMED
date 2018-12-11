package com.bass.amed.dto.prices.evaluation;

import com.bass.amed.dto.CommonMedicineInfo;

import java.util.Objects;

public class FisaDeEvaluare13 {
    private CommonMedicineInfo medicamentInfo;
    private String country;
    private String manufacturer;
    private String internationalName;
    private Double priceMDL;
    private Double priceInCurrency;
    private String currency;

    public FisaDeEvaluare13() {
        medicamentInfo = new CommonMedicineInfo();
    }

    public FisaDeEvaluare13(CommonMedicineInfo medicamentInfo, String country, String manufacturer,
                            String internationalName, Double priceMDL, Double priceInCurrency, String currency) {
        this.medicamentInfo = medicamentInfo;
        this.country = country;
        this.manufacturer = manufacturer;
        this.internationalName = internationalName;
        this.priceMDL = priceMDL;
        this.priceInCurrency = priceInCurrency;
        this.currency = currency;
    }

    public FisaDeEvaluare13(String medicamentCode, String medicamentName, String pharmaceuticalForm, String dose,
                            String division, String country, String manufacturer, String internationalName, Double priceMDL,
                            Double priceInCurrency, String currency) {
        medicamentInfo = new CommonMedicineInfo(medicamentCode, medicamentName, pharmaceuticalForm, dose, division);
        this.country = country;
        this.manufacturer = manufacturer;
        this.internationalName = internationalName;
        this.priceMDL = priceMDL;
        this.priceInCurrency = priceInCurrency;
        this.currency = currency;
    }

    public CommonMedicineInfo getMedicamentInfo() {
        return medicamentInfo;
    }

    public void setMedicamentInfo(CommonMedicineInfo medicamentInfo) {
        this.medicamentInfo = medicamentInfo;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getInternationalName() {
        return internationalName;
    }

    public void setInternationalName(String internationalName) {
        this.internationalName = internationalName;
    }

    public Double getPriceMDL() {
        return priceMDL;
    }

    public void setPriceMDL(Double priceMDL) {
        this.priceMDL = priceMDL;
    }

    public Double getPriceInCurrency() {
        return priceInCurrency;
    }

    public void setPriceInCurrency(Double priceInCurrency) {
        this.priceInCurrency = priceInCurrency;
    }

    public String getMedicamentCode() {
        return medicamentInfo.getMedicineCode();
    }

    public void setMedicamentCode(String medicamentCode) {
        medicamentInfo.setMedicineCode(medicamentCode);
    }

    public String getMedicamentName() {
        return medicamentInfo.getCommercialName();
    }

    public void setMedicamentName(String medicamentName) {
        medicamentInfo.setCommercialName(medicamentName);
    }

    public String getPharmaceuticalForm() {
        return medicamentInfo.getPharmaceuticalForm();
    }

    public void setPharmaceuticalForm(String pharmaceuticalForm) {
        medicamentInfo.setPharmaceuticalForm(pharmaceuticalForm);
    }

    public String getDose() {
        return medicamentInfo.getDose();
    }

    public void setDose(String dose) {
        medicamentInfo.setDose(dose);
    }

    public String getDivision() {
        return medicamentInfo.getDivision();
    }

    public void setDivision(String division) {
        medicamentInfo.setDivision(division);
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FisaDeEvaluare13 that = (FisaDeEvaluare13) o;
        return medicamentInfo.equals(that.medicamentInfo) &&
                country.equals(that.country) &&
                manufacturer.equals(that.manufacturer) &&
                internationalName.equals(that.internationalName) &&
                priceMDL.equals(that.priceMDL) &&
                priceInCurrency.equals(that.priceInCurrency) &&
                currency.equals(that.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(medicamentInfo, country, manufacturer, internationalName, priceMDL, priceInCurrency, currency);
    }

    @Override
    public String toString() {
        return "FisaDeEvaluare13{" +
                "medicamentInfo=" + medicamentInfo +
                ", country='" + country + '\'' +
                ", manufacturer='" + manufacturer + '\'' +
                ", internationalName='" + internationalName + '\'' +
                ", priceMDL=" + priceMDL +
                ", priceInCurrency=" + priceInCurrency +
                ", currency='" + currency + '\'' +
                '}';
    }
}
