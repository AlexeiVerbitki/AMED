package com.bass.amed.dto.evaluation;

public class FisaDeEvaluare11 {
	private String originCountry;
	private String currencyOfOriginCountry;
	private String division;
	private Double price;
	private Double exchangeRateOriginCurrencyMDL;
	private Double priceMDL;
	private Double exchangeRateEURO_MDL;
	private Double priceEURO;
	private Double exchangeRateUSD_MDL;
	private Double priceUSD;

	public FisaDeEvaluare11() {
	}

	public FisaDeEvaluare11(String originCountry, String currencyOfOriginCountry, String division, Double price,
			Double exchangeRateOriginCurrencyMDL, Double priceMDL, Double exchangeRateEURO_MDL, Double priceEURO,
			Double exchangeRateUSD_MDL, Double priceUSD) {
		this.originCountry = originCountry;
		this.currencyOfOriginCountry = currencyOfOriginCountry;
		this.division = division;
		this.price = price;
		this.exchangeRateOriginCurrencyMDL = exchangeRateOriginCurrencyMDL;
		this.priceMDL = priceMDL;
		this.exchangeRateEURO_MDL = exchangeRateEURO_MDL;
		this.priceEURO = priceEURO;
		this.exchangeRateUSD_MDL = exchangeRateUSD_MDL;
		this.priceUSD = priceUSD;
	}

	public String getOriginCountry() {
		return originCountry;
	}

	public void setOriginCountry(String originCountry) {
		this.originCountry = originCountry;
	}

	public String getCurrencyOfOriginCountry() {
		return currencyOfOriginCountry;
	}

	public void setCurrencyOfOriginCountry(String currencyOfOriginCountry) {
		this.currencyOfOriginCountry = currencyOfOriginCountry;
	}

	public String getDivision() {
		return division;
	}

	public void setDivision(String division) {
		this.division = division;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getExchangeRateOriginCurrencyMDL() {
		return exchangeRateOriginCurrencyMDL;
	}

	public void setExchangeRateOriginCurrencyMDL(Double exchangeRateOriginCurrencyMDL) {
		this.exchangeRateOriginCurrencyMDL = exchangeRateOriginCurrencyMDL;
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

	public void setPriceEURO(Double priceEuro) {
		this.priceEURO = priceEuro;
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
		result = prime * result + ((currencyOfOriginCountry == null) ? 0 : currencyOfOriginCountry.hashCode());
		result = prime * result + ((division == null) ? 0 : division.hashCode());
		result = prime * result + ((exchangeRateEURO_MDL == null) ? 0 : exchangeRateEURO_MDL.hashCode());
		result = prime * result
				+ ((exchangeRateOriginCurrencyMDL == null) ? 0 : exchangeRateOriginCurrencyMDL.hashCode());
		result = prime * result + ((exchangeRateUSD_MDL == null) ? 0 : exchangeRateUSD_MDL.hashCode());
		result = prime * result + ((originCountry == null) ? 0 : originCountry.hashCode());
		result = prime * result + ((price == null) ? 0 : price.hashCode());
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
		FisaDeEvaluare11 other = (FisaDeEvaluare11) obj;
		if (currencyOfOriginCountry == null) {
			if (other.currencyOfOriginCountry != null)
				return false;
		} else if (!currencyOfOriginCountry.equals(other.currencyOfOriginCountry))
			return false;
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
		if (exchangeRateOriginCurrencyMDL == null) {
			if (other.exchangeRateOriginCurrencyMDL != null)
				return false;
		} else if (!exchangeRateOriginCurrencyMDL.equals(other.exchangeRateOriginCurrencyMDL))
			return false;
		if (exchangeRateUSD_MDL == null) {
			if (other.exchangeRateUSD_MDL != null)
				return false;
		} else if (!exchangeRateUSD_MDL.equals(other.exchangeRateUSD_MDL))
			return false;
		if (originCountry == null) {
			if (other.originCountry != null)
				return false;
		} else if (!originCountry.equals(other.originCountry))
			return false;
		if (price == null) {
			if (other.price != null)
				return false;
		} else if (!price.equals(other.price))
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
		return "FisaDeEvaluare11 [originCountry=" + originCountry + ", currencyOfOriginCountry="
				+ currencyOfOriginCountry + ", division=" + division + ", price=" + price
				+ ", exchangeRateOriginCurrencyMDL=" + exchangeRateOriginCurrencyMDL + ", priceMDL=" + priceMDL
				+ ", exchangeRateEURO_MDL=" + exchangeRateEURO_MDL + ", priceEURO=" + priceEURO + ", exchangeRateUSD_MDL="
				+ exchangeRateUSD_MDL + ", priceUSD=" + priceUSD + "]";
	}

}
