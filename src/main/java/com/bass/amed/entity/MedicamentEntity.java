package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "medicament", schema = "amed", catalog = "")
public class MedicamentEntity
{
    private Integer                               id;
    private String                                name;
    private String                                code;
    private String                                productCode;
    private String                                customsCode;
    private String                                barcode;
    private NmInternationalMedicamentNameEntity   internationalMedicamentName;
    private String                                commercialName;
    private Integer                               countryId;
    private NmManufacturesEntity                  manufacture;
    private Integer                               registrationNumber;
    private Timestamp                             registrationDate;
    private Date                                  expirationDate;
    private Double                                dose;
    private NmPharmaceuticalFormsEntity           pharmaceuticalForm;
    private NmManufacturesEntity                  authorizationHolder;
    private NmMedicamentTypeEntity                medicamentType;
    private NmMedicamentGroupEntity               group;
    private Byte                                  prescription;
    private String                                serialNr;
    private String                                primarePackage;
    private String                                administeringMode;
    private NmEconomicAgentsEntity                company;
    private String                                status;
    private NmUnitsOfMeasurementEntity            unitsOfMeasurement;
    private String                                volume;
    private Integer                               termsOfValidity;
    private Integer                               unitsQuantity;
    private NmUnitsOfMeasurementEntity            unitsQuantityMeasurement;
    private Integer                               storageQuantity;
    private NmUnitsOfMeasurementEntity            storageQuantityMeasurement;
    private Set<DocumentsEntity>                  documents;
    private Set<OutputDocumentsEntity> outputDocuments;
    private Set<MedicamentActiveSubstancesEntity> activeSubstances;
    private Set<PaymentOrdersEntity>              paymentOrders;
    private Set<ReceiptsEntity>                   receipts;
    private Set<ReferencePricesEntity> referencePrices;
    private Set<PricesEntity> prices;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id", nullable = false)
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    public Set<ReferencePricesEntity> getReferencePrices() {
        return referencePrices;
    }

