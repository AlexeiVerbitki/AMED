package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity @Table(name = "import_authorization", schema = "amed", catalog = "") public class ImportAuthorizationEntity {
	private Integer                                id;
	private String                                 applicationRegistrationNumber;
	private Timestamp                              applicationDate;
	private NmEconomicAgentsEntity                 applicant;
	private NmManufacturesEntity                   seller;
	private String                                 basisForImport;
	private NmManufacturesEntity                   importer;
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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Basic
	@Column(name = "authorization_number", nullable = true, length = 200)
	public String getAuthorizationsNumber() {
		return authorizationsNumber;
	}

	public void setAuthorizationsNumber(String authorizationsNumber) {
		this.authorizationsNumber = authorizationsNumber;
	}

	@Basic
	@Column(name = "application_registration_number", nullable = true, length = 200)
	public String getApplicationRegistrationNumber() {
		return applicationRegistrationNumber;
	}

	public void setApplicationRegistrationNumber(String applicationRegistrationNumber) {
		this.applicationRegistrationNumber = applicationRegistrationNumber;
	}

	@Basic
	@Column(name = "application_date", nullable = true, length = 11)
	public Timestamp getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(Timestamp applicationDate) {
		this.applicationDate = applicationDate;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "applicant")
	public NmEconomicAgentsEntity getApplicant() {
		return applicant;
	}

	public void setApplicant(NmEconomicAgentsEntity applicant) {
		this.applicant = applicant;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "seller_id")
	public NmManufacturesEntity getSeller() {
		return seller;
	}

	public void setSeller(NmManufacturesEntity seller) {
		this.seller = seller;
	}

	@Basic
	@Column(name = "basis_for_import", nullable = true, length = 200)
	public String getBasisForImport() {
		return basisForImport;
	}

	public void setBasisForImport(String basisForImport) {
		this.basisForImport = basisForImport;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "importer_id")
	public NmManufacturesEntity getImporter() {
		return importer;
	}

	public void setImporter(NmManufacturesEntity importer) {
		this.importer = importer;
	}

	@Basic
	@Column(name = "conditions_and_specifications", nullable = true, length = 200)
	public String getConditionsAndSpecification() {
		return conditionsAndSpecification;
	}

	public void setConditionsAndSpecification(String conditionsAndSpecification) {
		this.conditionsAndSpecification = conditionsAndSpecification;
	}

	@Basic
	@Column(name = "quantity", nullable = true, length = 11)
	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	@Basic
	@Column(name = "price", nullable = true, length = 11)
	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "currency")
	public NmCurrenciesEntity getCurrency() {
		return currency;
	}

	public void setCurrency(NmCurrenciesEntity currency) {
		this.currency = currency;
	}

	@Basic
	@Column(name = "summ", nullable = true, length = 11)
	public Double getSumm() {
		return summ;
	}

	public void setSumm(Double summ) {
		this.summ = summ;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "producer_id")
	public NmManufacturesEntity getProducer() {
		return producer;
	}

	public void setProducer(NmManufacturesEntity producer) {
		this.producer = producer;
	}

	@Basic
	@Column(name = "customs_declaration_date", nullable = true)
	public Timestamp getCustomsDeclarationDate() {
		return customsDeclarationDate;
	}

	public void setCustomsDeclarationDate(Timestamp customsDeclarationDate) {
		this.customsDeclarationDate = customsDeclarationDate;
	}

	@Basic
	@Column(name = "expiration_date", nullable = true)
	public Timestamp getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Timestamp expirationDate) {
		this.expirationDate = expirationDate;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "customs_code_id")
	public NmCustomsCodesEntity getCustomsCode() {
		return customsCode;
	}

	public void setCustomsCode(NmCustomsCodesEntity customsCode) {
		this.customsCode = customsCode;
	}

	@Basic
	@Column(name = "customs_declaration_nr", nullable = true, length = 10)
	public Integer getCustomsNumber() {
		return customsNumber;
	}

	public void setCustomsNumber(Integer customsNumber) {
		this.customsNumber = customsNumber;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "customs_transaction_type_id")
	public NmTypesOfCustomsTransactionsEntity getCustomsTransactionType() {
		return customsTransactionType;
	}

	public void setCustomsTransactionType(NmTypesOfCustomsTransactionsEntity customsTransactionType) {
		this.customsTransactionType = customsTransactionType;
	}

	@Basic
	@Column(name = "med_type", nullable = true, length = 11)
	public Integer getMedType() {
		return medType;
	}

	public void setMedType(Integer medType) {
		this.medType = medType;
	}

	@OneToOne
	public List<ImportAuthorizationDetailsEntity> getImportAuthorizationDetailsEntityList() {
		return importAuthorizationDetailsEntityList;
	}

	public void setImportAuthorizationDetailsEntityList(List<ImportAuthorizationDetailsEntity> importAuthorizationDetailsEntityList) {
		this.importAuthorizationDetailsEntityList = importAuthorizationDetailsEntityList;
	}
}
