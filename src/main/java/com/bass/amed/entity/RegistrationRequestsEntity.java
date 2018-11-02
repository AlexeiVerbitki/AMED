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
    private MedicamentEntity medicament;
    private NmEconomicAgentsEntity company;
    private Integer importId;
    private String currentStep;
    private RequestTypesEntity type;
    private ClinicalTrialsEntity clinicalTrails;
    private LicensesEntity license;
    private MedicamentAnnihilationEntity medicamentAnnihilation;
    private Set<RegistrationRequestHistoryEntity> requestHistories = new HashSet<>();
    private String interruptionReason;
    private String initiator;
    private String assignedUser;

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

    @Basic
    @Column(name = "import_id")
    public Integer getImportId()
    {
        return importId;
    }

    public void setImportId(Integer importId)
    {
        this.importId = importId;
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE,CascadeType.PERSIST } )
    @JoinColumn( name = "medicament_id" )
    public MedicamentEntity getMedicament()
    {
        return medicament;
    }

    public void setMedicament(MedicamentEntity medicament)
    {
        this.medicament = medicament;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
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
        if (medicament != null ? !medicament.equals(that.medicament) : that.medicament != null)
        {
            return false;
        }
        if (company != null ? !company.equals(that.company) : that.company != null)
        {
            return false;
        }
        if (importId != null ? !importId.equals(that.importId) : that.importId != null)
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
        if (requestHistories != null ? !requestHistories.equals(that.requestHistories) : that.requestHistories != null)
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
        return assignedUser != null ? assignedUser.equals(that.assignedUser) : that.assignedUser == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (requestNumber != null ? requestNumber.hashCode() : 0);
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        result = 31 * result + (endDate != null ? endDate.hashCode() : 0);
        result = 31 * result + (medicament != null ? medicament.hashCode() : 0);
        result = 31 * result + (company != null ? company.hashCode() : 0);
        result = 31 * result + (importId != null ? importId.hashCode() : 0);
        result = 31 * result + (currentStep != null ? currentStep.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (clinicalTrails != null ? clinicalTrails.hashCode() : 0);
        result = 31 * result + (license != null ? license.hashCode() : 0);
        result = 31 * result + (requestHistories != null ? requestHistories.hashCode() : 0);
        result = 31 * result + (interruptionReason != null ? interruptionReason.hashCode() : 0);
        result = 31 * result + (initiator != null ? initiator.hashCode() : 0);
        result = 31 * result + (assignedUser != null ? assignedUser.hashCode() : 0);
        return result;
    }
}
