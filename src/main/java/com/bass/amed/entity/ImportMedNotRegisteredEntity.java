package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "import_med_not_registered", schema = "amed", catalog = "")
public class ImportMedNotRegisteredEntity {

	private Integer                             id;
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
	public Integer getId() { return id; }

	public void setId(Integer id) { this.id = id; }


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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof ImportMedNotRegisteredEntity)) return false;

		ImportMedNotRegisteredEntity that = (ImportMedNotRegisteredEntity) o;

		if (id != null ? !id.equals(that.id) : that.id != null) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (pharmaceuticalForm != null ? !pharmaceuticalForm.equals(that.pharmaceuticalForm) : that.pharmaceuticalForm != null) return false;
		if (dose != null ? !dose.equals(that.dose) : that.dose != null) return false;
		if (unitsQuantityMeasurement != null ? !unitsQuantityMeasurement.equals(that.unitsQuantityMeasurement) : that.unitsQuantityMeasurement != null)
			return false;
		if (registrationNumber != null ? !registrationNumber.equals(that.registrationNumber) : that.registrationNumber != null) return false;
		if (registrationDate != null ? !registrationDate.equals(that.registrationDate) : that.registrationDate != null) return false;
		if (atcCode != null ? !atcCode.equals(that.atcCode) : that.atcCode != null) return false;
		return internationalMedicamentName != null ? internationalMedicamentName.equals(
				that.internationalMedicamentName) : that.internationalMedicamentName == null;
	}

	@Override
	public int hashCode() {
		int result = id != null ? id.hashCode() : 0;
		result = 31 * result + (name != null ? name.hashCode() : 0);
		result = 31 * result + (pharmaceuticalForm != null ? pharmaceuticalForm.hashCode() : 0);
		result = 31 * result + (dose != null ? dose.hashCode() : 0);
		result = 31 * result + (unitsQuantityMeasurement != null ? unitsQuantityMeasurement.hashCode() : 0);
		result = 31 * result + (registrationNumber != null ? registrationNumber.hashCode() : 0);
		result = 31 * result + (registrationDate != null ? registrationDate.hashCode() : 0);
		result = 31 * result + (atcCode != null ? atcCode.hashCode() : 0);
		result = 31 * result + (internationalMedicamentName != null ? internationalMedicamentName.hashCode() : 0);
		return result;
	}
}
