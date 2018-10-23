package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity @Table(name = "import_med_registered", schema = "amed", catalog = "") public class ImportMedRegisteredEntity {

	private Integer                             id;
	private Integer                             code;
	private String                              name;
	private NmPharmaceuticalFormsEntity         pharmaceuticalForm;
	private Double                              dose;
	private NmUnitsOfMeasurementEntity          unitsQuantityMeasurement;
	private Integer                             registrationNumber;
	private Timestamp                           registrationDate;
	private String                              atcCode;
	private NmInternationalMedicamentNameEntity internationalMedicamentName;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	public int getId() { return id; }

	public void setId(int id) { this.id = id; }

	@Basic
	@Column(name = "code", nullable = true, length = 11)
	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
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
	@Column(name = "registration_number", nullable = true, length = 11)
	public Integer getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(Integer registrationNumber) {
		this.registrationNumber = registrationNumber;
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
	@Column(name = "atc_code", nullable = true, length = 11)
	public String getAtcCode() {
		return atcCode;
	}

	public void setAtcCode(String atcCode) {
		this.atcCode = atcCode;
	}

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@JoinColumn(name = "international_name_id")
	public NmInternationalMedicamentNameEntity getInternationalMedicamentName() {
		return internationalMedicamentName;
	}

	public void setInternationalMedicamentName(NmInternationalMedicamentNameEntity internationalMedicamentName) {
		this.internationalMedicamentName = internationalMedicamentName;
	}
}