    public void setReferencePrices(Set<ReferencePricesEntity> referencePrices) {
        this.referencePrices = referencePrices;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    public Set<PricesEntity> getPrices() {
        return prices;
    }

    public void setPrices(Set<PricesEntity> prices) {
        this.prices = prices;
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
    @Column(name = "code", nullable = true, length = 10)
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Basic
    @Column(name = "product_code", nullable = true, length = 10)
    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    @Basic
    @Column(name = "customs_code", nullable = true, length = 5)
    public String getCustomsCode() {
        return customsCode;
    }

    public void setCustomsCode(String customsCode) {
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "international_name_id" )
    public NmInternationalMedicamentNameEntity getInternationalMedicamentName()
    {
        return internationalMedicamentName;
    }

    public void setInternationalMedicamentName(NmInternationalMedicamentNameEntity internationalMedicamentName) {
        this.internationalMedicamentName = internationalMedicamentName;
    }

    @Basic
    @Column(name = "commercial_name", nullable = true, length = 100)
    public String getCommercialName()
    {
        return commercialName;
    }

    public void setCommercialName(String commercialName)
    {
        this.commercialName = commercialName;
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "manufacture_id" )
    public NmManufacturesEntity getManufacture()
    {
        return manufacture;
    }

    public void setManufacture(NmManufacturesEntity manufacture)
    {
        this.manufacture = manufacture;
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

    @Basic
    @Column(name = "dose")
    public Double getDose()
    {
        return dose;
    }

    public void setDose(Double dose)
    {
        this.dose = dose;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "pharmaceutical_form_id" )
    public NmPharmaceuticalFormsEntity getPharmaceuticalForm()
    {
        return pharmaceuticalForm;
    }

    public void setPharmaceuticalForm(NmPharmaceuticalFormsEntity pharmaceuticalForm)
    {
        this.pharmaceuticalForm = pharmaceuticalForm;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "authorization_holder_id" )
    public NmManufacturesEntity getAuthorizationHolder()
    {
        return authorizationHolder;
    }

    public void setAuthorizationHolder(NmManufacturesEntity authorizationHolder)
    {
        this.authorizationHolder = authorizationHolder;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "type_id" )
    public NmMedicamentTypeEntity getMedicamentType()
    {
        return medicamentType;
    }

    public void setMedicamentType(NmMedicamentTypeEntity medicamentType)
    {
        this.medicamentType = medicamentType;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "group_id" )
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "economic_agent_id" )
    public NmEconomicAgentsEntity getCompany()
    {
        return company;
    }

    public void setCompany(NmEconomicAgentsEntity company)
    {
        this.company = company;
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "unit_measurement_id" )
    public NmUnitsOfMeasurementEntity getUnitsOfMeasurement()
    {
        return unitsOfMeasurement;
    }

    public void setUnitsOfMeasurement(NmUnitsOfMeasurementEntity unitsOfMeasurement)
    {
        this.unitsOfMeasurement = unitsOfMeasurement;
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

    @Basic
    @Column(name = "units_quantity")
    public Integer getUnitsQuantity()
    {
        return unitsQuantity;
    }

    public void setUnitsQuantity(Integer unitsQuantity)
    {
        this.unitsQuantity = unitsQuantity;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "units_quantity_unit_measurement_id" )
    public NmUnitsOfMeasurementEntity getUnitsQuantityMeasurement()
    {
        return unitsQuantityMeasurement;
    }

    public void setUnitsQuantityMeasurement(NmUnitsOfMeasurementEntity unitsQuantityMeasurement)
    {
        this.unitsQuantityMeasurement = unitsQuantityMeasurement;
    }

    @Basic
    @Column(name = "storage_quantity")
    public Integer getStorageQuantity()
    {
        return storageQuantity;
    }

    public void setStorageQuantity(Integer storageQuantity)
    {
        this.storageQuantity = storageQuantity;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "storage_quantity_unit_measurement_id" )
    public NmUnitsOfMeasurementEntity getStorageQuantityMeasurement()
    {
        return storageQuantityMeasurement;
    }

    public void setStorageQuantityMeasurement(NmUnitsOfMeasurementEntity storageQuantityMeasurement)
    {
        this.storageQuantityMeasurement = storageQuantityMeasurement;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "MEDICAMENT_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "MEDICAMENT_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "MEDICAMENT_OUTPUT_DOCUMENTS", joinColumns = {
            @JoinColumn(name = "MEDICAMENT_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "DOCUMENT_ID")})
    public Set<OutputDocumentsEntity> getOutputDocuments()
    {
        return outputDocuments;
    }

    public void setOutputDocuments(Set<OutputDocumentsEntity> outputDocuments)
    {
        this.outputDocuments = outputDocuments;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "MEDICAMENT_PAYMENT_ORDERS", joinColumns = {
            @JoinColumn(name = "MEDICAMENT_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "PAYMENT_ORDER_ID")})
    public Set<PaymentOrdersEntity> getPaymentOrders()
    {
        return paymentOrders;
    }

    public void setPaymentOrders(Set<PaymentOrdersEntity> paymentOrders)
    {
        this.paymentOrders = paymentOrders;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinTable(name = "MEDICAMENT_RECEIPTS", joinColumns = {
            @JoinColumn(name = "MEDICAMENT_ID")}, inverseJoinColumns = {
            @JoinColumn(name = "RECEIPT_ID")})
    public Set<ReceiptsEntity> getReceipts()
    {
        return receipts;
    }

    public void setReceipts(Set<ReceiptsEntity> receipts)
    {
        this.receipts = receipts;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinColumn(name = "medicament_id")
    public Set<MedicamentActiveSubstancesEntity> getActiveSubstances()
    {
        return activeSubstances;
    }

    public void setActiveSubstances(Set<MedicamentActiveSubstancesEntity> activeSubstances)
    {
        this.activeSubstances = activeSubstances;
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
        if (commercialName != null ? !commercialName.equals(that.commercialName) : that.commercialName != null)
        {
            return false;
        }
        if (countryId != null ? !countryId.equals(that.countryId) : that.countryId != null)
        {
            return false;
        }
        if (manufacture != null ? !manufacture.equals(that.manufacture) : that.manufacture != null)
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
        if (company != null ? !company.equals(that.company) : that.company != null)
        {
            return false;
        }
        if (status != null ? !status.equals(that.status) : that.status != null)
        {
            return false;
        }
        if (unitsOfMeasurement != null ? !unitsOfMeasurement.equals(that.unitsOfMeasurement) : that.unitsOfMeasurement != null)
        {
            return false;
        }
        if (volume != null ? !volume.equals(that.volume) : that.volume != null)
        {
            return false;
        }
        if (termsOfValidity != null ? !termsOfValidity.equals(that.termsOfValidity) : that.termsOfValidity != null)
        {
            return false;
        }
        if (unitsQuantity != null ? !unitsQuantity.equals(that.unitsQuantity) : that.unitsQuantity != null)
        {
            return false;
        }
        if (unitsQuantityMeasurement != null ? !unitsQuantityMeasurement.equals(that.unitsQuantityMeasurement) : that.unitsQuantityMeasurement != null)
        {
            return false;
        }
        if (storageQuantity != null ? !storageQuantity.equals(that.storageQuantity) : that.storageQuantity != null)
        {
            return false;
        }
        if (storageQuantityMeasurement != null ? !storageQuantityMeasurement.equals(that.storageQuantityMeasurement) : that.storageQuantityMeasurement != null)
        {
            return false;
        }
        if (documents != null ? !documents.equals(that.documents) : that.documents != null)
        {
            return false;
        }
        return activeSubstances != null ? activeSubstances.equals(that.activeSubstances) : that.activeSubstances == null;
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
        result = 31 * result + (commercialName != null ? commercialName.hashCode() : 0);
        result = 31 * result + (countryId != null ? countryId.hashCode() : 0);
        result = 31 * result + (manufacture != null ? manufacture.hashCode() : 0);
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
        result = 31 * result + (company != null ? company.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (unitsOfMeasurement != null ? unitsOfMeasurement.hashCode() : 0);
        result = 31 * result + (volume != null ? volume.hashCode() : 0);
        result = 31 * result + (termsOfValidity != null ? termsOfValidity.hashCode() : 0);
        result = 31 * result + (unitsQuantity != null ? unitsQuantity.hashCode() : 0);
        result = 31 * result + (unitsQuantityMeasurement != null ? unitsQuantityMeasurement.hashCode() : 0);
        result = 31 * result + (storageQuantity != null ? storageQuantity.hashCode() : 0);
        result = 31 * result + (storageQuantityMeasurement != null ? storageQuantityMeasurement.hashCode() : 0);
        result = 31 * result + (documents != null ? documents.hashCode() : 0);
        result = 31 * result + (activeSubstances != null ? activeSubstances.hashCode() : 0);
        return result;
    }
}
