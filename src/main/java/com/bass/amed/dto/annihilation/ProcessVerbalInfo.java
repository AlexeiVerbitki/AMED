package com.bass.amed.dto.annihilation;

public class ProcessVerbalInfo {
	private String companyName;
	private String name;
	private String doza;
	private String forma;
	private String seria;
	private String quantity;
	private Double taxNim;
	private String date;
	private String docNr;
	private String methodAnnihilation;
	private String notes;
	private String futilityCause;

	public ProcessVerbalInfo() {
		// TODO Auto-generated constructor stub
	}

	public ProcessVerbalInfo(String companyName, String name, String doza, String forma, String seria, String quantity,
			String methodAnnihilation, String futilityCause) {
		super();
		this.companyName = companyName;
		this.name = name;
		this.doza = doza;
		this.forma = forma;
		this.seria = seria;
		this.quantity = quantity;
		this.methodAnnihilation = methodAnnihilation;
		this.futilityCause = futilityCause;
	}



	public ProcessVerbalInfo(String companyName, String name, String doza, String forma, String seria, String quantity, Double taxNim, String date,
			String docNr, String methodAnnihilation, String notes) {
		this.companyName = companyName;
		this.name = name;
		this.doza = doza;
		this.forma = forma;
		this.seria = seria;
		this.quantity = quantity;
		this.taxNim = taxNim;
		this.date = date;
		this.docNr = docNr;
		this.methodAnnihilation = methodAnnihilation;
		this.notes = notes;
	}
	
	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDoza() {
		return doza;
	}

	public void setDoza(String doza) {
		this.doza = doza;
	}

	public String getSeria() {
		return seria;
	}

	public void setSeria(String seria) {
		this.seria = seria;
	}

	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}

	public Double getTaxNim() {
		return taxNim;
	}

	public void setTaxNim(Double taxNim) {
		this.taxNim = taxNim;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getDocNr() {
		return docNr;
	}

	public void setDocNr(String docNr) {
		this.docNr = docNr;
	}

	public String getMethodAnnihilation() {
		return methodAnnihilation;
	}

	public void setMethodAnnihilation(String methodAnnihilation) {
		this.methodAnnihilation = methodAnnihilation;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getForma() {
		return forma;
	}

	public void setForma(String forma) {
		this.forma = forma;
	}

	public String getFutilityCause() {
		return futilityCause;
	}

	public void setFutilityCause(String futilityCause) {
		this.futilityCause = futilityCause;
	}

}
