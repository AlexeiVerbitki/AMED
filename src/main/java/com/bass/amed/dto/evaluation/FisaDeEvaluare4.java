package com.bass.amed.dto.evaluation;
public class FisaDeEvaluare4 {
	private String medicamentCode;
	private String medicamentName;
	private String medicamentForm;
	private String doseConcentration;
	private String division;
	private String internationalMedicamentName;
	private Double priceMdl;
	private Double priceCurrency;

	public FisaDeEvaluare4() {
	}

	public FisaDeEvaluare4(String medicamentCode, String medicamentName, String medicamentForm,
			String doseConcentration, String division, String internationalMedicamentName, Double priceMdl,
			Double priceCurrency) {
		this.medicamentCode = medicamentCode;
		this.medicamentName = medicamentName;
		this.medicamentForm = medicamentForm;
		this.doseConcentration = doseConcentration;
		this.division = division;
		this.internationalMedicamentName = internationalMedicamentName;
		this.priceMdl = priceMdl;
		this.priceCurrency = priceCurrency;
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
}
