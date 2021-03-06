package com.bass.amed.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
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
    @OneToOne( fetch = FetchType.LAZY, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "import_id" )
    private ImportAuthorizationEntity importAuthorizationEntity;
    @OneToOne( fetch = FetchType.LAZY, cascade = { CascadeType.MERGE,CascadeType.PERSIST} )
    @JoinColumn( name = "invoice_id" )
    private InvoiceEntity invoiceEntity;
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
    private Set<RegistrationRequestMandatedContactEntity> registrationRequestMandatedContacts = new HashSet<>();
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
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "registration_request_id")
    private Set<DrugCheckDecisionsEntity> drugCheckDecisions = new HashSet<>();
    @Basic
    @Column(name = "dossier_nr")
    private String dossierNr;
    @Basic
    @Column(name = "dd_included")
    private Boolean ddIncluded;
    @Basic
    @Column(name = "dd_number")
    private String ddNumber;
    @Basic
    @Column(name = "oi_included")
    private Boolean oiIncluded;
    @Basic
    @Column(name = "oi_number")
    private String oiNumber;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "request_id")
    private Set<ExpertListEntity> expertList = new HashSet<>();
	@Column(name = "output_document_id")
    private Integer outputDocumentId;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "request_id")
    private Set<RequestVariationTypeEntity> variations = new HashSet<>();
    @Basic
    @Column(name = "expired")
    private Boolean expired;
    @Basic
    @Column(name = "critical")
    private Boolean critical;
    @Basic
    @Column(name = "expired_date")
    private Timestamp expiredDate;
    @Basic
    @Column(name = "expired_comment")
    private String expiredComment;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "request_id")
    private Set<GMPAuthorizationDetailsEntity> gmpAuthorizations = new HashSet<>();
    @JsonManagedReference
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, mappedBy = "registrationRequest")
    private GDPInspectionEntity gdpInspection;
    @Basic
    @Column(name = "reg_subject")
    private String regSubject;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "request_id")
    private Set<LaboratorReferenceStandardsEntity> laboratorReferenceStandards = new HashSet<>();
    @Basic
    @Column(name = "lab_included")
    private Boolean labIncluded;
    @Basic
    @Column(name = "lab_number")
    private String labNumber;
}
