package com.bass.amed.dto.evaluation;

public class FisaDeEvaluare8 {
	private String referenceCountry;
	private String referenceCountryCurrency;
	private String division;
	private Double priceInCurrency;
	private Double exchangeRateReferenceCurrencyMDL;
	private Double priceMDL;
	private Double exchangeRateEURO_MDL;
	private Double priceEURO;
	private Double exchangeRateUSD_MDL;
	private Double priceUSD;

	public FisaDeEvaluare8() {
		
	}

	public FisaDeEvaluare8(String referenceCountry, String referenceCountryCurrency, String division,
			Double priceInCurrency, Double exchangeRateReferenceCurrencyMDL, Double priceMDL,
			Double exchangeRateEURO_MDL, Double priceEURO, Double exchangeRateUSD_MDL, Double priceUSD) {
		this.referenceCountry = referenceCountry;
		this.referenceCountryCurrency = referenceCountryCurrency;
		this.division = division;
		this.priceInCurrency = priceInCurrency;
		this.exchangeRateReferenceCurrencyMDL = exchangeRateReferenceCurrencyMDL;
		this.priceMDL = priceMDL;
		this.exchangeRateEURO_MDL = exchangeRateEURO_MDL;
		this.priceEURO = priceEURO;
		this.exchangeRateUSD_MDL = exchangeRateUSD_MDL;
		this.priceUSD = priceUSD;
	}

	public String getReferenceCountry() {
		return referenceCountry;
	}

	public void setReferenceCountry(String referenceCountry) {
		this.referenceCountry = referenceCountry;
	}

	public String getReferenceCountryCurrency() {
		return referenceCountryCurrency;
	}

	public void setReferenceCountryCurrency(String referenceCountryCurrency) {
		this.referenceCountryCurrency = referenceCountryCurrency;
	}

	public String getDivision() {
		return division;
	}

	public void setDivision(String division) {
		this.division = division;
	}

	public Double getPriceInCurrency() {
		return priceInCurrency;
	}

	public void setPriceInCurrency(Double priceInCurrency) {
		this.priceInCurrency = priceInCurrency;
	}

	public Double getExchangeRateReferenceCurrencyMDL() {
		return exchangeRateReferenceCurrencyMDL;
	}

	public void setExchangeRateReferenceCurrencyMDL(Double exchangeRateReferenceCurrencyMDL) {
		this.exchangeRateReferenceCurrencyMDL = exchangeRateReferenceCurrencyMDL;
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
		result = prime * result + ((division == null) ? 0 : division.hashCode());
		result = prime * result + ((exchangeRateEURO_MDL == null) ? 0 : exchangeRateEURO_MDL.hashCode());
		result = prime * result
				+ ((exchangeRateReferenceCurrencyMDL == null) ? 0 : exchangeRateReferenceCurrencyMDL.hashCode());
		result = prime * result + ((exchangeRateUSD_MDL == null) ? 0 : exchangeRateUSD_MDL.hashCode());
		result = prime * result + ((priceEURO == null) ? 0 : priceEURO.hashCode());
		result = prime * result + ((priceInCurrency == null) ? 0 : priceInCurrency.hashCode());
		result = prime * result + ((priceMDL == null) ? 0 : priceMDL.hashCode());
		result = prime * result + ((priceUSD == null) ? 0 : priceUSD.hashCode());
		result = prime * result + ((referenceCountry == null) ? 0 : referenceCountry.hashCode());
		result = prime * result + ((referenceCountryCurrency == null) ? 0 : referenceCountryCurrency.hashCode());
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
		FisaDeEvaluare8 other = (FisaDeEvaluare8) obj;
		if (division == null) {
			if (other.division != null)
				return false;
		} else if (!division.equals(other.division))
			return false;
		if (exchangeRateEURO_MDL == null) {
			if (other.exchangeRateEURO_MDL != null)
				return false;
		} else if (!exchangeRateEURO_MDL.equals(other.exchangeRateEURO_MDL))
			return false;
		if (exchangeRateReferenceCurrencyMDL == null) {
			if (other.exchangeRateReferenceCurrencyMDL != null)
				return false;
		} else if (!exchangeRateReferenceCurrencyMDL.equals(other.exchangeRateReferenceCurrencyMDL))
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
		if (priceInCurrency == null) {
			if (other.priceInCurrency != null)
				return false;
		} else if (!priceInCurrency.equals(other.priceInCurrency))
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
		if (referenceCountry == null) {
			if (other.referenceCountry != null)
				return false;
		} else if (!referenceCountry.equals(other.referenceCountry))
			return false;
		if (referenceCountryCurrency == null) {
			if (other.referenceCountryCurrency != null)
				return false;
		} else if (!referenceCountryCurrency.equals(other.referenceCountryCurrency))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "FisaDeEvaluare8 [referenceCountry=" + referenceCountry + ", referenceCountryCurrency="
				+ referenceCountryCurrency + ", division=" + division + ", priceInCurrency=" + priceInCurrency
				+ ", exchangeRateReferenceCurrencyMDL=" + exchangeRateReferenceCurrencyMDL + ", priceMDL=" + priceMDL
				+ ", exchangeRateEURO_MDL=" + exchangeRateEURO_MDL + ", priceEURO=" + priceEURO
				+ ", exchangeRateUSD_MDL=" + exchangeRateUSD_MDL + ", priceUSD=" + priceUSD + "]";
	}

}
