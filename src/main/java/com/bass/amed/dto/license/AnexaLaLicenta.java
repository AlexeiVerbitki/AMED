package com.bass.amed.dto.license;

public class AnexaLaLicenta {

	private Integer nr;
	private String address;
	private String pharmacist;
	private String pharmType;
	private Boolean psychotropicSubstances;

	public Integer getNr() {
		return nr;
	}

	public void setNr(Integer nr) {
		this.nr = nr;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPharmacist() {
		return pharmacist;
	}

	public void setPharmacist(String pharmacist) {
		this.pharmacist = pharmacist;
	}

	public String getPharmType() {
		return pharmType;
	}

	public void setPharmType(String pharmType) {
		this.pharmType = pharmType;
	}

	public Boolean getPsychotropicSubstances() {
		return psychotropicSubstances;
	}

	public void setPsychotropicSubstances(Boolean psychotropicSubstances) {
		this.psychotropicSubstances = psychotropicSubstances;
	}

}
