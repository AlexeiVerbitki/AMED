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
    private Integer licenseId;
    private String currentStep;
    private RequestTypesEntity type;
    private Integer medicamentAnnihilationId;
    private Integer medicamentControlCommitteeId;
    private ClinicalTrialsEntity clinicalTrails;
    private Integer applicantId;
    private Integer taxId;
    private Byte taxPaid;
    private Set<RegistrationRequestHistoryEntity> requestHistories = new HashSet<>();

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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
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
    @Column(name = "license_id")
    public Integer getLicenseId()
    {
        return licenseId;
    }

    public void setLicenseId(Integer licenseId)
    {
        this.licenseId = licenseId;
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

    @Basic
    @Column(name = "medicament_annihilation_id")
    public Integer getMedicamentAnnihilationId()
    {
        return medicamentAnnihilationId;
    }

    public void setMedicamentAnnihilationId(Integer medicamentAnnihilationId)
    {
        this.medicamentAnnihilationId = medicamentAnnihilationId;
    }

    @Basic
    @Column(name = "medicament_control_committee_id")
    public Integer getMedicamentControlCommitteeId()
    {
        return medicamentControlCommitteeId;
    }

    public void setMedicamentControlCommitteeId(Integer medicamentControlCommitteeId)
    {
        this.medicamentControlCommitteeId = medicamentControlCommitteeId;
    }

    @Basic
    @Column(name = "applicant_id")
    public Integer getApplicantId()
    {
        return applicantId;
    }

    public void setApplicantId(Integer applicantId)
    {
        this.applicantId = applicantId;
    }

    @Basic
    @Column(name = "tax_id")
    public Integer getTaxId()
    {
        return taxId;
    }

    public void setTaxId(Integer taxId)
    {
        this.taxId = taxId;
    }

    @Basic
    @Column(name = "tax_paid")
    public Byte getTaxPaid()
    {
        return taxPaid;
    }

    public void setTaxPaid(Byte taxPaid)
    {
        this.taxPaid = taxPaid;
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

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE} )
    @JoinColumn( name = "type_id" )
    public RequestTypesEntity getType()
    {
        return type;
    }

    public void setType(RequestTypesEntity type)
    {
        this.type = type;
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
        if (licenseId != null ? !licenseId.equals(that.licenseId) : that.licenseId != null)
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
        if (medicamentAnnihilationId != null ? !medicamentAnnihilationId.equals(that.medicamentAnnihilationId) : that.medicamentAnnihilationId != null)
        {
            return false;
        }
        if (medicamentControlCommitteeId != null ? !medicamentControlCommitteeId.equals(that.medicamentControlCommitteeId) : that.medicamentControlCommitteeId != null)
        {
            return false;
        }
        if (clinicalTrails != null ? !clinicalTrails.equals(that.clinicalTrails) : that.clinicalTrails != null)
        {
            return false;
        }
        if (applicantId != null ? !applicantId.equals(that.applicantId) : that.applicantId != null)
        {
            return false;
        }
        if (taxId != null ? !taxId.equals(that.taxId) : that.taxId != null)
        {
            return false;
        }
        if (taxPaid != null ? !taxPaid.equals(that.taxPaid) : that.taxPaid != null)
        {
            return false;
        }
        return requestHistories != null ? requestHistories.equals(that.requestHistories) : that.requestHistories == null;
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
        result = 31 * result + (licenseId != null ? licenseId.hashCode() : 0);
        result = 31 * result + (currentStep != null ? currentStep.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (medicamentAnnihilationId != null ? medicamentAnnihilationId.hashCode() : 0);
        result = 31 * result + (medicamentControlCommitteeId != null ? medicamentControlCommitteeId.hashCode() : 0);
        result = 31 * result + (clinicalTrails != null ? clinicalTrails.hashCode() : 0);
        result = 31 * result + (applicantId != null ? applicantId.hashCode() : 0);
        result = 31 * result + (taxId != null ? taxId.hashCode() : 0);
        result = 31 * result + (taxPaid != null ? taxPaid.hashCode() : 0);
        result = 31 * result + (requestHistories != null ? requestHistories.hashCode() : 0);
        return result;
    }
}
