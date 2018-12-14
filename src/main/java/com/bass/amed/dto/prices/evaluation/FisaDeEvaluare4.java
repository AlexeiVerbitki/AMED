package com.bass.amed.dto.prices.evaluation;

import java.util.Objects;

public class FisaDeEvaluare4 {
	private Integer id;
	private String medicamentCode;
	private String medicamentName;
	private String medicamentForm;
	private String doseConcentration;
	private String division;
	private String internationalMedicamentName;
	private Double priceMdl;
	private Double priceCurrency;
	private String currency;

	public FisaDeEvaluare4() {
	}

	public FisaDeEvaluare4(String medicamentCode, String medicamentName, String medicamentForm,
			String doseConcentration, String division, String internationalMedicamentName, Double priceMdl,
			Double priceCurrency, String currency) {
		this.medicamentCode = medicamentCode;
		this.medicamentName = medicamentName;
		this.medicamentForm = medicamentForm;
		this.doseConcentration = doseConcentration;
		this.division = division;
		this.internationalMedicamentName = internationalMedicamentName;
		this.priceMdl = priceMdl;
		this.priceCurrency = priceCurrency;
		this.currency = currency;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMedicamentCode() {
		return medicamentCode;
	}

	public void setMedicamentCode(String medicamentCode) {
		this.medicamentCode = medicamentCode;
	}

	public String getMedicamentName() {
		return medicamentName;
	}

	public void setMedicamentName(String medicamentName) {
		this.medicamentName = medicamentName;
	}

	public String getMedicamentForm() {
		return medicamentForm;
	}

	public void setMedicamentForm(String medicamentForm) {
		this.medicamentForm = medicamentForm;
	}

	public String getDoseConcentration() {
		return doseConcentration;
	}

	public void setDoseConcentration(String doseConcentration) {
		this.doseConcentration = doseConcentration;
	}

	public String getDivision() {
		return division;
	}

	public void setDivision(String division) {
		this.division = division;
	}

	public String getInternationalMedicamentName() {
		return internationalMedicamentName;
	}

	public void setInternationalMedicamentName(
			String internationalMedicamentName) {
		this.internationalMedicamentName = internationalMedicamentName;
	}

	public Double getPriceMdl() {
		return priceMdl;
	}

	public void setPriceMdl(Double priceMdl) {
		this.priceMdl = priceMdl;
	}

	public Double getPriceCurrency() {
		return priceCurrency;
	}

	public void setPriceCurrency(Double priceCurrency) {
		this.priceCurrency = priceCurrency;
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
		FisaDeEvaluare4 that = (FisaDeEvaluare4) o;
		return Objects.equals(medicamentCode, that.medicamentCode) &&
				Objects.equals(medicamentName, that.medicamentName) &&
				Objects.equals(medicamentForm, that.medicamentForm) &&
				Objects.equals(doseConcentration, that.doseConcentration) &&
				Objects.equals(division, that.division) &&
				Objects.equals(internationalMedicamentName, that.internationalMedicamentName) &&
				Objects.equals(priceMdl, that.priceMdl) &&
				Objects.equals(priceCurrency, that.priceCurrency) &&
				Objects.equals(id, that.id) &&
				Objects.equals(currency, that.currency);
	}

	@Override
	public int hashCode() {
		return Objects.hash(medicamentCode, medicamentName, medicamentForm, doseConcentration, division, internationalMedicamentName, priceMdl, priceCurrency, currency, id);
	}

	@Override
	public String toString() {
		return "FisaDeEvaluare4{" +
				"medicamentCode='" + medicamentCode + '\'' +
				", medicamentName='" + medicamentName + '\'' +
				", id='" + id + '\'' +
				", medicamentForm='" + medicamentForm + '\'' +
				", doseConcentration='" + doseConcentration + '\'' +
				", division='" + division + '\'' +
				", internationalMedicamentName='" + internationalMedicamentName + '\'' +
				", priceMdl=" + priceMdl +
				", priceCurrency=" + priceCurrency +
				", currency='" + currency + '\'' +
				'}';
	}
}

