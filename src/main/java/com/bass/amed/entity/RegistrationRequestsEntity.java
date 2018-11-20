package com.bass.amed.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@EqualsAndHashCode
@Entity
@Table(name = "registration_requests", schema = "amed")
public class RegistrationRequestsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "request_number")
    private String requestNumber;
    @Basic
    @Column(name = "start_date")
    private Timestamp startDate;
    @Basic
    @Column(name = "end_date")
    private Timestamp endDate;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "company_id")
    private NmEconomicAgentsEntity company;

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "import_id" )
    private ImportAuthorizationEntity importAuthorizationEntity;


    @Basic
    @Column(name = "current_step")
    private String currentStep;
    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "type_id")
    private RequestTypesEntity type;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "clinical_trails_id")
    private ClinicalTrialsEntity clinicalTrails;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "license_id")
    private LicensesEntity license;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "price_id")
    private PricesEntity price;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "medicament_annihilation_id")
    private MedicamentAnnihilationEntity medicamentAnnihilation;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_request_id")
    private Set<RegistrationRequestHistoryEntity> requestHistories = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "request_id")
    private Set<MedicamentEntity> medicaments = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "request_id")
    private Set<MedicamentHistoryEntity> medicamentHistory = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "request_id")
    private Set<OutputDocumentsEntity> outputDocuments = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_request_id")
    private Set<DocumentsEntity> documents = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_request_id")
    private Set<PaymentOrdersEntity> paymentOrders = new HashSet<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_request_id")
    private Set<ReceiptsEntity> receipts = new HashSet<>();
    @Basic
    @Column(name = "interruption_reason")
    private String interruptionReason;
    @Basic
    @Column(name = "initiator")
    private String initiator;
    @Basic
    @Column(name = "assigned_user")
    private String assignedUser;
    @Basic
    @Column(name = "medicament_name")
    private String medicamentName;
    @Basic
    @Column(name = "medicament_postauthorization_register_nr")
    private Integer medicamentPostauthorizationRegisterNr;
    @OneToMany( fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST} )
    @JoinColumn( name = "registration_request_id" )
    private Set<DrugCheckDecisionsEntity> drugCheckDecisions = new HashSet<>();
//    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, mappedBy = "registrationRequestsEntity")
//    private DocumentModuleDetailsEntity documentModuleDetails;

}
