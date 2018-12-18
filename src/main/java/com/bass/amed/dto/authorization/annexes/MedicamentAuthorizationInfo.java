package com.bass.amed.dto.authorization.annexes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MedicamentAuthorizationInfo {
	private String country;
	private String companyName;
	private List<MedicineProduct> medicamentProducts;
	
	public MedicamentAuthorizationInfo() {
		
	}

	public MedicamentAuthorizationInfo(String country, String companyName, List<MedicineProduct> medicamentProducts) {
		super();
		this.country = country;
		this.companyName = companyName;
		this.medicamentProducts = medicamentProducts;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public List<MedicineProduct> getMedicamentProducts() {
		return medicamentProducts;
	}

	public void setMedicamentProducts(List<MedicineProduct> medicamentProducts) {
		this.medicamentProducts = medicamentProducts;
	}

	@Override
	protected MedicamentAuthorizationInfo clone() throws CloneNotSupportedException {
		MedicamentAuthorizationInfo clone = new MedicamentAuthorizationInfo();
		clone.setCompanyName(this.getCompanyName());
		clone.setCountry(this.getCountry());
		List<MedicineProduct> medicineProducts = new ArrayList<MedicineProduct>();
		Collections.copy(medicineProducts, this.getMedicamentProducts());
		clone.setMedicamentProducts(medicineProducts);
		return clone;
	}

	
}
