package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "ct_report_sae_susar", schema = "amed", catalog = "")
public class CtReportSaeSusarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "clinicatl_trial_id")
    private Integer clinicalTrailsId;

    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;

    @Basic
    @Column(name = "register_type")
    private Byte registerType;

    @Basic
    @Column(name = "specific_report_type")
    private Byte specificReportType;

    @Basic
    @Column(name = "reporter")
    private String reporter;

    @Basic
    @Column(name = "report_level")
    private Byte reportLavel;

    @Basic
    @Column(name = "report_type")
    private String reportType;

    @Basic
    @Column(name = "study_id")
    private String studyId;

    @Basic
    @Column(name = "patient_id")
    private String patientId;

    @Basic
    @Column(name = "center_id")
    private String centerId;

    @Basic
    @Column(name = "casuality")
    private Byte casuality;

    @Basic
    @Column(name = "action_taken_drug")
    private String actionTakenDrug;

    @Basic
    @Column(name = "company_remarks")
    private String companyRemarks;

    @Basic
    @Column(name = "patient_initials")
    private String patientInitials;

    @Basic
    @Column(name = "date_of_birth")
    private Timestamp dateOfBirth;

    @Basic
    @Column(name = "age")
    private Byte age;

    @Basic
    @Column(name = "sex")
    private Byte sex;

    @Basic
    @Column(name = "reaction_on_set")
    private Timestamp reactionOnSet;

    @Basic
    @Column(name = "describe_reactions")
    private String describeReactions;

    @Basic
    @Column(name = "type_saesusar")
    private Byte typeSaesusar;

    @Basic
    @Column(name = "patient_died_date")
    private Timestamp patientDiedDate;

    @Basic
    @Column(name = "suspect_drug")
    private String suspectDrug;

    @Basic
    @Column(name = "daily_dose")
    private String dailyDose;

    @Basic
    @Column(name = "routes_of_admin")
    private String routesOfAdmin;

    @Basic
    @Column(name = "indication_for_use")
    private String indicationForUse;

    @Basic
    @Column(name = "therapy_date_from")
    private Timestamp therapyDateFrom;

    @Basic
    @Column(name = "therapy_date_to")
    private Timestamp therapyDateTo;

    @Basic
    @Column(name = "therapy_duration")
    private String therapyDuration;

    @Basic
    @Column(name = "reaction_abated")
    private Byte reactionAbated;

    @Basic
    @Column(name = "event_reappear")
    private Byte eventReappear;

    @Basic
    @Column(name = "conc_drug_dates")
    private String concDrugDates;

    @Basic
    @Column(name = "other_relevant_history")
    private String otherRelevantHistory;

    @Basic
    @Column(name = "name_adress_manufacturer")
    private String nameAdressManufacturer;

    @Basic
    @Column(name = "mfr_control_no")
    private String mfrControlNo;

    @Basic
    @Column(name = "date_manufact_received")
    private Timestamp dateManufactReceived;

    @Basic
    @Column(name = "report_source")
    private Byte reportSource;

    @Basic
    @Column(name = "this_report_date")
    private Timestamp thisReportDate;
}
