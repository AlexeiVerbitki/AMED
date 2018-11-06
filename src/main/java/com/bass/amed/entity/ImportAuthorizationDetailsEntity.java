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
	@Column(name = "expiration_date", nullable = true)
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
	@Column(name = "registration_date", nullable = true)
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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof ImportAuthorizationDetailsEntity)) return false;

		ImportAuthorizationDetailsEntity that = (ImportAuthorizationDetailsEntity) o;

		if (id != null ? !id.equals(that.id) : that.id != null) return false;
		if (codeAmed != null ? !codeAmed.equals(that.codeAmed) : that.codeAmed != null) return false;
		if (pharmaceuticalForm != null ? !pharmaceuticalForm.equals(that.pharmaceuticalForm) : that.pharmaceuticalForm != null) return false;
		if (dose != null ? !dose.equals(that.dose) : that.dose != null) return false;
		if (unitsQuantityMeasurement != null ? !unitsQuantityMeasurement.equals(that.unitsQuantityMeasurement) : that.unitsQuantityMeasurement != null)
			return false;
		if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null) return false;
		if (approved != null ? !approved.equals(that.approved) : that.approved != null) return false;
		if (expirationDate != null ? !expirationDate.equals(that.expirationDate) : that.expirationDate != null) return false;
		if (summ != null ? !summ.equals(that.summ) : that.summ != null) return false;
		if (internationalMedicamentName != null ? !internationalMedicamentName.equals(
				that.internationalMedicamentName) : that.internationalMedicamentName != null) return false;
		if (atcCode != null ? !atcCode.equals(that.atcCode) : that.atcCode != null) return false;
		if (returnedAmount != null ? !returnedAmount.equals(that.returnedAmount) : that.returnedAmount != null) return false;
		if (receivedAmount != null ? !receivedAmount.equals(that.receivedAmount) : that.receivedAmount != null) return false;
		if (registrationDate != null ? !registrationDate.equals(that.registrationDate) : that.registrationDate != null) return false;
		if (registrationNumber != null ? !registrationNumber.equals(that.registrationNumber) : that.registrationNumber != null) return false;
		if (currency != null ? !currency.equals(that.currency) : that.currency != null) return false;
		if (price != null ? !price.equals(that.price) : that.price != null) return false;
		if (producer != null ? !producer.equals(that.producer) : that.producer != null) return false;
		if (customsCode != null ? !customsCode.equals(that.customsCode) : that.customsCode != null) return false;
		return name != null ? name.equals(that.name) : that.name == null;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (codeAmed != null ? codeAmed.hashCode() : 0);
		result = 31 * result + (pharmaceuticalForm != null ? pharmaceuticalForm.hashCode() : 0);
		result = 31 * result + (dose != null ? dose.hashCode() : 0);
		result = 31 * result + (unitsQuantityMeasurement != null ? unitsQuantityMeasurement.hashCode() : 0);
		result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
		result = 31 * result + (approved != null ? approved.hashCode() : 0);
		result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
		result = 31 * result + (summ != null ? summ.hashCode() : 0);
		result = 31 * result + (internationalMedicamentName != null ? internationalMedicamentName.hashCode() : 0);
		result = 31 * result + (atcCode != null ? atcCode.hashCode() : 0);
		result = 31 * result + (returnedAmount != null ? returnedAmount.hashCode() : 0);
		result = 31 * result + (receivedAmount != null ? receivedAmount.hashCode() : 0);
		result = 31 * result + (registrationDate != null ? registrationDate.hashCode() : 0);
		result = 31 * result + (registrationNumber != null ? registrationNumber.hashCode() : 0);
		result = 31 * result + (currency != null ? currency.hashCode() : 0);
		result = 31 * result + (price != null ? price.hashCode() : 0);
		result = 31 * result + (producer != null ? producer.hashCode() : 0);
		result = 31 * result + (customsCode != null ? customsCode.hashCode() : 0);
		result = 31 * result + (name != null ? name.hashCode() : 0);
		return result;
	}
}
