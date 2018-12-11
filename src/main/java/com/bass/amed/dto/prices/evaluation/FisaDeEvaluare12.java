package com.bass.amed.dto.prices.evaluation;

public class FisaDeEvaluare12 {
	private String country;
	private String countryCurrency;
	private String division;
	private Double currencyPrice;
	private Double exchangeRateCurrencyMDL;
	private Double priceMDL;
	private Double exchangeRateEURO_MDL;
	private Double priceEURO;
	private Double exchangeRateUSD_MDL;
	private Double priceUSD;
	public FisaDeEvaluare12() {
		// TODO Auto-generated constructor stub
	}
	public FisaDeEvaluare12(String country, String countryCurrency, String division, Double currencyPrice,
			Double exchangeRateCurrencyMDL, Double priceMDL, Double exchangeRateEURO_MDL, Double priceEURO,
			Double exchangeRateUSD_MDL, Double priceUSD) {
		this.country = country;
		this.countryCurrency = countryCurrency;
		this.division = division;
		this.currencyPrice = currencyPrice;
		this.exchangeRateCurrencyMDL = exchangeRateCurrencyMDL;
		this.priceMDL = priceMDL;
		this.exchangeRateEURO_MDL = exchangeRateEURO_MDL;
		this.priceEURO = priceEURO;
		this.exchangeRateUSD_MDL = exchangeRateUSD_MDL;
		this.priceUSD = priceUSD;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getCountryCurrency() {
		return countryCurrency;
	}
	public void setCountryCurrency(String countryCurrency) {
		this.countryCurrency = countryCurrency;
	}
	public String getDivision() {
		return division;
	}
	public void setDivision(String division) {
		this.division = division;
	}
	public Double getCurrencyPrice() {
		return currencyPrice;
	}
	public void setCurrencyPrice(Double currencyPrice) {
		this.currencyPrice = currencyPrice;
	}
	public Double getExchangeRateCurrencyMDL() {
		return exchangeRateCurrencyMDL;
	}
	public void setExchangeRateCurrencyMDL(Double exchangeRateCurrencyMDL) {
		this.exchangeRateCurrencyMDL = exchangeRateCurrencyMDL;
	}
	public Double getPriceMDL() {
		return priceMDL;
	}
	public void setPriceMDL(Double priceMDL) {
		this.priceMDL = priceMDL;
	}
	public Double getExchangeRateEURO_MDL() {
		return exchangeRateEURO_MDL;
	}
	public void setExchangeRateEURO_MDL(Double exchangeRateEURO_MDL) {
		this.exchangeRateEURO_MDL = exchangeRateEURO_MDL;
	}
	public Double getPriceEURO() {
		return priceEURO;
	}
	public void setPriceEURO(Double priceEURO) {
		this.priceEURO = priceEURO;
	}
	public Double getExchangeRateUSD_MDL() {
		return exchangeRateUSD_MDL;
	}
	public void setExchangeRateUSD_MDL(Double exchangeRateUSD_MDL) {
		this.exchangeRateUSD_MDL = exchangeRateUSD_MDL;
	}
	public Double getPriceUSD() {
		return priceUSD;
	}
	public void setPriceUSD(Double priceUSD) {
		this.priceUSD = priceUSD;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((country == null) ? 0 : country.hashCode());
		result = prime * result + ((countryCurrency == null) ? 0 : countryCurrency.hashCode());
		result = prime * result + ((currencyPrice == null) ? 0 : currencyPrice.hashCode());
		result = prime * result + ((division == null) ? 0 : division.hashCode());
		result = prime * result + ((exchangeRateCurrencyMDL == null) ? 0 : exchangeRateCurrencyMDL.hashCode());
		result = prime * result + ((exchangeRateEURO_MDL == null) ? 0 : exchangeRateEURO_MDL.hashCode());
		result = prime * result + ((exchangeRateUSD_MDL == null) ? 0 : exchangeRateUSD_MDL.hashCode());
		result = prime * result + ((priceEURO == null) ? 0 : priceEURO.hashCode());
		result = prime * result + ((priceMDL == null) ? 0 : priceMDL.hashCode());
		result = prime * result + ((priceUSD == null) ? 0 : priceUSD.hashCode());
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
		FisaDeEvaluare12 other = (FisaDeEvaluare12) obj;
		if (country == null) {
			if (other.country != null)
				return false;
		} else if (!country.equals(other.country))
			return false;
		if (countryCurrency == null) {
			if (other.countryCurrency != null)
				return false;
		} else if (!countryCurrency.equals(other.countryCurrency))
			return false;
		if (currencyPrice == null) {
			if (other.currencyPrice != null)
				return false;
		} else if (!currencyPrice.equals(other.currencyPrice))
			return false;
		if (division == null) {
			if (other.division != null)
				return false;
		} else if (!division.equals(other.division))
			return false;
		if (exchangeRateCurrencyMDL == null) {
			if (other.exchangeRateCurrencyMDL != null)
				return false;
		} else if (!exchangeRateCurrencyMDL.equals(other.exchangeRateCurrencyMDL))
			return false;
		if (exchangeRateEURO_MDL == null) {
			if (other.exchangeRateEURO_MDL != null)
				return false;
		} else if (!exchangeRateEURO_MDL.equals(other.exchangeRateEURO_MDL))
			return false;
		if (exchangeRateUSD_MDL == null) {
			if (other.exchangeRateUSD_MDL != null)
				return false;
		} else if (!exchangeRateUSD_MDL.equals(other.exchangeRateUSD_MDL))
			return false;
		if (priceEURO == null) {
			if (other.priceEURO != null)
				return false;
		} else if (!priceEURO.equals(other.priceEURO))
			return false;
		if (priceMDL == null) {
			if (other.priceMDL != null)
				return false;
		} else if (!priceMDL.equals(other.priceMDL))
			return false;
		if (priceUSD == null) {
			if (other.priceUSD != null)
				return false;
		} else if (!priceUSD.equals(other.priceUSD))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "FisaDeEvaluare12 [country=" + country + ", countryCurrency=" + countryCurrency + ", division="
				+ division + ", currencyPrice=" + currencyPrice + ", exchangeRateCurrencyMDL=" + exchangeRateCurrencyMDL
				+ ", priceMDL=" + priceMDL + ", exchangeRateEURO_MDL=" + exchangeRateEURO_MDL + ", priceEURO="
				+ priceEURO + ", exchangeRateUSD_MDL=" + exchangeRateUSD_MDL + ", priceUSD=" + priceUSD + "]";
	}
	
}
