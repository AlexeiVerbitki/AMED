package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "nm_economic_agents", schema = "amed", catalog = "")
public class NmEconomicAgentsEntity {
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
    private NmLocalitiesEntity locality;


    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "code")
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "idno")
    public String getIdno() {
        return idno;
    }

    public void setIdno(String idno) {
        this.idno = idno;
    }

    @Basic
    @Column(name = "long_name")
    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    @Basic
    @Column(name = "lccm_name")
    public String getLccmName() {
        return lccmName;
    }

    public void setLccmName(String lccmName) {
        this.lccmName = lccmName;
    }

    @Basic
    @Column(name = "tax_code")
    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    @Basic
    @Column(name = "ocpo_code")
    public String getOcpoCode() {
        return ocpoCode;
    }

    public void setOcpoCode(String ocpoCode) {
        this.ocpoCode = ocpoCode;
    }

    @Basic
    @Column(name = "registration_number")
    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    @Basic
    @Column(name = "registration_date")
    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    @Basic
    @Column(name = "parent_id")
    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "statut")
    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    @Basic
    @Column(name = "filiala")
    public Byte getFiliala() {
        return filiala;
    }

    public void setFiliala(Byte filiala) {
        this.filiala = filiala;
    }

    @Basic
    @Column(name = "can_use_psychotropic_drugs")
    public Byte getCanUsePsychotropicDrugs() {
        return canUsePsychotropicDrugs;
    }

    public void setCanUsePsychotropicDrugs(Byte canUsePsychotropicDrugs) {
        this.canUsePsychotropicDrugs = canUsePsychotropicDrugs;
    }

    @Basic
    @Column(name = "leader")
    public String getLeader() {
        return leader;
    }

    public void setLeader(String leader) {
        this.leader = leader;
    }

    @Basic
    @Column(name = "director")
    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    @Basic
    @Column(name = "contract_number")
    public String getContractNumber() {
        return contractNumber;
    }

    public void setContractNumber(String contractNumber) {
        this.contractNumber = contractNumber;
    }

    @Basic
    @Column(name = "contract_date")
    public Date getContractDate() {
        return contractDate;
    }

    public void setContractDate(Date contractDate) {
        this.contractDate = contractDate;
    }

    @Basic
    @Column(name = "street")
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Basic
    @Column(name = "legal_address")
    public String getLegalAddress() {
        return legalAddress;
    }

    public void setLegalAddress(String legalAddress) {
        this.legalAddress = legalAddress;
    }

    @Basic
    @Column(name = "email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "locality_id" )
    public NmLocalitiesEntity getLocality()
    {
        return locality;
    }

    public void setLocality(NmLocalitiesEntity locality)
    {
        this.locality = locality;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        NmEconomicAgentsEntity that = (NmEconomicAgentsEntity) o;

        if (id != that.id) return false;
        if (code != null ? !code.equals(that.code) : that.code != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (idno != null ? !idno.equals(that.idno) : that.idno != null) return false;
        if (longName != null ? !longName.equals(that.longName) : that.longName != null) return false;
        if (lccmName != null ? !lccmName.equals(that.lccmName) : that.lccmName != null) return false;
        if (taxCode != null ? !taxCode.equals(that.taxCode) : that.taxCode != null) return false;
        if (ocpoCode != null ? !ocpoCode.equals(that.ocpoCode) : that.ocpoCode != null) return false;
        if (registrationNumber != null ? !registrationNumber.equals(that.registrationNumber) : that.registrationNumber != null)
            return false;
        if (registrationDate != null ? !registrationDate.equals(that.registrationDate) : that.registrationDate != null)
            return false;
        if (parentId != null ? !parentId.equals(that.parentId) : that.parentId != null) return false;
        if (statut != null ? !statut.equals(that.statut) : that.statut != null) return false;
        if (filiala != null ? !filiala.equals(that.filiala) : that.filiala != null) return false;
        if (canUsePsychotropicDrugs != null ? !canUsePsychotropicDrugs.equals(that.canUsePsychotropicDrugs) : that.canUsePsychotropicDrugs != null)
            return false;
        if (leader != null ? !leader.equals(that.leader) : that.leader != null) return false;
        if (director != null ? !director.equals(that.director) : that.director != null) return false;
        if (contractNumber != null ? !contractNumber.equals(that.contractNumber) : that.contractNumber != null)
            return false;
        if (contractDate != null ? !contractDate.equals(that.contractDate) : that.contractDate != null) return false;
        if (street != null ? !street.equals(that.street) : that.street != null) return false;
        if (legalAddress != null ? !legalAddress.equals(that.legalAddress) : that.legalAddress != null) return false;
        return email != null ? email.equals(that.email) : that.email == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (idno != null ? idno.hashCode() : 0);
        result = 31 * result + (longName != null ? longName.hashCode() : 0);
        result = 31 * result + (lccmName != null ? lccmName.hashCode() : 0);
        result = 31 * result + (taxCode != null ? taxCode.hashCode() : 0);
        result = 31 * result + (ocpoCode != null ? ocpoCode.hashCode() : 0);
        result = 31 * result + (registrationNumber != null ? registrationNumber.hashCode() : 0);
        result = 31 * result + (registrationDate != null ? registrationDate.hashCode() : 0);
        result = 31 * result + (parentId != null ? parentId.hashCode() : 0);
        result = 31 * result + (statut != null ? statut.hashCode() : 0);
        result = 31 * result + (filiala != null ? filiala.hashCode() : 0);
        result = 31 * result + (canUsePsychotropicDrugs != null ? canUsePsychotropicDrugs.hashCode() : 0);
        result = 31 * result + (leader != null ? leader.hashCode() : 0);
        result = 31 * result + (director != null ? director.hashCode() : 0);
        result = 31 * result + (contractNumber != null ? contractNumber.hashCode() : 0);
        result = 31 * result + (contractDate != null ? contractDate.hashCode() : 0);
        result = 31 * result + (street != null ? street.hashCode() : 0);
        result = 31 * result + (legalAddress != null ? legalAddress.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        return result;
    }
}
