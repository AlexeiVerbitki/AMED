package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "gmp_authorization_details", schema = "amed")
public class GMPAuthorizationDetailsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "company_id")
    private NmEconomicAgentsEntity company;
    @Basic
    @Column(name = "status")
    private String status;
    @Basic
    @Column(name = "medicament_veterinary")
    private Boolean medicamentVeterinary;
    @Basic
    @Column(name = "medicament_human_use")
    private Boolean medicamentHumanUse;
    @Basic
    @Column(name = "medicament_for_clinical_investigation")
    private Boolean medicamentClinicalInvestigation;
    @Basic
    @Column(name = "aseptically_prepared_import")
    private Boolean asepticallyPreparedImport;
    @Basic
    @Column(name = "terminally_sterilised_import")
    private Boolean terminallySterilisedImport;
    @Basic
    @Column(name = "nonsterile_products_import")
    private Boolean nonsterileProductsImport;
    @Basic
    @Column(name = "veterinary_details")
    private String veterinaryDetails;
    @Basic
    @Column(name = "place_distribution_name")
    private String placeDistributionName;
    @Basic
    @Column(name = "place_distribution_address")
    private String placeDistributionAddress;
    @Basic
    @Column(name = "place_distribution_postal_code")
    private String placeDistributionPostalCode;
    @Basic
    @Column(name = "place_distribution_contact_name")
    private String placeDistributionContactName;
    @Basic
    @Column(name = "place_distribution_phone_number")
    private String placeDistributionPhoneNumber;
    @Basic
    @Column(name = "place_distribution_fax")
    private String placeDistributionFax;
    @Basic
    @Column(name = "place_distribution_mobile_number")
    private String placeDistributionMobileNumber;
    @Basic
    @Column(name = "place_distribution_email")
    private String placeDistributionEmail;
    @Basic
    @Column(name = "stages_of_manufacture")
    private String stagesOfManufacture;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPSterileProductsEntity> sterileProducts = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPNesterileProductsEntity> neSterileProducts = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPBiologicalMedicinesEntity> biologicalMedicines = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPBiologicalMedicinesImportEntity> biologicalMedicinesImport = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPManufacturesEntity> manufactures = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPSterilizationsEntity> sterilizations = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPPrimaryPackagingEntity> primaryPackagings = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPSecondaryPackagingEntity> secondaryPackagings = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPTestsForQualityControlEntity> testsForQualityControl = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPTestsForQualityControlImportEntity> testsForQualityControlImport = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPImportActivitiesEntity> importActivities = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPLaboratoryUnderContractEntity> laboratories = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPQualifiedPersonsEntity> qualifiedPersons = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPAuthorizedMedicinesEntity> authorizedMedicines = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "gmp_inspectors", joinColumns = {
            @JoinColumn(name = "gmp_inspection_id")}, inverseJoinColumns = {
            @JoinColumn(name = "employer_id")})
    private Set<NmEmployeesEntity> inspectors = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "gmp_id")
    private Set<GMPSubsidiaryEntity> subsidiaries = new HashSet<>();
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "gmp_id")
    private Set<GMPPeriodsEntity> periods = new HashSet<>();
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "group_leader_id")
    private NmEmployeesEntity groupLeader;
    @Transient
    private String cause;
}
