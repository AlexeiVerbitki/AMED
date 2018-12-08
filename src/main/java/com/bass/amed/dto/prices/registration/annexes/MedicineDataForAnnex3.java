package com.bass.amed.dto.prices.registration.annexes;


import com.bass.amed.dto.CommonMedicineInfo;

public class MedicineDataForAnnex3 {
	private CommonMedicineInfo medicineInfo;
	private String country;
	private String producerCompany;
	private double previousPrice;
	private double reviewedPrice;
	private double producerPrice;
	private String currency;

	public MedicineDataForAnnex3() {
		medicineInfo = new CommonMedicineInfo();
	}

	public MedicineDataForAnnex3(String medicineCode, String commercialName, String pharmaceuticalForm, String dose,
								 String division, String country, String producerCompany, double previousPrice, double reviewedPrice,
								 double producerPrice, String currency) {
		medicineInfo = new CommonMedicineInfo();
		medicineInfo.setMedicineCode(medicineCode);
		medicineInfo.setCommercialName(commercialName);
		medicineInfo.setPharmaceuticalForm(pharmaceuticalForm);
		medicineInfo.setDose(dose);
		medicineInfo.setDivision(division);
		this.country = country;
		this.producerCompany = producerCompany;
		this.previousPrice = previousPrice;
		this.reviewedPrice = reviewedPrice;
		this.producerPrice = producerPrice;
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

	public double getPreviousPrice() {
		return previousPrice;
	}

	public void setPreviousPrice(double previousPrice) {
		this.previousPrice = previousPrice;
	}

	public double getReviewedPrice() {
		return reviewedPrice;
	}

	public void setReviewedPrice(double reviewedPrice) {
		this.reviewedPrice = reviewedPrice;
	}

	public double getProducerPrice() {
		return producerPrice;
	}

	public void setProducerPrice(double producerPrice) {
		this.producerPrice = producerPrice;
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
		result = prime * result + ((medicineInfo == null) ? 0 : medicineInfo.hashCode());
		long temp;
		temp = Double.doubleToLongBits(previousPrice);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + ((producerCompany == null) ? 0 : producerCompany.hashCode());
		temp = Double.doubleToLongBits(producerPrice);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		temp = Double.doubleToLongBits(reviewedPrice);
		result = prime * result + (int) (temp ^ (temp >>> 32));
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
		MedicineDataForAnnex3 other = (MedicineDataForAnnex3) obj;
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
		if (medicineInfo == null) {
			if (other.medicineInfo != null)
				return false;
		} else if (!medicineInfo.equals(other.medicineInfo))
			return false;
		if (Double.doubleToLongBits(previousPrice) != Double.doubleToLongBits(other.previousPrice))
			return false;
		if (producerCompany == null) {
			if (other.producerCompany != null)
				return false;
		} else if (!producerCompany.equals(other.producerCompany))
			return false;
		if (Double.doubleToLongBits(producerPrice) != Double.doubleToLongBits(other.producerPrice))
			return false;
		if (Double.doubleToLongBits(reviewedPrice) != Double.doubleToLongBits(other.reviewedPrice))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "MedicineDataForAnnex3 [medicineInfo=" + medicineInfo + ", country=" + country + ", producerCompany="
				+ producerCompany + ", previousPrice=" + previousPrice + ", reviewedPrice=" + reviewedPrice
				+ ", producerPrice=" + producerPrice + ", currency=" + currency + "]";
	}

}
