package com.bass.amed.dto.evaluation;

import com.bass.amed.dto.CommonMedicineInfo;

public class FisaDeEvaluare13 {
	private CommonMedicineInfo medicamentInfo;
	private String country;
	private String manufacturer;
	private String internationalName;
	private Double priceMDL;
	private Double priceInCurrency;

	public FisaDeEvaluare13() {
		medicamentInfo = new CommonMedicineInfo();
	}

	public FisaDeEvaluare13(CommonMedicineInfo medicamentInfo, String country, String manufacturer,
			String internationalName, Double priceMDL, Double priceInCurrency) {
		this.medicamentInfo = medicamentInfo;
		this.country = country;
		this.manufacturer = manufacturer;
		this.internationalName = internationalName;
		this.priceMDL = priceMDL;
		this.priceInCurrency = priceInCurrency;
	}

	public FisaDeEvaluare13(String medicamentCode, String medicamentName, String pharmaceuticalForm, String dose,
			String division, String country, String manufacturer, String internationalName, Double priceMDL,
			Double priceInCurrency) {
		medicamentInfo = new CommonMedicineInfo(medicamentCode, medicamentName, pharmaceuticalForm, dose, division);
		this.country = country;
		this.manufacturer = manufacturer;
		this.internationalName = internationalName;
		this.priceMDL = priceMDL;
		this.priceInCurrency = priceInCurrency;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((country == null) ? 0 : country.hashCode());
		result = prime * result + ((internationalName == null) ? 0 : internationalName.hashCode());
		result = prime * result + ((manufacturer == null) ? 0 : manufacturer.hashCode());
		result = prime * result + ((medicamentInfo == null) ? 0 : medicamentInfo.hashCode());
		result = prime * result + ((priceInCurrency == null) ? 0 : priceInCurrency.hashCode());
		result = prime * result + ((priceMDL == null) ? 0 : priceMDL.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FisaDeEvaluare13 other = (FisaDeEvaluare13) obj;
		if (country == null) {
			if (other.country != null)
				return false;
		} else if (!country.equals(other.country))
			return false;
		if (internationalName == null) {
			if (other.internationalName != null)
				return false;
		} else if (!internationalName.equals(other.internationalName))
			return false;
		if (manufacturer == null) {
			if (other.manufacturer != null)
				return false;
		} else if (!manufacturer.equals(other.manufacturer))
			return false;
		if (medicamentInfo == null) {
			if (other.medicamentInfo != null)
				return false;
		} else if (!medicamentInfo.equals(other.medicamentInfo))
			return false;
		if (priceInCurrency == null) {
			if (other.priceInCurrency != null)
				return false;
		} else if (!priceInCurrency.equals(other.priceInCurrency))
			return false;
		if (priceMDL == null) {
			if (other.priceMDL != null)
				return false;
		} else if (!priceMDL.equals(other.priceMDL))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "FisaDeEvaluare13 [medicamentInfo=" + medicamentInfo + ", country=" + country + ", manufacturer="
				+ manufacturer + ", internationalName=" + internationalName + ", priceMDL=" + priceMDL
				+ ", priceInCurrency=" + priceInCurrency + "]";
	}
	
}
