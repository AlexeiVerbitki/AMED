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
	private Integer                             medType;
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


}
