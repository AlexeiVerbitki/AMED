package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "registration_request_jobs", schema = "amed")
public class RegistrationRequestJobEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "request_id")
    private Integer requestId;
    @Basic
    @Column(name = "critical_method")
    private String criticalMethod;
    @Basic
    @Column(name = "expired_method")
    private String expiredMethod;
    @Basic
    @Column(name = "start_date")
    private LocalDateTime startDate;
    @Basic
    @Column(name = "pause_date")
    private LocalDateTime pauseDate;
    @Basic
    @Column(name = "scheduled_days_number")
    private Integer scheduledDaysNumber;


}
