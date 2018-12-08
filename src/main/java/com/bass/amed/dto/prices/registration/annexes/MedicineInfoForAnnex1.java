package com.bass.amed.dto.prices.registration.annexes;

import java.util.ArrayList;
import java.util.List;

public class MedicineInfoForAnnex1 {
	private String companyName;
	private String country;
	private String currency;
	private List<RegistrationPriceDataForAnnex1> registrationPrices;

	public MedicineInfoForAnnex1() {
		companyName = "";
		country = "";
		currency = "";
		registrationPrices = new ArrayList<RegistrationPriceDataForAnnex1>();
	}

	public MedicineInfoForAnnex1(String companyName, String country, String currency,
			List<RegistrationPriceDataForAnnex1> registrationPrices) {
		this.companyName = companyName;
		this.country = country;
		this.currency = currency;
		this.registrationPrices = registrationPrices;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public List<RegistrationPriceDataForAnnex1> getRegistrationPrices() {
		return registrationPrices;
	}

	public void setRegistrationPrices(List<RegistrationPriceDataForAnnex1> registrationPrices) {
		this.registrationPrices = registrationPrices;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((companyName == null) ? 0 : companyName.hashCode());
		result = prime * result + ((country == null) ? 0 : country.hashCode());
		result = prime * result + ((currency == null) ? 0 : currency.hashCode());
		result = prime * result + ((registrationPrices == null) ? 0 : registrationPrices.hashCode());
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
		MedicineInfoForAnnex1 other = (MedicineInfoForAnnex1) obj;
		if (companyName == null) {
			if (other.companyName != null)
				return false;
		} else if (!companyName.equals(other.companyName))
			return false;
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
		if (registrationPrices == null) {
			if (other.registrationPrices != null)
				return false;
		} else if (!registrationPrices.equals(other.registrationPrices))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "MedicineInfoForAnnex1 [companyName=" + companyName + ", country=" + country + ", currency=" + currency
				+ ", registrationPrices=" + registrationPrices + "]";
	}

}
