package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "registration_requests", schema = "amed", catalog = "")
public class RegistrationRequestsEntity
{
    private Integer id;
    private String requestNumber;
    private Timestamp startDate;
    private Timestamp endDate;
    private NmEconomicAgentsEntity company;
    private ImportAuthorizationEntity             importAuthorizationEntity;
    private String currentStep;
    private RequestTypesEntity type;
    private ClinicalTrialsEntity clinicalTrails;
    private LicensesEntity license;
    private PricesEntity price;
    private MedicamentAnnihilationEntity medicamentAnnihilation;
    private Set<RegistrationRequestHistoryEntity> requestHistories = new HashSet<>();
    private Set<MedicamentEntity> medicaments = new HashSet<>();
    private Set<MedicamentHistoryEntity> medicamentHistory  = new HashSet<>();
    private Set<OutputDocumentsEntity> outputDocuments = new HashSet<>();
    private Set<DocumentsEntity> documents = new HashSet<>();
    private Set<PaymentOrdersEntity> paymentOrders = new HashSet<>();
    private Set<ReceiptsEntity> receipts = new HashSet<>();
    private String interruptionReason;
    private String initiator;
    private String assignedUser;
    private String medicamentName;
    private Integer medicamentPostauthorizationRegisterNr;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "request_number")
    public String getRequestNumber()
    {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber)
    {
        this.requestNumber = requestNumber;
    }

    @Basic
    @Column(name = "start_date")
    public Timestamp getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Timestamp startDate)
    {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "end_date")
    public Timestamp getEndDate()
    {
        return endDate;
    }

    public void setEndDate(Timestamp endDate)
    {
        this.endDate = endDate;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "company_id" )
    public NmEconomicAgentsEntity getCompany()
    {
        return company;
    }

    public void setCompany(NmEconomicAgentsEntity company)
    {
        this.company = company;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "import_id" )
    public ImportAuthorizationEntity getImportAuthorizationEntity()
    {
        return importAuthorizationEntity;
    }

    public void setImportAuthorizationEntity(ImportAuthorizationEntity importAuthorizationEntity)
    {
        this.importAuthorizationEntity = importAuthorizationEntity;
    }

    @Basic
    @Column(name = "current_step")
    public String getCurrentStep()
    {
        return currentStep;
    }

    public void setCurrentStep(String currentStep)
    {
        this.currentStep = currentStep;
    }

    @OneToOne( fetch = FetchType.LAZY, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "price_id" )
    public PricesEntity getPrice() {
        return price;
    }

    public void setPrice(PricesEntity pricesRequest) {
        this.price = pricesRequest;
    }

    @OneToOne( fetch = FetchType.LAZY, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "clinical_trails_id" )
    public ClinicalTrialsEntity getClinicalTrails()
    {
        return clinicalTrails;
    }

    public void setClinicalTrails(ClinicalTrialsEntity clinicalTrails)
    {
        this.clinicalTrails = clinicalTrails;
    }

    @OneToOne( fetch = FetchType.LAZY, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "license_id" )
    public LicensesEntity getLicense()
    {
        return license;
    }

    public void setLicense(LicensesEntity license)
    {
        this.license = license;
    }

    @OneToOne( fetch = FetchType.LAZY, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "medicament_annihilation_id" )
    public MedicamentAnnihilationEntity getMedicamentAnnihilation()
    {
        return medicamentAnnihilation;
    }

    public void setMedicamentAnnihilation(MedicamentAnnihilationEntity medicamentAnnihilation)
    {
        this.medicamentAnnihilation = medicamentAnnihilation;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "registration_request_id" )
    public Set<RegistrationRequestHistoryEntity> getRequestHistories()
    {
        return requestHistories;
    }

    public void setRequestHistories(Set<RegistrationRequestHistoryEntity> requestHistories)
    {
        this.requestHistories = requestHistories;
    }

    @OneToMany( fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn( name = "request_id" )
    public Set<MedicamentEntity> getMedicaments()
    {
        return medicaments;
    }

    public void setMedicaments(Set<MedicamentEntity> medicaments)
    {
        this.medicaments = medicaments;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn( name = "request_id" )
    public Set<MedicamentHistoryEntity> getMedicamentHistory()
    {
        return medicamentHistory;
    }

    public void setMedicamentHistory(Set<MedicamentHistoryEntity> medicamentHistory)
    {
        this.medicamentHistory = medicamentHistory;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "request_id" )
    public Set<OutputDocumentsEntity> getOutputDocuments()
    {
        return outputDocuments;
    }

    public void setOutputDocuments(Set<OutputDocumentsEntity> outputDocuments)
    {
        this.outputDocuments = outputDocuments;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "registration_request_id" )
    public Set<DocumentsEntity> getDocuments()
    {
        return documents;
    }

    public void setDocuments(Set<DocumentsEntity> documents)
    {
        this.documents = documents;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "registration_request_id" )
    public Set<PaymentOrdersEntity> getPaymentOrders()
    {
        return paymentOrders;
    }

    public void setPaymentOrders(Set<PaymentOrdersEntity> paymentOrders)
    {
        this.paymentOrders = paymentOrders;
    }

    @OneToMany( fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "registration_request_id" )
    public Set<ReceiptsEntity> getReceipts()
    {
        return receipts;
    }

    public void setReceipts(Set<ReceiptsEntity> receipts)
    {
        this.receipts = receipts;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "type_id" )
    public RequestTypesEntity getType()
    {
        return type;
    }

    public void setType(RequestTypesEntity type)
    {
        this.type = type;
    }


    @Basic
    @Column(name = "interruption_reason")
    public String getInterruptionReason()
    {
        return interruptionReason;
    }

    public void setInterruptionReason(String interruptionReason)
    {
        this.interruptionReason = interruptionReason;
    }

    @Basic
    @Column(name = "initiator")
    public String getInitiator()
    {
        return initiator;
    }

    public void setInitiator(String initiator)
    {
        this.initiator = initiator;
    }

    @Basic
    @Column(name = "assigned_user")
    public String getAssignedUser()
    {
        return assignedUser;
    }

    public void setAssignedUser(String assignedUser)
    {
        this.assignedUser = assignedUser;
    }

    @Basic
    @Column(name = "medicament_name")
    public String getMedicamentName()
    {
        return medicamentName;
    }

    public void setMedicamentName(String medicamentName)
    {
        this.medicamentName = medicamentName;
    }

    @Basic
    @Column(name = "medicament_postauthorization_register_nr")
    public Integer getMedicamentPostauthorizationRegisterNr()
    {
        return medicamentPostauthorizationRegisterNr;
    }

    public void setMedicamentPostauthorizationRegisterNr(Integer medicamentPostauthorizationRegisterNr)
    {
        this.medicamentPostauthorizationRegisterNr = medicamentPostauthorizationRegisterNr;
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

        RegistrationRequestsEntity that = (RegistrationRequestsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (requestNumber != null ? !requestNumber.equals(that.requestNumber) : that.requestNumber != null)
        {
            return false;
        }
        if (startDate != null ? !startDate.equals(that.startDate) : that.startDate != null)
        {
            return false;
        }
        if (endDate != null ? !endDate.equals(that.endDate) : that.endDate != null)
        {
            return false;
        }
        if (company != null ? !company.equals(that.company) : that.company != null)
        {
            return false;
        }
        if (currentStep != null ? !currentStep.equals(that.currentStep) : that.currentStep != null)
        {
            return false;
        }
        if (type != null ? !type.equals(that.type) : that.type != null)
        {
            return false;
        }
        if (clinicalTrails != null ? !clinicalTrails.equals(that.clinicalTrails) : that.clinicalTrails != null)
        {
            return false;
        }
        if (license != null ? !license.equals(that.license) : that.license != null)
        {
            return false;
        }
        if (price != null ? !price.equals(that.price) : that.price != null)
        {
            return false;
        }
        if (medicamentAnnihilation != null ? !medicamentAnnihilation.equals(that.medicamentAnnihilation) : that.medicamentAnnihilation != null)
        {
            return false;
        }
        if (requestHistories != null ? !requestHistories.equals(that.requestHistories) : that.requestHistories != null)
        {
            return false;
        }
        if (medicaments != null ? !medicaments.equals(that.medicaments) : that.medicaments != null)
        {
            return false;
        }
        if (medicamentHistory != null ? !medicamentHistory.equals(that.medicamentHistory) : that.medicamentHistory != null)
        {
            return false;
        }
        if (outputDocuments != null ? !outputDocuments.equals(that.outputDocuments) : that.outputDocuments != null)
        {
            return false;
        }
        if (documents != null ? !documents.equals(that.documents) : that.documents != null)
        {
            return false;
        }
        if (paymentOrders != null ? !paymentOrders.equals(that.paymentOrders) : that.paymentOrders != null)
        {
            return false;
        }
        if (receipts != null ? !receipts.equals(that.receipts) : that.receipts != null)
        {
            return false;
        }
        if (interruptionReason != null ? !interruptionReason.equals(that.interruptionReason) : that.interruptionReason != null)
        {
            return false;
        }
        if (initiator != null ? !initiator.equals(that.initiator) : that.initiator != null)
        {
            return false;
        }
        if (assignedUser != null ? !assignedUser.equals(that.assignedUser) : that.assignedUser != null)
        {
            return false;
        }
        if (medicamentName != null ? !medicamentName.equals(that.medicamentName) : that.medicamentName != null)
        {
            return false;
        }
        return medicamentPostauthorizationRegisterNr != null ? medicamentPostauthorizationRegisterNr.equals(that.medicamentPostauthorizationRegisterNr) : that.medicamentPostauthorizationRegisterNr == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (requestNumber != null ? requestNumber.hashCode() : 0);
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        result = 31 * result + (endDate != null ? endDate.hashCode() : 0);
        result = 31 * result + (company != null ? company.hashCode() : 0);
        result = 31 * result + (importAuthorizationEntity != null ? importAuthorizationEntity.hashCode() : 0);
        result = 31 * result + (currentStep != null ? currentStep.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (clinicalTrails != null ? clinicalTrails.hashCode() : 0);
        result = 31 * result + (license != null ? license.hashCode() : 0);
        result = 31 * result + (price != null ? price.hashCode() : 0);
        result = 31 * result + (medicamentAnnihilation != null ? medicamentAnnihilation.hashCode() : 0);
        result = 31 * result + (requestHistories != null ? requestHistories.hashCode() : 0);
        result = 31 * result + (medicaments != null ? medicaments.hashCode() : 0);
        result = 31 * result + (medicamentHistory != null ? medicamentHistory.hashCode() : 0);
        result = 31 * result + (outputDocuments != null ? outputDocuments.hashCode() : 0);
        result = 31 * result + (documents != null ? documents.hashCode() : 0);
        result = 31 * result + (paymentOrders != null ? paymentOrders.hashCode() : 0);
        result = 31 * result + (receipts != null ? receipts.hashCode() : 0);
        result = 31 * result + (interruptionReason != null ? interruptionReason.hashCode() : 0);
        result = 31 * result + (initiator != null ? initiator.hashCode() : 0);
        result = 31 * result + (assignedUser != null ? assignedUser.hashCode() : 0);
        result = 31 * result + (medicamentName != null ? medicamentName.hashCode() : 0);
        result = 31 * result + (medicamentPostauthorizationRegisterNr != null ? medicamentPostauthorizationRegisterNr.hashCode() : 0);
        return result;
    }
}
