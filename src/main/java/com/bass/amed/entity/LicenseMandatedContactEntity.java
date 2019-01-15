package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Data
@Entity
@Table(name = "license_mandated_contact", schema = "amed")
public class LicenseMandatedContactEntity
{
    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Integer id;
    @Basic
    @Column(name = "phone_number")
    private String phoneNumber;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "request_person_firstname")
    private String requestPersonFirstname;
    @Basic
    @Column(name = "request_person_lastname")
    private String requestPersonLastname;
    @Basic
    @Column(name = "request_mandate_nr")
    private String requestMandateNr;
    @Basic
    @Column(name = "request_mandate_date")
    private Date requestMandateDate;
    @Basic
    @Column(name = "new_mandated_firstname")
    private String newMandatedFirstname;
    @Basic
    @Column(name = "new_mandated_lastname")
    private String newMandatedLastname;
    @Basic
    @Column(name = "new_mandated_nr")
    private String newMandatedNr;
    @Basic
    @Column(name = "new_mandated_date")
    private Date newMandatedDate;
    @Basic
    @Column(name = "new_phone_number")
    private String newPhoneNumber;
    @Basic
    @Column(name = "new_email")
    private String newEmail;
    @Basic
    @Column(name = "license_detail_id")
    private Integer licenseDetailId;
}
