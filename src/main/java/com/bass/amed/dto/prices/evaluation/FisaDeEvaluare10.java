package com.bass.amed.dto.prices.evaluation;

import java.util.Date;

public class FisaDeEvaluare10 {
	private Date dateOfApprovalOrder;
	private Date dateOfRevisionPrice;
	private Double priceMDL;
	private Double priceInCurrency;
	private String currency;

	public FisaDeEvaluare10() {

	}

	public FisaDeEvaluare10(Date dateOfApprovalOrder, Date dateOfRevisionPrice, Double priceMDL, Double priceInCurrency,
                            String currency) {
		this.dateOfApprovalOrder = dateOfApprovalOrder;
		this.dateOfRevisionPrice = dateOfRevisionPrice;
		this.priceMDL = priceMDL;
		this.priceInCurrency = priceInCurrency;
		this.currency = currency;
	}

	public Date getDateOfApprovalOrder() {
		return dateOfApprovalOrder;
	}

	public void setDateOfApprovalOrder(Date dateOfApprovalOrder) {
		this.dateOfApprovalOrder = dateOfApprovalOrder;
	}

	public Date getDateOfRevisionPrice() {
		return dateOfRevisionPrice;
	}

	public void setDateOfRevisionPrice(Date dateOfRevisionPrice) {
		this.dateOfRevisionPrice = dateOfRevisionPrice;
	}

	public Double getPriceMDL() {
		return priceMDL;
	}

	public void setPriceMDL(Double priceMDL) {
		this.priceMDL = priceMDL;
	}

	public Double getPriceInCurrency() {
		return priceInCurrency;
	}

	public void setPriceInCurrency(Double priceInCurrency) {
		this.priceInCurrency = priceInCurrency;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((currency == null) ? 0 : currency.hashCode());
		result = prime * result + ((dateOfApprovalOrder == null) ? 0 : dateOfApprovalOrder.hashCode());
		result = prime * result + ((dateOfRevisionPrice == null) ? 0 : dateOfRevisionPrice.hashCode());
		result = prime * result + ((priceInCurrency == null) ? 0 : priceInCurrency.hashCode());
		result = prime * result + ((priceMDL == null) ? 0 : priceMDL.hashCode());
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
		FisaDeEvaluare10 other = (FisaDeEvaluare10) obj;
		if (currency == null) {
			if (other.currency != null)
				return false;
		} else if (!currency.equals(other.currency))
			return false;
		if (dateOfApprovalOrder == null) {
			if (other.dateOfApprovalOrder != null)
				return false;
		} else if (!dateOfApprovalOrder.equals(other.dateOfApprovalOrder))
			return false;
		if (dateOfRevisionPrice == null) {
			if (other.dateOfRevisionPrice != null)
				return false;
		} else if (!dateOfRevisionPrice.equals(other.dateOfRevisionPrice))
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
		return true;
	}

	@Override
	public String toString() {
		return "FisaDeEvaluare10 [dateOfApprovalOrder=" + dateOfApprovalOrder + ", dateOfRevisionPrice="
				+ dateOfRevisionPrice + ", priceMDL=" + priceMDL + ", priceInCurrency=" + priceInCurrency
				+ ", currency=" + currency + "]";
	}

}
