package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Data
@Table(name = "clinic_trail_notification", schema = "amed", catalog = "")
public class ClinicTrailNotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;

    @Basic
    @Column(name = "clinical_trails_id")
    private Integer clinicalTrialsEntityId;

    @OneToOne
    @JoinColumn(name = "notification_type_id")
    private ClinicTrailNotificationTypeEntity clinicTrailNotificationTypeEntity;

    @Basic
    @Column(name = "title")
    private String title;

    @Basic
    @Column(name = "status", nullable = true, length = 1)
    private String status;
}