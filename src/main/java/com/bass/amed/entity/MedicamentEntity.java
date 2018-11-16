package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "medicament", schema = "amed", catalog = "")
public class MedicamentEntity
{
    private Integer id;
    private String name;
    private String code;
    private String productCode;
    private String customsCode;
    private String barcode;
    private NmInternationalMedicamentNameEntity internationalMedicamentName;
    private Integer countryId;
    private Set<MedicamentManufactureEntity> manufactures;
    private Integer registrationNumber;
    private Timestamp registrationDate;
    private Date expirationDate;
    private String dose;
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;
    private NmManufacturesEntity authorizationHolder;
    private NmMedicamentTypeEntity medicamentType;
    private NmMedicamentGroupEntity group;
    private Byte prescription;
    private String serialNr;
    private String primarePackage;
    private String administeringMode;
    private String status;
    private String volume;
    private NmUnitsOfMeasurementEntity volumeQuantityMeasurement;
    private Integer termsOfValidity;
    private Set<MedicamentActiveSubstancesEntity> activeSubstances = new HashSet<>();
    private Set<MedicamentHistoryEntity> medicamentHistory;
    private MedicamentExpertsEntity experts;
    private String atcCode;
    private String division;
        private Integer requestId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "name", nullable = false, length = 100)
    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    @Basic
    @Column(name = "atc_code")
    public String getAtcCode()
    {
        return atcCode;
    }

    public void setAtcCode(String atcCode)
    {
        this.atcCode = atcCode;
    }

    @Basic
    @Column(name = "code", nullable = true, length = 10)
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "product_code", nullable = true, length = 10)
    public String getProductCode()
    {
        return productCode;
    }

    public void setProductCode(String productCode)
    {
        this.productCode = productCode;
    }

    @Basic
    @Column(name = "customs_code", nullable = true, length = 5)
    public String getCustomsCode()
    {
        return customsCode;
    }

    public void setCustomsCode(String customsCode)
    {
        this.customsCode = customsCode;
    }

    @Basic
    @Column(name = "barcode", nullable = true, length = 15)
    public String getBarcode()
    {
        return barcode;
    }

    public void setBarcode(String barcode)
    {
        this.barcode = barcode;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "international_name_id")
    public NmInternationalMedicamentNameEntity getInternationalMedicamentName()
    {
        return internationalMedicamentName;
    }

    public void setInternationalMedicamentName(NmInternationalMedicamentNameEntity internationalMedicamentName)
    {
        this.internationalMedicamentName = internationalMedicamentName;
    }

    @Basic
    @Column(name = "country_id")
    public Integer getCountryId()
    {
        return countryId;
    }

    public void setCountryId(Integer countryId)
    {
        this.countryId = countryId;
    }

    @Basic
    @Column(name = "registration_number", nullable = true)
    public Integer getRegistrationNumber()
    {
        return registrationNumber;
    }

    public void setRegistrationNumber(Integer registrationNumber)
    {
        this.registrationNumber = registrationNumber;
    }

    @Basic
    @Column(name = "registration_date", nullable = true)
    public Timestamp getRegistrationDate()
    {
        return registrationDate;
    }

    public void setRegistrationDate(Timestamp registrationDate)
    {
        this.registrationDate = registrationDate;
    }

    @Basic
    @Column(name = "expiration_date", nullable = true)
    public Date getExpirationDate()
    {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate)
    {
        this.expirationDate = expirationDate;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "pharmaceutical_form_id")
    public NmPharmaceuticalFormsEntity getPharmaceuticalForm()
    {
        return pharmaceuticalForm;
    }

    public void setPharmaceuticalForm(NmPharmaceuticalFormsEntity pharmaceuticalForm)
    {
        this.pharmaceuticalForm = pharmaceuticalForm;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "authorization_holder_id")
    public NmManufacturesEntity getAuthorizationHolder()
    {
        return authorizationHolder;
    }

    public void setAuthorizationHolder(NmManufacturesEntity authorizationHolder)
    {
        this.authorizationHolder = authorizationHolder;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "type_id")
    public NmMedicamentTypeEntity getMedicamentType()
    {
        return medicamentType;
    }

    public void setMedicamentType(NmMedicamentTypeEntity medicamentType)
    {
        this.medicamentType = medicamentType;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "group_id")
    public NmMedicamentGroupEntity getGroup()
    {
        return group;
    }

    public void setGroup(NmMedicamentGroupEntity group)
    {
        this.group = group;
    }

    @Basic
    @Column(name = "prescription", nullable = true)
    public Byte getPrescription()
    {
        return prescription;
    }

    public void setPrescription(Byte prescription)
    {
        this.prescription = prescription;
    }

    @Basic
    @Column(name = "serial_nr", nullable = true, length = 50)
    public String getSerialNr()
    {
        return serialNr;
    }

    public void setSerialNr(String serialNr)
    {
        this.serialNr = serialNr;
    }

    @Basic
    @Column(name = "primare_package", nullable = true, length = 50)
    public String getPrimarePackage()
    {
        return primarePackage;
    }

    public void setPrimarePackage(String primarePackage)
    {
        this.primarePackage = primarePackage;
    }

    @Basic
    @Column(name = "administering_mode", nullable = true, length = 200)
    public String getAdministeringMode()
    {
        return administeringMode;
    }

    public void setAdministeringMode(String administeringMode)
    {
        this.administeringMode = administeringMode;
    }

    @Basic
    @Column(name = "status", nullable = true, length = 1)
    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    @Basic
    @Column(name = "volume")
    public String getVolume()
    {
        return volume;
    }

    public void setVolume(String volume)
    {
        this.volume = volume;
    }

    @Basic
    @Column(name = "terms_of_validity")
    public Integer getTermsOfValidity()
    {
        return termsOfValidity;
    }

    public void setTermsOfValidity(Integer termsOfValidity)
    {
        this.termsOfValidity = termsOfValidity;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "volume_unit_measurement_id")
    public NmUnitsOfMeasurementEntity getVolumeQuantityMeasurement()
    {
        return volumeQuantityMeasurement;
    }

    public void setVolumeQuantityMeasurement(NmUnitsOfMeasurementEntity volumeQuantityMeasurement)
    {
        this.volumeQuantityMeasurement = volumeQuantityMeasurement;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    @JoinColumn(name = "medicament_id")
    public Set<MedicamentActiveSubstancesEntity> getActiveSubstances()
    {
        return activeSubstances;
    }

    public void setActiveSubstances(Set<MedicamentActiveSubstancesEntity> activeSubstances)
    {
        this.activeSubstances = activeSubstances;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_number")
    public Set<MedicamentHistoryEntity> getMedicamentHistory()
    {
        return medicamentHistory;
    }

    public void setMedicamentHistory(Set<MedicamentHistoryEntity> medicamentHistory)
    {
        this.medicamentHistory = medicamentHistory;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "expert_id")
    public MedicamentExpertsEntity getExperts()
    {
        return experts;
    }

    public void setExperts(MedicamentExpertsEntity experts)
    {
        this.experts = experts;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    public Set<MedicamentManufactureEntity> getManufactures()
    {
        return manufactures;
    }

    public void setManufactures(Set<MedicamentManufactureEntity> manufactures)
    {
        this.manufactures = manufactures;
    }

    @Basic
    @Column(name = "dose")
    public String getDose()
    {
        return dose;
    }

    public void setDose(String dose)
    {
        this.dose = dose;
    }

    @Basic
    @Column(name = "division")
    public String getDivision()
    {
        return division;
    }

    public void setDivision(String division)
    {
        this.division = division;
    }

    public void assign(MedicamentHistoryEntity entity)
    {
        this.name = entity.getName();
        this.atcCode = entity.getAtcCode();
        this.productCode = entity.getProductCode();
        this.customsCode = entity.getCustomsCode();
        this.barcode = entity.getBarcode();
        this.internationalMedicamentName = entity.getInternationalMedicamentName();
        this.countryId = entity.getCountryId();
        this.pharmaceuticalForm = entity.getPharmaceuticalForm();
        this.authorizationHolder = entity.getAuthorizationHolder();
        this.medicamentType = entity.getMedicamentType();
        this.group = entity.getGroup();
        this.prescription = entity.getPrescription();
        this.serialNr = entity.getSerialNr();
        this.primarePackage = entity.getPrimarePackage();
        this.administeringMode = entity.getAdministeringMode();
        this.volume = entity.getVolume();
        this.volumeQuantityMeasurement = entity.getVolumeQuantityMeasurement();
        this.termsOfValidity = entity.getTermsOfValidity();
        this.dose = entity.getDose();
        this.activeSubstances.clear();
        for (MedicamentActiveSubstancesHistoryEntity medicamentActiveSubstancesHistoryEntity : entity.getActiveSubstancesHistory())
        {
            MedicamentActiveSubstancesEntity medicamentActiveSubstancesEntity = new MedicamentActiveSubstancesEntity();
            medicamentActiveSubstancesEntity.assign(medicamentActiveSubstancesHistoryEntity);
            this.activeSubstances.add(medicamentActiveSubstancesEntity);
        }
        this.manufactures.clear();
        for (MedicamentManufactureHistoryEntity medicamentManufactureHistoryEntity : entity.getManufacturesHistory())
        {
            MedicamentManufactureEntity medicamentManufactureEntity = new MedicamentManufactureEntity();
            medicamentManufactureEntity.assign(medicamentManufactureHistoryEntity);
            this.manufactures.add(medicamentManufactureEntity);
        }
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (o == null || getClass() != o.getClass())
        {
            return false;
        }

        MedicamentEntity that = (MedicamentEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (name != null ? !name.equals(that.name) : that.name != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (productCode != null ? !productCode.equals(that.productCode) : that.productCode != null)
        {
            return false;
        }
        if (customsCode != null ? !customsCode.equals(that.customsCode) : that.customsCode != null)
        {
            return false;
        }
        if (barcode != null ? !barcode.equals(that.barcode) : that.barcode != null)
        {
            return false;
        }
        if (internationalMedicamentName != null ? !internationalMedicamentName.equals(that.internationalMedicamentName) : that.internationalMedicamentName != null)
        {
            return false;
        }
        if (countryId != null ? !countryId.equals(that.countryId) : that.countryId != null)
        {
            return false;
        }
        if (manufactures != null ? !manufactures.equals(that.manufactures) : that.manufactures != null)
        {
            return false;
        }
        if (registrationNumber != null ? !registrationNumber.equals(that.registrationNumber) : that.registrationNumber != null)
        {
            return false;
        }
        if (registrationDate != null ? !registrationDate.equals(that.registrationDate) : that.registrationDate != null)
        {
            return false;
        }
        if (expirationDate != null ? !expirationDate.equals(that.expirationDate) : that.expirationDate != null)
        {
            return false;
        }
        if (dose != null ? !dose.equals(that.dose) : that.dose != null)
        {
            return false;
        }
        if (pharmaceuticalForm != null ? !pharmaceuticalForm.equals(that.pharmaceuticalForm) : that.pharmaceuticalForm != null)
        {
            return false;
        }
        if (authorizationHolder != null ? !authorizationHolder.equals(that.authorizationHolder) : that.authorizationHolder != null)
        {
            return false;
        }
        if (medicamentType != null ? !medicamentType.equals(that.medicamentType) : that.medicamentType != null)
        {
            return false;
        }
        if (group != null ? !group.equals(that.group) : that.group != null)
        {
            return false;
        }
        if (prescription != null ? !prescription.equals(that.prescription) : that.prescription != null)
        {
            return false;
        }
        if (serialNr != null ? !serialNr.equals(that.serialNr) : that.serialNr != null)
        {
            return false;
        }
        if (primarePackage != null ? !primarePackage.equals(that.primarePackage) : that.primarePackage != null)
        {
            return false;
        }
        if (administeringMode != null ? !administeringMode.equals(that.administeringMode) : that.administeringMode != null)
        {
            return false;
        }
        if (status != null ? !status.equals(that.status) : that.status != null)
        {
            return false;
        }
        if (volume != null ? !volume.equals(that.volume) : that.volume != null)
        {
            return false;
        }
        if (volumeQuantityMeasurement != null ? !volumeQuantityMeasurement.equals(that.volumeQuantityMeasurement) : that.volumeQuantityMeasurement != null)
        {
            return false;
        }
        if (termsOfValidity != null ? !termsOfValidity.equals(that.termsOfValidity) : that.termsOfValidity != null)
        {
            return false;
        }
        if (activeSubstances != null ? !activeSubstances.equals(that.activeSubstances) : that.activeSubstances != null)
        {
            return false;
        }
        if (medicamentHistory != null ? !medicamentHistory.equals(that.medicamentHistory) : that.medicamentHistory != null)
        {
            return false;
        }
        if (experts != null ? !experts.equals(that.experts) : that.experts != null)
        {
            return false;
        }
        if (atcCode != null ? !atcCode.equals(that.atcCode) : that.atcCode != null)
        {
            return false;
        }
        return division != null ? division.equals(that.division) : that.division == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (productCode != null ? productCode.hashCode() : 0);
        result = 31 * result + (customsCode != null ? customsCode.hashCode() : 0);
        result = 31 * result + (barcode != null ? barcode.hashCode() : 0);
        result = 31 * result + (internationalMedicamentName != null ? internationalMedicamentName.hashCode() : 0);
        result = 31 * result + (countryId != null ? countryId.hashCode() : 0);
        result = 31 * result + (manufactures != null ? manufactures.hashCode() : 0);
        result = 31 * result + (registrationNumber != null ? registrationNumber.hashCode() : 0);
        result = 31 * result + (registrationDate != null ? registrationDate.hashCode() : 0);
        result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
        result = 31 * result + (dose != null ? dose.hashCode() : 0);
        result = 31 * result + (pharmaceuticalForm != null ? pharmaceuticalForm.hashCode() : 0);
        result = 31 * result + (authorizationHolder != null ? authorizationHolder.hashCode() : 0);
        result = 31 * result + (medicamentType != null ? medicamentType.hashCode() : 0);
        result = 31 * result + (group != null ? group.hashCode() : 0);
        result = 31 * result + (prescription != null ? prescription.hashCode() : 0);
        result = 31 * result + (serialNr != null ? serialNr.hashCode() : 0);
        result = 31 * result + (primarePackage != null ? primarePackage.hashCode() : 0);
        result = 31 * result + (administeringMode != null ? administeringMode.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (volume != null ? volume.hashCode() : 0);
        result = 31 * result + (volumeQuantityMeasurement != null ? volumeQuantityMeasurement.hashCode() : 0);
        result = 31 * result + (termsOfValidity != null ? termsOfValidity.hashCode() : 0);
        result = 31 * result + (activeSubstances != null ? activeSubstances.hashCode() : 0);
        result = 31 * result + (medicamentHistory != null ? medicamentHistory.hashCode() : 0);
        result = 31 * result + (experts != null ? experts.hashCode() : 0);
        result = 31 * result + (atcCode != null ? atcCode.hashCode() : 0);
        result = 31 * result + (division != null ? division.hashCode() : 0);
        return result;
    }
}
