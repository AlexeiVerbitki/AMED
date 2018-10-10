package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "nm_economic_agents", schema = "amed", catalog = "")
public class NmEconomicAgentsEntity
{
    private int id;
    private String code;
    private String name;
    private String idno;
    private String longName;
    private String lccmName;
    private String taxCode;
    private String ocpoCode;
    private String registrationNumber;
    private Date registrationDate;
    private Integer parentId;
    private String statut;
    private Byte filiala;
    private Byte canUsePsychotropicDrugs;
    private String leader;
    private String director;
    private String contractNumber;
    private Date contractDate;
    private String street;
    private String legalAddress;
    private String email;

    @Id
    @Column(name = "id")
    public int getId()
    {
        return id;
    }

    public void setId(int id)
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
    @Column(name = "idno")
    public String getIdno()
    {
        return idno;
    }

    public void setIdno(String idno)
    {
        this.idno = idno;
    }

    @Basic
    @Column(name = "long_name")
    public String getLongName()
    {
        return longName;
    }

    public void setLongName(String longName)
    {
        this.longName = longName;
    }

    @Basic
    @Column(name = "lccm_name")
    public String getLccmName()
    {
        return lccmName;
    }

    public void setLccmName(String lccmName)
    {
        this.lccmName = lccmName;
    }

    @Basic
    @Column(name = "tax_code")
    public String getTaxCode()
    {
        return taxCode;
    }

    public void setTaxCode(String taxCode)
    {
        this.taxCode = taxCode;
    }

    @Basic
    @Column(name = "ocpo_code")
    public String getOcpoCode()
    {
        return ocpoCode;
    }

    public void setOcpoCode(String ocpoCode)
    {
        this.ocpoCode = ocpoCode;
    }

    @Basic
    @Column(name = "registration_number")
    public String getRegistrationNumber()
    {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber)
    {
        this.registrationNumber = registrationNumber;
    }

    @Basic
    @Column(name = "registration_date")
    public Date getRegistrationDate()
    {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate)
    {
        this.registrationDate = registrationDate;
    }

    @Basic
    @Column(name = "parent_id")
    public Integer getParentId()
    {
        return parentId;
    }

    public void setParentId(Integer parentId)
    {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "statut")
    public String getStatut()
    {
        return statut;
    }

    public void setStatut(String statut)
    {
        this.statut = statut;
    }

    @Basic
    @Column(name = "filiala")
    public Byte getFiliala()
    {
        return filiala;
    }

    public void setFiliala(Byte filiala)
    {
        this.filiala = filiala;
    }

    @Basic
    @Column(name = "can_use_psychotropic_drugs")
    public Byte getCanUsePsychotropicDrugs()
    {
        return canUsePsychotropicDrugs;
    }

    public void setCanUsePsychotropicDrugs(Byte canUsePsychotropicDrugs)
    {
        this.canUsePsychotropicDrugs = canUsePsychotropicDrugs;
    }

    @Basic
    @Column(name = "leader")
    public String getLeader()
    {
        return leader;
    }

    public void setLeader(String leader)
    {
        this.leader = leader;
    }

    @Basic
    @Column(name = "director")
    public String getDirector()
    {
        return director;
    }

    public void setDirector(String director)
    {
        this.director = director;
    }

    @Basic
    @Column(name = "contract_number")
    public String getContractNumber()
    {
        return contractNumber;
    }

    public void setContractNumber(String contractNumber)
    {
        this.contractNumber = contractNumber;
    }

    @Basic
    @Column(name = "contract_date")
    public Date getContractDate()
    {
        return contractDate;
    }

    public void setContractDate(Date contractDate)
    {
        this.contractDate = contractDate;
    }

    @Basic
    @Column(name = "street")
    public String getStreet()
    {
        return street;
    }

    public void setStreet(String street)
    {
        this.street = street;
    }

    @Basic
    @Column(name = "legal_address")
    public String getLegalAddress()
    {
        return legalAddress;
    }

    public void setLegalAddress(String legalAddress)
    {
        this.legalAddress = legalAddress;
    }

    @Basic
    @Column(name = "email")
    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NmEconomicAgentsEntity that = (NmEconomicAgentsEntity) o;
        return id == that.id &&
                Objects.equals(code, that.code) &&
                Objects.equals(name, that.name) &&
                Objects.equals(idno, that.idno) &&
                Objects.equals(longName, that.longName) &&
                Objects.equals(lccmName, that.lccmName) &&
                Objects.equals(taxCode, that.taxCode) &&
                Objects.equals(ocpoCode, that.ocpoCode) &&
                Objects.equals(registrationNumber, that.registrationNumber) &&
                Objects.equals(registrationDate, that.registrationDate) &&
                Objects.equals(parentId, that.parentId) &&
                Objects.equals(statut, that.statut) &&
                Objects.equals(filiala, that.filiala) &&
                Objects.equals(canUsePsychotropicDrugs, that.canUsePsychotropicDrugs) &&
                Objects.equals(leader, that.leader) &&
                Objects.equals(director, that.director) &&
                Objects.equals(contractNumber, that.contractNumber) &&
                Objects.equals(contractDate, that.contractDate) &&
                Objects.equals(street, that.street) &&
                Objects.equals(legalAddress, that.legalAddress) &&
                Objects.equals(email, that.email);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, code, name, idno, longName, lccmName, taxCode, ocpoCode, registrationNumber, registrationDate, parentId, statut, filiala, canUsePsychotropicDrugs, leader, director, contractNumber, contractDate, street, legalAddress, email);
    }
}
