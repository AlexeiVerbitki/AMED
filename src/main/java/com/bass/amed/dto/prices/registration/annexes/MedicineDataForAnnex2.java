package com.bass.amed.dto.prices.registration.annexes;

import com.bass.amed.dto.CommonMedicineInfo;

public class MedicineDataForAnnex2 {
	private CommonMedicineInfo medicineInfo;
	private String country;
	private String producerCompany;
	private String internationalName;
	private Double producerPrice; // without VAT, in national currency (MDL)
	private Double priceInCurrency;
	private String currency;

	public MedicineDataForAnnex2() {
		medicineInfo = new CommonMedicineInfo();
	}

	public MedicineDataForAnnex2(String medicineCode, String commercialName, String pharmaceuticalForm, String dose,
			String division, String country, String producerCompany, String internationalName, Double producerPrice,
			Double priceInCurrency, String currency) {
		medicineInfo = new CommonMedicineInfo(medicineCode, commercialName, pharmaceuticalForm, dose, division);
		this.country = country;
		this.producerCompany = producerCompany;
		this.internationalName = internationalName;
		this.producerPrice = producerPrice;
		this.priceInCurrency = priceInCurrency;
		this.currency = currency;
	}

	public CommonMedicineInfo getMedicineInfo() {
		return medicineInfo;
	}

	public void setMedicineInfo(CommonMedicineInfo medicineInfo) {
		this.medicineInfo = medicineInfo;
	}

	public String getMedicineCode() {
		return medicineInfo.getMedicineCode();
	}

	public void setMedicineCode(String medicineCode) {
		medicineInfo.setMedicineCode(medicineCode);
	}

	public String getCommercialName() {
		return medicineInfo.getCommercialName();
	}

	public void setCommercialName(String commercialName) {
		medicineInfo.setCommercialName(commercialName);
	}

	public String getPharmaceuticalForm() {
		return medicineInfo.getPharmaceuticalForm();
	}

	public void setPharmaceuticalForm(String pharmaceuticalForm) {
		medicineInfo.setPharmaceuticalForm(pharmaceuticalForm);
	}

	public String getDose() {
		return medicineInfo.getDose();
	}

	public void setDose(String dose) {
		medicineInfo.setDose(dose);
	}

	public String getDivision() {
		return medicineInfo.getDivision();
	}

	public void setDivision(String division) {
		medicineInfo.setDivision(division);
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getProducerCompany() {
		return producerCompany;
	}

	public void setProducerCompany(String producerCompany) {
		this.producerCompany = producerCompany;
	}

	public String getInternationalName() {
		return internationalName;
	}

	public void setInternationalName(String internationalName) {
		this.internationalName = internationalName;
	}

	public Double getProducerPrice() {
		return producerPrice;
	}

	public void setProducerPrice(Double producerPrice) {
		this.producerPrice = producerPrice;
	}

	public Double getPriceInCurrency() {
		return priceInCurrency;
	}

	public void setPriceInCurrency(Double priceInCurrency) {
		this.priceInCurrency = priceInCurrency;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((country == null) ? 0 : country.hashCode());
		result = prime * result + ((currency == null) ? 0 : currency.hashCode());
		result = prime * result + ((internationalName == null) ? 0 : internationalName.hashCode());
		result = prime * result + ((medicineInfo == null) ? 0 : medicineInfo.hashCode());
		result = prime * result + ((priceInCurrency == null) ? 0 : priceInCurrency.hashCode());
		result = prime * result + ((producerCompany == null) ? 0 : producerCompany.hashCode());
		result = prime * result + ((producerPrice == null) ? 0 : producerPrice.hashCode());
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
		MedicineDataForAnnex2 other = (MedicineDataForAnnex2) obj;
		if (country == null) {
			if (other.country != null)
				return false;
		} else if (!country.equals(other.country))
			return false;
		if (currency == null) {
			if (other.currency != null)
				return false;
		} else if (!currency.equals(other.currency))
			return false;
		if (internationalName == null) {
			if (other.internationalName != null)
				return false;
		} else if (!internationalName.equals(other.internationalName))
			return false;
		if (medicineInfo == null) {
			if (other.medicineInfo != null)
				return false;
		} else if (!medicineInfo.equals(other.medicineInfo))
			return false;
		if (priceInCurrency == null) {
			if (other.priceInCurrency != null)
				return false;
		} else if (!priceInCurrency.equals(other.priceInCurrency))
			return false;
		if (producerCompany == null) {
			if (other.producerCompany != null)
				return false;
		} else if (!producerCompany.equals(other.producerCompany))
			return false;
		if (producerPrice == null) {
			if (other.producerPrice != null)
				return false;
		} else if (!producerPrice.equals(other.producerPrice))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "MedicineDataForAnnex2 [medicineInfo=" + medicineInfo + ", country=" + country + ", producerCompany="
				+ producerCompany + ", internationalName=" + internationalName + ", producerPrice=" + producerPrice
				+ ", priceInCurrency=" + priceInCurrency + ", currency=" + currency + "]";
	}

}
