package com.bass.amed.dto;

public class CommonMedicineInfo {
	private String medicineCode;
	private String commercialName;
	private String pharmaceuticalForm;
	private String dose;
	private String division;

	public CommonMedicineInfo() {
	}

	public CommonMedicineInfo(String medicineCode, String commercialName, String pharmaceuticalForm, String dose,
			String division) {
		this.medicineCode = medicineCode;
		this.commercialName = commercialName;
		this.pharmaceuticalForm = pharmaceuticalForm;
		this.dose = dose;
		this.division = division;
	}

	public String getMedicineCode() {
		return medicineCode;
	}

	public void setMedicineCode(String medicineCode) {
		this.medicineCode = medicineCode;
	}

	public String getCommercialName() {
		return commercialName;
	}

	public void setCommercialName(String commercialName) {
		this.commercialName = commercialName;
	}

	public String getPharmaceuticalForm() {
		return pharmaceuticalForm;
	}

	public void setPharmaceuticalForm(String pharmaceuticalForm) {
		this.pharmaceuticalForm = pharmaceuticalForm;
	}

	public String getDose() {
		return dose;
	}

	public void setDose(String dose) {
		this.dose = dose;
	}

	public String getDivision() {
		return division;
	}

	public void setDivision(String division) {
		this.division = division;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((commercialName == null) ? 0 : commercialName.hashCode());
		result = prime * result + ((division == null) ? 0 : division.hashCode());
		result = prime * result + ((dose == null) ? 0 : dose.hashCode());
		result = prime * result + ((medicineCode == null) ? 0 : medicineCode.hashCode());
		result = prime * result + ((pharmaceuticalForm == null) ? 0 : pharmaceuticalForm.hashCode());
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
		CommonMedicineInfo other = (CommonMedicineInfo) obj;
		if (commercialName == null) {
			if (other.commercialName != null)
				return false;
		} else if (!commercialName.equals(other.commercialName))
			return false;
		if (division == null) {
			if (other.division != null)
				return false;
		} else if (!division.equals(other.division))
			return false;
		if (dose == null) {
			if (other.dose != null)
				return false;
		} else if (!dose.equals(other.dose))
			return false;
		if (medicineCode == null) {
			if (other.medicineCode != null)
				return false;
		} else if (!medicineCode.equals(other.medicineCode))
			return false;
		if (pharmaceuticalForm == null) {
			if (other.pharmaceuticalForm != null)
				return false;
		} else if (!pharmaceuticalForm.equals(other.pharmaceuticalForm))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "CommonMedicineInfo [medicineCode=" + medicineCode + ", commercialName=" + commercialName
				+ ", pharmaceuticalForm=" + pharmaceuticalForm + ", dose=" + dose + ", division=" + division + "]";
	}

}
