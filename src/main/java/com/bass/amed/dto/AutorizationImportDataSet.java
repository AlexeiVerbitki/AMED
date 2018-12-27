package com.bass.amed.dto;

public class AutorizationImportDataSet {
	String custom;
	String customCode;
	String transactionType;
	String currencyPpayment;
	Double price;

	public String getCustom() {
		return custom;
	}

	public void setCustom(String custom) {
		this.custom = custom;
	}

	public String getCustomCode() {
		return customCode;
	}

	public void setCustomCode(String customCode) {
		this.customCode = customCode;
	}

	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}

	public String getCurrencyPpayment() {
		return currencyPpayment;
	}

	public void setCurrencyPpayment(String currencyPpayment) {
		this.currencyPpayment = currencyPpayment;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}


}