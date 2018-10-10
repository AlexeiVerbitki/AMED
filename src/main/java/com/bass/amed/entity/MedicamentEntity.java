package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
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
    private String internationalName;
    private String commercialName;
    private Integer countryId;
    private Integer manufactureId;
    private Integer registrationNumber;
    private Date registrationDate;
    private Date expirationDate;
    private String dose;
    private String quantity;
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;
    private Integer activeSubstanceId;
    private Integer authorizationHolderId;
    private Integer typeId;
    private Integer groupId;
    private Byte prescription;
    private String serialNr;
    private String primarePackage;
    private String administeringMode;
    private NmEconomicAgentsEntity company;
    private String status;
    private Set<DocumentsEntity> documents;
    private Set<MedicamentActiveSubstancesEntity> activeSubstances;

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

    @Basic
    @Column(name = "international_name", nullable = true, length = 100)
    public String getInternationalName()
    {
        return internationalName;
    }

    public void setInternationalName(String internationalName)
    {
        this.internationalName = internationalName;
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

    @Basic
    @Column(name = "manufacture_id")
    public Integer getManufactureId()
    {
        return manufactureId;
    }

    public void setManufactureId(Integer manufactureId)
    {
        this.manufactureId = manufactureId;
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
    public Date getRegistrationDate()
    {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate)
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
    @Column(name = "dose", nullable = true, length = 50)
    public String getDose()
    {
        return dose;
    }

    public void setDose(String dose)
    {
        this.dose = dose;
    }

    @Basic
    @Column(name = "quantity", nullable = true, length = 20)
    public String getQuantity()
    {
        return quantity;
    }

    public void setQuantity(String quantity)
    {
        this.quantity = quantity;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "pharmaceutical_form_id" )
    public NmPharmaceuticalFormsEntity getPharmaceuticalForm()
    {
        return pharmaceuticalForm;
    }

    public void setPharmaceuticalForm(NmPharmaceuticalFormsEntity pharmaceuticalForm)
    {
        this.pharmaceuticalForm = pharmaceuticalForm;
    }

    @Basic
    @Column(name = "active_substance_id")
    public Integer getActiveSubstanceId()
    {
        return activeSubstanceId;
    }

    public void setActiveSubstanceId(Integer activeSubstanceId)
    {
        this.activeSubstanceId = activeSubstanceId;
    }

    @Basic
    @Column(name = "authorization_holder_id")
    public Integer getAuthorizationHolderId()
    {
        return authorizationHolderId;
    }

    public void setAuthorizationHolderId(Integer authorizationHolderId)
    {
        this.authorizationHolderId = authorizationHolderId;
    }

    @Basic
    @Column(name = "type_id")
    public Integer getTypeId()
    {
        return typeId;
    }

    public void setTypeId(Integer typeId)
    {
        this.typeId = typeId;
    }

    @Basic
    @Column(name = "group_id")
    public Integer getGroupId()
    {
        return groupId;
    }

    public void setGroupId(Integer groupId)
    {
        this.groupId = groupId;
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "economic_agent_id" )
    public NmEconomicAgentsEntity getCompany()
    {
        return company;
    }

    public void setCompany(NmEconomicAgentsEntity company)
    {
        this.company = company;
    }

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
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

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
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
        if (internationalName != null ? !internationalName.equals(that.internationalName) : that.internationalName != null)
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
        if (manufactureId != null ? !manufactureId.equals(that.manufactureId) : that.manufactureId != null)
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
        if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null)
        {
            return false;
        }
        if (pharmaceuticalForm != null ? !pharmaceuticalForm.equals(that.pharmaceuticalForm) : that.pharmaceuticalForm != null)
        {
            return false;
        }
        if (activeSubstanceId != null ? !activeSubstanceId.equals(that.activeSubstanceId) : that.activeSubstanceId != null)
        {
            return false;
        }
        if (authorizationHolderId != null ? !authorizationHolderId.equals(that.authorizationHolderId) : that.authorizationHolderId != null)
        {
            return false;
        }
        if (typeId != null ? !typeId.equals(that.typeId) : that.typeId != null)
        {
            return false;
        }
        if (groupId != null ? !groupId.equals(that.groupId) : that.groupId != null)
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
        return documents != null ? documents.equals(that.documents) : that.documents == null;
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
        result = 31 * result + (internationalName != null ? internationalName.hashCode() : 0);
        result = 31 * result + (commercialName != null ? commercialName.hashCode() : 0);
        result = 31 * result + (countryId != null ? countryId.hashCode() : 0);
        result = 31 * result + (manufactureId != null ? manufactureId.hashCode() : 0);
        result = 31 * result + (registrationNumber != null ? registrationNumber.hashCode() : 0);
        result = 31 * result + (registrationDate != null ? registrationDate.hashCode() : 0);
        result = 31 * result + (expirationDate != null ? expirationDate.hashCode() : 0);
        result = 31 * result + (dose != null ? dose.hashCode() : 0);
        result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
        result = 31 * result + (pharmaceuticalForm != null ? pharmaceuticalForm.hashCode() : 0);
        result = 31 * result + (activeSubstanceId != null ? activeSubstanceId.hashCode() : 0);
        result = 31 * result + (authorizationHolderId != null ? authorizationHolderId.hashCode() : 0);
        result = 31 * result + (typeId != null ? typeId.hashCode() : 0);
        result = 31 * result + (groupId != null ? groupId.hashCode() : 0);
        result = 31 * result + (prescription != null ? prescription.hashCode() : 0);
        result = 31 * result + (serialNr != null ? serialNr.hashCode() : 0);
        result = 31 * result + (primarePackage != null ? primarePackage.hashCode() : 0);
        result = 31 * result + (administeringMode != null ? administeringMode.hashCode() : 0);
        result = 31 * result + (company != null ? company.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (documents != null ? documents.hashCode() : 0);
        return result;
    }
}
