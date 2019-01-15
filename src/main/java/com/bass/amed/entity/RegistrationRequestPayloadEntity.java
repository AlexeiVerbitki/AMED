package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "registration_request_payload", schema = "amed", catalog = "")
public class RegistrationRequestPayloadEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Column(name = "payload", columnDefinition = "mediumtext")
    private String payload;
    @Basic
    @Column(name = "registration_request_id")
    private Integer registrationRequestId;
    @Column(name = "payload_migr", columnDefinition = "mediumtext")
    private String payloadMigration;
}
