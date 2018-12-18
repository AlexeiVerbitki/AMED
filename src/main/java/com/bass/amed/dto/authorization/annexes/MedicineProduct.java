package com.bass.amed.dto.authorization.annexes;

public class MedicineProduct {
	private String name;
	private String pharmaceuticalForm;
	private String concentration;
	private String dose;
	private String registrationNumber;
	private String status;
	
	public MedicineProduct() {
	}

	public MedicineProduct(String name, String pharmaceuticalForm, String concentration, String dose,
			String registrationNumber, String status) {
		this.name = name;
		this.pharmaceuticalForm = pharmaceuticalForm;
		this.concentration = concentration;
		this.dose = dose;
		this.registrationNumber = registrationNumber;
		this.status = status;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPharmaceuticalForm() {
		return pharmaceuticalForm;
	}

	public void setPharmaceuticalForm(String pharmaceuticalForm) {
		this.pharmaceuticalForm = pharmaceuticalForm;
	}

	public String getConcentration() {
		return concentration;
	}

	public void setConcentration(String concentration) {
		this.concentration = concentration;
	}

	public String getDose() {
		return dose;
	}

	public void setDose(String dose) {
		this.dose = dose;
	}

	public String getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
}
