package com.bass.amed.dto.prices.registration;

import com.bass.amed.dto.CommonMedicineInfo;

import java.util.Objects;

public class PriceComparisonInfo {
	private String manufacturer;
	private CommonMedicineInfo medicineInfo;
	private String registrationNumber;
	private String lastPriceRegistrationInfo;
	private double lastRegistrationPriceMDL;
	private double lastRegistrationPriceInCurrency;
	private String lastPriceReviewInfo;
	private double lastReviewPriceMDL;
	private double lastReviewPriceInCurrency;
	private double approvedPriceMDL;
	private double approvedPriceInCurrency;
	private String currency;
	private double actualCurrencyPriceChangePercent;
	private double registrationPriceMDLChangePercent;
	private double reviewedPriceMDLChangePercent;

	public PriceComparisonInfo() {
		medicineInfo = new CommonMedicineInfo();
	}

	public PriceComparisonInfo(String manufacturer, CommonMedicineInfo medicineInfo, String registrationNumber,
			String lastPriceRegistrationInfo, double lastRegistrationPriceMDL, double lastRegistrationPriceInCurrency,
			String lastPriceReviewInfo, double lastReviewPriceMDL, double lastReviewPriceInCurrency,
			double approvedPriceMDL, double approvedPriceInCurrency, String currency,
			double actualCurrencyPriceChangePercent, double registrationPriceMDLChangePercent,
			double reviewedPriceMDLChangePercent) {
		this.manufacturer = manufacturer;
		this.medicineInfo = medicineInfo;
		this.registrationNumber = registrationNumber;
		this.lastPriceRegistrationInfo = lastPriceRegistrationInfo;
		this.lastRegistrationPriceMDL = lastRegistrationPriceMDL;
		this.lastRegistrationPriceInCurrency = lastRegistrationPriceInCurrency;
		this.lastPriceReviewInfo = lastPriceReviewInfo;
		this.lastReviewPriceMDL = lastReviewPriceMDL;
		this.lastReviewPriceInCurrency = lastReviewPriceInCurrency;
		this.approvedPriceMDL = approvedPriceMDL;
		this.approvedPriceInCurrency = approvedPriceInCurrency;
		this.currency = currency;
		this.actualCurrencyPriceChangePercent = actualCurrencyPriceChangePercent;
		this.registrationPriceMDLChangePercent = registrationPriceMDLChangePercent;
		this.reviewedPriceMDLChangePercent = reviewedPriceMDLChangePercent;
	}
	
	public PriceComparisonInfo(String manufacturer, String medicineCode, String commercialName, String pharmaceuticalForm, String dose, String division, String registrationNumber,
			String lastPriceRegistrationInfo, double lastRegistrationPriceMDL, double lastRegistrationPriceInCurrency,
			String lastPriceReviewInfo, double lastReviewPriceMDL, double lastReviewPriceInCurrency,
			double approvedPriceMDL, double approvedPriceInCurrency, String currency,
			double actualCurrencyPriceChangePercent, double registrationPriceMDLChangePercent,
			double reviewedPriceMDLChangePercent) {
		this.manufacturer = manufacturer;
		medicineInfo = new CommonMedicineInfo();
		medicineInfo.setMedicineCode(medicineCode);
		medicineInfo.setCommercialName(commercialName);
		medicineInfo.setPharmaceuticalForm(pharmaceuticalForm);
		medicineInfo.setDose(dose);
		medicineInfo.setDivision(division);
		this.registrationNumber = registrationNumber;
		this.lastPriceRegistrationInfo = lastPriceRegistrationInfo;
		this.lastRegistrationPriceMDL = lastRegistrationPriceMDL;
		this.lastRegistrationPriceInCurrency = lastRegistrationPriceInCurrency;
		this.lastPriceReviewInfo = lastPriceReviewInfo;
		this.lastReviewPriceMDL = lastReviewPriceMDL;
		this.lastReviewPriceInCurrency = lastReviewPriceInCurrency;
		this.approvedPriceMDL = approvedPriceMDL;
		this.approvedPriceInCurrency = approvedPriceInCurrency;
		this.currency = currency;
		this.actualCurrencyPriceChangePercent = actualCurrencyPriceChangePercent;
		this.registrationPriceMDLChangePercent = registrationPriceMDLChangePercent;
		this.reviewedPriceMDLChangePercent = reviewedPriceMDLChangePercent;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
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

	public String getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}

	public String getLastPriceRegistrationInfo() {
		return lastPriceRegistrationInfo;
	}

	public void setLastPriceRegistrationInfo(String lastPriceRegistrationInfo) {
		this.lastPriceRegistrationInfo = lastPriceRegistrationInfo;
	}

