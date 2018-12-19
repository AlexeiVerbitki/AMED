package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity @Table(name = "import_authorization", schema = "amed", catalog = "") public class ImportAuthorizationEntity {
	private Integer                                id;
	private String                                 applicationRegistrationNumber;
	private Timestamp                              applicationDate;
	private NmEconomicAgentsEntity                 applicant;
	private NmManufacturesEntity                   seller;
	private String                                 basisForImport;
	private NmEconomicAgentsEntity                 importer;
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
	private Set<ImportAuthorizationDetailsEntity>  importAuthorizationDetailsEntityList;
	private Boolean                                authorized;
	private String                                 contract;
	private Timestamp                              contractDate;
	private String                                 anexa;
	private Timestamp                              anexaDate;
	private String                                 specification;
	private Timestamp                              SpecificationDate;


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
	@Column(name = "authorized", nullable = true, length = 200)
	public Boolean getauthorized() {
		return authorized;
	}

	public void setauthorized(Boolean authorized) {
		this.authorized = authorized;
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
	public NmEconomicAgentsEntity getImporter() {
		return importer;
	}

	public void setImporter(NmEconomicAgentsEntity importer) {
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

	@Basic
	@Column(name = "customs_declarations_nr", nullable = true, length = 10)
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

	@OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
	@JoinColumn(name = "import_authorization_id")
	public Set<ImportAuthorizationDetailsEntity> getImportAuthorizationDetailsEntityList() {
		return importAuthorizationDetailsEntityList;
	}

	public void setImportAuthorizationDetailsEntityList(Set<ImportAuthorizationDetailsEntity> importAuthorizationDetailsEntityList) {
		this.importAuthorizationDetailsEntityList = importAuthorizationDetailsEntityList;
	}

	@Basic
	@Column(name = "contract_number", nullable = true)
	public String getContract() {
		return contract;
	}

	public void setContract(String contract) {
		this.contract = contract;
	}
	@Basic
	@Column(name = "contract_date", nullable = true)
	public Timestamp getContractDate() {
		return contractDate;
	}

	public void setContractDate(Timestamp contractDate) {
		this.contractDate = contractDate;
	}
	@Basic
	@Column(name = "contract_annex_number", nullable = true)
	public String getAnexa() {
		return anexa;
	}

	public void setAnexa(String anexa) {
		this.anexa = anexa;
	}
	@Basic
	@Column(name = "contract_annex_date", nullable = true)
	public Timestamp getAnexaDate() {
		return anexaDate;
	}

	public void setAnexaDate(Timestamp anexaDate) {
		this.anexaDate = anexaDate;
	}
	@Basic
	@Column(name = "specification_number", nullable = true)
	public String getSpecification() {
		return specification;
	}

	public void setSpecification(String specification) {
		this.specification = specification;
	}

	@Basic
	@Column(name = "specification_date", nullable = true)
	public Timestamp getSpecificationDate() {
		return SpecificationDate;
	}

	public void setSpecificationDate(Timestamp specificationDate) {
		SpecificationDate = specificationDate;
	}

//	@Basic
//	@Column(name = "customs_code", nullable = true)
//	public NmCustomsCodesEntity getCustomsCode() { return customsCode; }
//
//	public void setCustomsCode(NmCustomsCodesEntity customsCode) { this.customsCode = customsCode; }
//
//	public Boolean getAuthorized() { return authorized; }
//
//	public void setAuthorized(Boolean authorized) { this.authorized = authorized; }

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof ImportAuthorizationEntity)) return false;

		ImportAuthorizationEntity that = (ImportAuthorizationEntity) o;

		if (id != null ? !id.equals(that.id) : that.id != null) return false;
		if (applicationRegistrationNumber != null ? !applicationRegistrationNumber.equals(
				that.applicationRegistrationNumber) : that.applicationRegistrationNumber != null) return false;
		if (applicationDate != null ? !applicationDate.equals(that.applicationDate) : that.applicationDate != null) return false;
		if (applicant != null ? !applicant.equals(that.applicant) : that.applicant != null) return false;
		if (seller != null ? !seller.equals(that.seller) : that.seller != null) return false;
		if (basisForImport != null ? !basisForImport.equals(that.basisForImport) : that.basisForImport != null) return false;
		if (importer != null ? !importer.equals(that.importer) : that.importer != null) return false;
		if (conditionsAndSpecification != null ? !conditionsAndSpecification.equals(that.conditionsAndSpecification) : that.conditionsAndSpecification != null)
			return false;
		if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null) return false;
		if (price != null ? !price.equals(that.price) : that.price != null) return false;
		if (currency != null ? !currency.equals(that.currency) : that.currency != null) return false;
		if (summ != null ? !summ.equals(that.summ) : that.summ != null) return false;
		if (producer != null ? !producer.equals(that.producer) : that.producer != null) return false;
		if (customsDeclarationDate != null ? !customsDeclarationDate.equals(that.customsDeclarationDate) : that.customsDeclarationDate != null) return false;
		if (expirationDate != null ? !expirationDate.equals(that.expirationDate) : that.expirationDate != null) return false;
		if (customsCode != null ? !customsCode.equals(that.customsCode) : that.customsCode != null) return false;
		if (customsNumber != null ? !customsNumber.equals(that.customsNumber) : that.customsNumber != null) return false;
		if (customsTransactionType != null ? !customsTransactionType.equals(that.customsTransactionType) : that.customsTransactionType != null) return false;
		if (authorizationsNumber != null ? !authorizationsNumber.equals(that.authorizationsNumber) : that.authorizationsNumber != null) return false;
		if (medType != null ? !medType.equals(that.medType) : that.medType != null) return false;
		if (importAuthorizationDetailsEntityList != null ? !importAuthorizationDetailsEntityList.equals(
				that.importAuthorizationDetailsEntityList) : that.importAuthorizationDetailsEntityList != null) return false;
		if (authorized != null ? !authorized.equals(that.authorized) : that.authorized != null) return false;
		if (contract != null ? !contract.equals(that.contract) : that.contract != null) return false;
		if (contractDate != null ? !contractDate.equals(that.contractDate) : that.contractDate != null) return false;
		if (anexa != null ? !anexa.equals(that.anexa) : that.anexa != null) return false;
		if (anexaDate != null ? !anexaDate.equals(that.anexaDate) : that.anexaDate != null) return false;
		if (specification != null ? !specification.equals(that.specification) : that.specification != null) return false;
		return SpecificationDate != null ? SpecificationDate.equals(that.SpecificationDate) : that.SpecificationDate == null;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (applicationRegistrationNumber != null ? applicationRegistrationNumber.hashCode() : 0);
		result = 31 * result + (applicationDate != null ? applicationDate.hashCode() : 0);
		result = 31 * result + (applicant != null ? applicant.hashCode() : 0);
		result = 31 * result + (seller != null ? seller.hashCode() : 0);
		result = 31 * result + (basisForImport != null ? basisForImport.hashCode() : 0);
		result = 31 * result + (importer != null ? importer.hashCode() : 0);
		result = 31 * result + (conditionsAndSpecification != null ? conditionsAndSpecification.hashCode() : 0);
		result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
		result = 31 * result + (price != null ? price.hashCode() : 0);
		result = 31 * result + (currency != null ? currency.hashCode() : 0);
		result = 31 * result + (summ != null ? summ.hashCode() : 0);
		result = 31 * result + (producer != null ? producer.hashCode() : 0);
		result = 31 * result + (customsDeclarationDate != null ? customsDeclarationDate.hashCode() : 0);
		result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
		result = 31 * result + (customsCode != null ? customsCode.hashCode() : 0);
		result = 31 * result + (customsNumber != null ? customsNumber.hashCode() : 0);
		result = 31 * result + (customsTransactionType != null ? customsTransactionType.hashCode() : 0);
		result = 31 * result + (authorizationsNumber != null ? authorizationsNumber.hashCode() : 0);
		result = 31 * result + (medType != null ? medType.hashCode() : 0);
		result = 31 * result + (importAuthorizationDetailsEntityList != null ? importAuthorizationDetailsEntityList.hashCode() : 0);
		result = 31 * result + (authorized != null ? authorized.hashCode() : 0);
		result = 31 * result + (contract != null ? contract.hashCode() : 0);
		result = 31 * result + (contractDate != null ? contractDate.hashCode() : 0);
		result = 31 * result + (anexa != null ? anexa.hashCode() : 0);
		result = 31 * result + (anexaDate != null ? anexaDate.hashCode() : 0);
		result = 31 * result + (specification != null ? specification.hashCode() : 0);
		result = 31 * result + (SpecificationDate != null ? SpecificationDate.hashCode() : 0);
		return result;
	}
}
