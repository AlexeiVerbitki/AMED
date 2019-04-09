package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "nm_economic_agents", schema = "amed")
public class NmEconomicAgentsEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "idno")
    private String idno;
    @Basic
    @Column(name = "long_name")
    private String longName;
    @Basic
    @Column(name = "lccm_name")
    private String lccmName;
    @Basic
    @Column(name = "tax_code")
    private String taxCode;
    @Basic
    @Column(name = "ocpo_code")
    private String ocpoCode;
    @Basic
    @Column(name = "registration_number")
    private String registrationNumber;
    @Basic
    @Column(name = "registration_date")
    private Date registrationDate;
    @Basic
    @Column(name = "parent_id")
    private Integer parentId;
    @Basic
    @Column(name = "leader")
    private String leader;
    @Basic
    @Column(name = "director")
    private String director;
    @Basic
    @Column(name = "contract_number")
    private String contractNumber;
    @Basic
    @Column(name = "contract_date")
    private Date contractDate;
    @Basic
    @Column(name = "street")
    private String street;
    @Basic
    @Column(name = "filiala")
    private Integer filiala;
    @Basic
    @Column(name = "legal_address")
    private String legalAddress;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "locality_id")
    private NmLocalitiesEntity locality;
    @Basic
    @Column(name = "old_idno")
    private String oldIdno;
    @Basic
    @Column(name = "license_id")
    private Integer licenseId;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "type_id")
    private NmTypesOfEconomicAgentsEntity type;

    @Transient
    private LicenseResolutionEntity currentResolution;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "LICENSE_ACTIVITIES", joinColumns = {
            @JoinColumn(name = "economic_agent_id")}, inverseJoinColumns = {
            @JoinColumn(name = "license_activity_type_id")})
    private Set<LicenseActivityTypeEntity> activities = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "ec_agent_id")
    private Set<LicenseAgentPharmaceutistEntity> agentPharmaceutist = new HashSet<>();

    @Transient
    private LicenseAgentPharmaceutistEntity selectedPharmaceutist;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "ec_agent_id")
    private Set<LicenseResolutionEntity> resolutions = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "nm_economic_agent_bank_accounts", joinColumns = {
        @JoinColumn(name = "economic_agent_id")}, inverseJoinColumns = {
        @JoinColumn(name = "bank_account_id")})
    private Set<NmBankAccountsEntity> bankAccounts = new HashSet<>();

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "country_id")
    private NmCountriesEntity country;
}
