package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "registration_request_mandated_contact", schema = "amed")
public class RegistrationRequestMandatedContactEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "mandated_lastname")
    private String mandatedLastname;
    @Basic
    @Column(name = "mandated_firstname")
    private String mandatedFirstname;
    @Basic
    @Column(name = "phone_number")
    private String phoneNumber;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "request_mandate_nr")
    private String requestMandateNr;
    @Basic
    @Column(name = "request_mandate_date")
    private Timestamp requestMandateDate;

}
