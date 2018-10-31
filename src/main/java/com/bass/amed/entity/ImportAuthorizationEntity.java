package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity @Table(name = "import_authorization", schema = "amed", catalog = "") public class ImportAuthorizationEntity {
	private Integer                                id;
	private String                                 applicationRegistrationNumber;
	private Timestamp                              applicationDate;
	private Integer                                applicant;
	private NmManufacturesEntity                   seller;
	private String                                 basisForImport;
	private Integer                                importerId;
	private String                                 conditionsAndSpecification;
	private Integer                                quantity;
	private Double                                 price;
	private NmCurrenciesEntity                     currency;
	private Double                                 summ;
	private NmManufacturesEntity                   producer;
	private Timestamp                              customsDeclarationDate;
	private Timestamp                              expirationDate;
	private NmCustomsCodesEntity                   customsCode;
	private Integer                                customsNumber;
	private NmTypesOfCustomsTransactionsEntity     customsTransactionType;
	private String                                 authorizationsNumber;
	private Integer                                medType;
	private List<ImportAuthorizationDetailsEntity> importAuthorizationDetailsEntityList;


	@Id
	@Column(name = "id")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getApplicationRegistrationNumber() {
		return applicationRegistrationNumber;
	}

	public void setApplicationRegistrationNumber(String applicationRegistrationNumber) {
		this.applicationRegistrationNumber = applicationRegistrationNumber;
	}

	public Timestamp getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(Timestamp applicationDate) {
		this.applicationDate = applicationDate;
	}

	public Integer getApplicant() {
		return applicant;
	}

	public void setApplicant(Integer applicant) {
		this.applicant = applicant;
	}

	public NmManufacturesEntity getSeller() {
		return seller;
	}

	public void setSeller(NmManufacturesEntity seller) {
		this.seller = seller;
	}

	public String getBasisForImport() {
		return basisForImport;
	}

	public void setBasisForImport(String basisForImport) {
		this.basisForImport = basisForImport;
	}

	public Integer getImporterId() {
		return importerId;
	}

	public void setImporterId(Integer importerId) {
		this.importerId = importerId;
	}

	public String getConditionsAndSpecification() {
		return conditionsAndSpecification;
	}

	public void setConditionsAndSpecification(String conditionsAndSpecification) {
		this.conditionsAndSpecification = conditionsAndSpecification;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public NmCurrenciesEntity getCurrency() {
		return currency;
	}

	public void setCurrency(NmCurrenciesEntity currency) {
		this.currency = currency;
	}

	public Double getSumm() {
		return summ;
	}

	public void setSumm(Double summ) {
		this.summ = summ;
	}

	public NmManufacturesEntity getProducer() {
		return producer;
	}

	public void setProducer(NmManufacturesEntity producer) {
		this.producer = producer;
	}

	public Timestamp getCustomsDeclarationDate() {
		return customsDeclarationDate;
	}

	public void setCustomsDeclarationDate(Timestamp customsDeclarationDate) {
		this.customsDeclarationDate = customsDeclarationDate;
	}

	public Timestamp getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Timestamp expirationDate) {
		this.expirationDate = expirationDate;
	}

	public NmCustomsCodesEntity getCustomsCode() {
		return customsCode;
	}

	public void setCustomsCode(NmCustomsCodesEntity customsCode) {
		this.customsCode = customsCode;
	}

	public Integer getCustomsNumber() {
		return customsNumber;
	}

	public void setCustomsNumber(Integer customsNumber) {
		this.customsNumber = customsNumber;
	}

	public NmTypesOfCustomsTransactionsEntity getCustomsTransactionType() {
		return customsTransactionType;
	}

	public void setCustomsTransactionType(NmTypesOfCustomsTransactionsEntity customsTransactionType) {
		this.customsTransactionType = customsTransactionType;
	}

	public String getAuthorizationsNumber() {
		return authorizationsNumber;
	}

	public void setAuthorizationsNumber(String authorizationsNumber) {
		this.authorizationsNumber = authorizationsNumber;
	}

	public Integer getMedType() {
		return medType;
	}

	public void setMedType(Integer medType) {
		this.medType = medType;
	}

	public List<ImportAuthorizationDetailsEntity> getImportAuthorizationDetailsEntityList() {
		return importAuthorizationDetailsEntityList;
	}

	public void setImportAuthorizationDetailsEntityList(List<ImportAuthorizationDetailsEntity> importAuthorizationDetailsEntityList) {
		this.importAuthorizationDetailsEntityList = importAuthorizationDetailsEntityList;
	}
}
