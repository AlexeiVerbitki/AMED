package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "nm_employees", schema = "amed", catalog = "")
public class NmEmployeesEntity
{
    private Integer id;
    private String code;
    private String name;
    private String lastname;
    private String firstname;
    private String middlename;
    private Date birthDate;
    private String phonenumbers;
    private String address;
    private String idnp;
    private Integer identificationDocumentTypeId;
    private String documentSeries;
    private String documentNumber;
    private Date issueDate;
    private String function;
    private String scienceDegree;
    private NmProfessionsEntity profession;
    private Integer commissionOrder;
    private Byte chairmanOfExperts;

    @Id
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
    @Column(name = "code")
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "name")
    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    @Basic
    @Column(name = "lastname")
    public String getLastname()
    {
        return lastname;
    }

    public void setLastname(String lastname)
    {
        this.lastname = lastname;
    }

    @Basic
    @Column(name = "firstname")
    public String getFirstname()
    {
        return firstname;
    }

    public void setFirstname(String firstname)
    {
        this.firstname = firstname;
    }

    @Basic
    @Column(name = "middlename")
    public String getMiddlename()
    {
        return middlename;
    }

    public void setMiddlename(String middlename)
    {
        this.middlename = middlename;
    }

    @Basic
    @Column(name = "birth_date")
    public Date getBirthDate()
    {
        return birthDate;
    }

    public void setBirthDate(Date birthDate)
    {
        this.birthDate = birthDate;
    }

    @Basic
    @Column(name = "phonenumbers")
    public String getPhonenumbers()
    {
        return phonenumbers;
    }

    public void setPhonenumbers(String phonenumbers)
    {
        this.phonenumbers = phonenumbers;
    }

    @Basic
    @Column(name = "address")
    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    @Basic
    @Column(name = "idnp")
    public String getIdnp()
    {
        return idnp;
    }

    public void setIdnp(String idnp)
    {
        this.idnp = idnp;
    }

    @Basic
    @Column(name = "identification_document_type_id")
    public Integer getIdentificationDocumentTypeId()
    {
        return identificationDocumentTypeId;
    }

    public void setIdentificationDocumentTypeId(Integer identificationDocumentTypeId)
    {
        this.identificationDocumentTypeId = identificationDocumentTypeId;
    }

    @Basic
    @Column(name = "document_series")
    public String getDocumentSeries()
    {
        return documentSeries;
    }

    public void setDocumentSeries(String documentSeries)
    {
        this.documentSeries = documentSeries;
    }

    @Basic
    @Column(name = "document_number")
    public String getDocumentNumber()
    {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber)
    {
        this.documentNumber = documentNumber;
    }

    @Basic
    @Column(name = "issue_date")
    public Date getIssueDate()
    {
        return issueDate;
    }

    public void setIssueDate(Date issueDate)
    {
        this.issueDate = issueDate;
    }

    @Basic
    @Column(name = "function")
    public String getFunction()
    {
        return function;
    }

    public void setFunction(String function)
    {
        this.function = function;
    }

    @Basic
    @Column(name = "science_degree")
    public String getScienceDegree()
    {
        return scienceDegree;
    }

    public void setScienceDegree(String scienceDegree)
    {
        this.scienceDegree = scienceDegree;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "profession_id" )
    public NmProfessionsEntity getProfession()
    {
        return profession;
    }

    public void setProfession(NmProfessionsEntity profession)
    {
        this.profession = profession;
    }

    @Basic
    @Column(name = "commission_order")
    public Integer getCommissionOrder()
    {
        return commissionOrder;
    }

    public void setCommissionOrder(Integer commissionOrder)
    {
        this.commissionOrder = commissionOrder;
    }

    @Basic
    @Column(name = "chairman_of_experts")
    public Byte getChairmanOfExperts()
    {
        return chairmanOfExperts;
    }

    public void setChairmanOfExperts(Byte chairmanOfExperts)
    {
        this.chairmanOfExperts = chairmanOfExperts;
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

        NmEmployeesEntity that = (NmEmployeesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (name != null ? !name.equals(that.name) : that.name != null)
        {
            return false;
        }
        if (lastname != null ? !lastname.equals(that.lastname) : that.lastname != null)
        {
            return false;
        }
        if (firstname != null ? !firstname.equals(that.firstname) : that.firstname != null)
        {
            return false;
        }
        if (middlename != null ? !middlename.equals(that.middlename) : that.middlename != null)
        {
            return false;
        }
        if (birthDate != null ? !birthDate.equals(that.birthDate) : that.birthDate != null)
        {
            return false;
        }
        if (phonenumbers != null ? !phonenumbers.equals(that.phonenumbers) : that.phonenumbers != null)
        {
            return false;
        }
        if (address != null ? !address.equals(that.address) : that.address != null)
        {
            return false;
        }
        if (idnp != null ? !idnp.equals(that.idnp) : that.idnp != null)
        {
            return false;
        }
        if (identificationDocumentTypeId != null ? !identificationDocumentTypeId.equals(that.identificationDocumentTypeId) : that.identificationDocumentTypeId != null)
        {
            return false;
        }
        if (documentSeries != null ? !documentSeries.equals(that.documentSeries) : that.documentSeries != null)
        {
            return false;
        }
        if (documentNumber != null ? !documentNumber.equals(that.documentNumber) : that.documentNumber != null)
        {
            return false;
        }
        if (issueDate != null ? !issueDate.equals(that.issueDate) : that.issueDate != null)
        {
            return false;
        }
        if (function != null ? !function.equals(that.function) : that.function != null)
        {
            return false;
        }
        if (scienceDegree != null ? !scienceDegree.equals(that.scienceDegree) : that.scienceDegree != null)
        {
            return false;
        }
        if (profession != null ? !profession.equals(that.profession) : that.profession != null)
        {
            return false;
        }
        if (commissionOrder != null ? !commissionOrder.equals(that.commissionOrder) : that.commissionOrder != null)
        {
            return false;
        }
        return chairmanOfExperts != null ? chairmanOfExperts.equals(that.chairmanOfExperts) : that.chairmanOfExperts == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (lastname != null ? lastname.hashCode() : 0);
        result = 31 * result + (firstname != null ? firstname.hashCode() : 0);
        result = 31 * result + (middlename != null ? middlename.hashCode() : 0);
        result = 31 * result + (birthDate != null ? birthDate.hashCode() : 0);
        result = 31 * result + (phonenumbers != null ? phonenumbers.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (idnp != null ? idnp.hashCode() : 0);
        result = 31 * result + (identificationDocumentTypeId != null ? identificationDocumentTypeId.hashCode() : 0);
        result = 31 * result + (documentSeries != null ? documentSeries.hashCode() : 0);
        result = 31 * result + (documentNumber != null ? documentNumber.hashCode() : 0);
        result = 31 * result + (issueDate != null ? issueDate.hashCode() : 0);
        result = 31 * result + (function != null ? function.hashCode() : 0);
        result = 31 * result + (scienceDegree != null ? scienceDegree.hashCode() : 0);
        result = 31 * result + (profession != null ? profession.hashCode() : 0);
        result = 31 * result + (commissionOrder != null ? commissionOrder.hashCode() : 0);
        result = 31 * result + (chairmanOfExperts != null ? chairmanOfExperts.hashCode() : 0);
        return result;
    }
}
