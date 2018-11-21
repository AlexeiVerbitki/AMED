package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "registration_request_history", schema = "amed")
public class RegistrationRequestHistoryEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "start_date", nullable = true)
    private Timestamp startDate;
    @Basic
    @Column(name = "end_date", nullable = true)
    private Timestamp endDate;
    @Basic
    @Column(name = "username", nullable = true, length = 100)
    private String username;
    @Basic
    @Column(name = "step", nullable = true, length = 2)
    private String step;
    @Basic
    @Column(name = "registration_request_id", nullable = true)
    private Integer registrationRequestId;


}
