package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity @Table(name = "import_authorization_details", schema = "amed", catalog = "") public class ImportAuthorizationDetailsEntity {

	private Integer                             id;
	private Integer                             codeAmed;
	private NmPharmaceuticalFormsEntity         pharmaceuticalForm;
	private Double                              dose;
	private NmUnitsOfMeasurementEntity          unitsQuantityMeasurement;
	private Integer                             quantity;
	private Boolean                             approved;
	private Timestamp                           expirationDate;
	private Double                              summ;
	private NmInternationalMedicamentNameEntity internationalMedicamentName;
	private String                              atcCode;
	private Integer                             returnedAmount;
	private Integer                             receivedAmount;
	private Timestamp                           registrationDate;
	private Integer                             registrationNumber;
	private NmCurrenciesEntity                  currency;
	private Double                              price;
	private ImportAuthorizationEntity           importAuthorization;
	private NmManufacturesEntity                producer;
	private NmCustomsCodesEntity                customsCode;
	private String                              name;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	public Integer getId() { return id; }

	public void setId(Integer id) { this.id = id; }

	@Basic
	@Column(name = "codeAmed", nullable = true, length = 11)
	public Integer getCodeAmed() {
		return codeAmed;
	}

	public void setCodeAmed(Integer codeAmed) {
		this.codeAmed = codeAmed;
	}

	@Basic
	@Column(name = "name", nullable = true, length = 200)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "pharmaceutical_form_id")
	public NmPharmaceuticalFormsEntity getPharmaceuticalForm() {
		return pharmaceuticalForm;
	}

	public void setPharmaceuticalForm(NmPharmaceuticalFormsEntity pharmaceuticalForm) {
		this.pharmaceuticalForm = pharmaceuticalForm;
	}

	@Basic
	@Column(name = "dose", nullable = true, length = 11)
	public Double getDose() {
		return dose;
	}

	public void setDose(Double dose) {
		this.dose = dose;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "unit_measurement_id")
	public NmUnitsOfMeasurementEntity getUnitsQuantityMeasurement() {
		return unitsQuantityMeasurement;
	}

	public void setUnitsQuantityMeasurement(NmUnitsOfMeasurementEntity unitsQuantityMeasurement) {
		this.unitsQuantityMeasurement = unitsQuantityMeasurement;
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
	@Column(name = "approved", nullable = true)
	public Boolean getApproved() {
		return approved;
	}

	public void setApproved(Boolean approved) {
		this.approved = approved;
	}

	@Basic
	@Column(name = "expiration_date", nullable = true, length = 11)
	public Timestamp getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Timestamp expirationDate) {
		this.expirationDate = expirationDate;
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
	@JoinColumn(name = "international_name_id")
	public NmInternationalMedicamentNameEntity getInternationalMedicamentName() {
		return internationalMedicamentName;
	}

	public void setInternationalMedicamentName(NmInternationalMedicamentNameEntity internationalMedicamentName) {
		this.internationalMedicamentName = internationalMedicamentName;
	}

	@Basic
	@Column(name = "atc_code", nullable = true, length = 11)
	public String getAtcCode() {
		return atcCode;
	}

	public void setAtcCode(String atcCode) {
		this.atcCode = atcCode;
	}

	@Basic
	@Column(name = "returned_amount", nullable = true, length = 11)
	public Integer getReturnedAmount() {
		return returnedAmount;
	}

	public void setReturnedAmount(Integer returnedAmount) {
		this.returnedAmount = returnedAmount;
	}

	@Basic
	@Column(name = "received_amount", nullable = true, length = 11)
	public Integer getReceivedAmount() {
		return receivedAmount;
	}

	public void setReceivedAmount(Integer receivedAmount) {
		this.receivedAmount = receivedAmount;
	}

	@Basic
	@Column(name = "registration_date", nullable = true, length = 11)
	public Timestamp getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(Timestamp registrationDate) {
		this.registrationDate = registrationDate;
	}

	@Basic
	@Column(name = "registration_number", nullable = true, length = 11)
	public Integer getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(Integer registrationNumber) {
		this.registrationNumber = registrationNumber;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "currency_id")
	public NmCurrenciesEntity getCurrency() {
		return currency;
	}

	public void setCurrency(NmCurrenciesEntity currency) {
		this.currency = currency;
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
	@JoinColumn(name = "import_authorization_id")
	public ImportAuthorizationEntity getImportAuthorization() {
		return importAuthorization;
	}


	public void setImportAuthorization(ImportAuthorizationEntity importAuthorization) {
		this.importAuthorization = importAuthorization;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "producer_id")
	public NmManufacturesEntity getProducer() {
		return producer;
	}

	public void setProducer(NmManufacturesEntity producer) {
		this.producer = producer;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "customs_code_id")
	public NmCustomsCodesEntity getCustomsCode() {
		return customsCode;
	}

	public void setCustomsCode(NmCustomsCodesEntity customsCode) {
		this.customsCode = customsCode;
	}
}