	public double getLastRegistrationPriceMDL() {
		return lastRegistrationPriceMDL;
	}

	public void setLastRegistrationPriceMDL(double lastRegistrationPriceMDL) {
		this.lastRegistrationPriceMDL = lastRegistrationPriceMDL;
	}

	public double getLastRegistrationPriceInCurrency() {
		return lastRegistrationPriceInCurrency;
	}

	public void setLastRegistrationPriceInCurrency(double lastRegistrationPriceInCurrency) {
		this.lastRegistrationPriceInCurrency = lastRegistrationPriceInCurrency;
	}

	public String getLastPriceReviewInfo() {
		return lastPriceReviewInfo;
	}

	public void setLastPriceReviewInfo(String lastPriceReviewInfo) {
		this.lastPriceReviewInfo = lastPriceReviewInfo;
	}

	public double getLastReviewPriceMDL() {
		return lastReviewPriceMDL;
	}

	public void setLastReviewPriceMDL(double lastReviewPriceMDL) {
		this.lastReviewPriceMDL = lastReviewPriceMDL;
	}

	public double getLastReviewPriceInCurrency() {
		return lastReviewPriceInCurrency;
	}

	public void setLastReviewPriceInCurrency(double lastReviewPriceInCurrency) {
		this.lastReviewPriceInCurrency = lastReviewPriceInCurrency;
	}

	public double getApprovedPriceMDL() {
		return approvedPriceMDL;
	}

	public void setApprovedPriceMDL(double approvedPriceMDL) {
		this.approvedPriceMDL = approvedPriceMDL;
	}

	public double getApprovedPriceInCurrency() {
		return approvedPriceInCurrency;
	}

	public void setApprovedPriceInCurrency(double approvedPriceInCurrency) {
		this.approvedPriceInCurrency = approvedPriceInCurrency;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public double getActualCurrencyPriceChangePercent() {
		return actualCurrencyPriceChangePercent;
	}

	public void setActualCurrencyPriceChangePercent(double actualCurrencyPriceChangePercent) {
		this.actualCurrencyPriceChangePercent = actualCurrencyPriceChangePercent;
	}

	public double getRegistrationPriceMDLChangePercent() {
		return registrationPriceMDLChangePercent;
	}

	public void setRegistrationPriceMDLChangePercent(double registrationPriceMDLChangePercent) {
		this.registrationPriceMDLChangePercent = registrationPriceMDLChangePercent;
	}

	public double getReviewedPriceMDLChangePercent() {
		return reviewedPriceMDLChangePercent;
	}

	public void setReviewedPriceMDLChangePercent(double reviewedPriceMDLChangePercent) {
		this.reviewedPriceMDLChangePercent = reviewedPriceMDLChangePercent;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		PriceComparisonInfo that = (PriceComparisonInfo) o;
		return Double.compare(that.lastRegistrationPriceMDL, lastRegistrationPriceMDL) == 0 &&
				Double.compare(that.lastRegistrationPriceInCurrency, lastRegistrationPriceInCurrency) == 0 &&
				Double.compare(that.lastReviewPriceMDL, lastReviewPriceMDL) == 0 &&
				Double.compare(that.lastReviewPriceInCurrency, lastReviewPriceInCurrency) == 0 &&
				Double.compare(that.approvedPriceMDL, approvedPriceMDL) == 0 &&
				Double.compare(that.approvedPriceInCurrency, approvedPriceInCurrency) == 0 &&
				Double.compare(that.actualCurrencyPriceChangePercent, actualCurrencyPriceChangePercent) == 0 &&
				Double.compare(that.registrationPriceMDLChangePercent, registrationPriceMDLChangePercent) == 0 &&
				Double.compare(that.reviewedPriceMDLChangePercent, reviewedPriceMDLChangePercent) == 0 &&
				manufacturer.equals(that.manufacturer) &&
				medicineInfo.equals(that.medicineInfo) &&
				registrationNumber.equals(that.registrationNumber) &&
				lastPriceRegistrationInfo.equals(that.lastPriceRegistrationInfo) &&
				lastPriceReviewInfo.equals(that.lastPriceReviewInfo) &&
				currency.equals(that.currency);
	}

	@Override
	public int hashCode() {
		return Objects.hash(manufacturer, medicineInfo, registrationNumber, lastPriceRegistrationInfo, lastRegistrationPriceMDL, lastRegistrationPriceInCurrency, lastPriceReviewInfo, lastReviewPriceMDL, lastReviewPriceInCurrency, approvedPriceMDL, approvedPriceInCurrency, currency, actualCurrencyPriceChangePercent, registrationPriceMDLChangePercent, reviewedPriceMDLChangePercent);
	}


}
