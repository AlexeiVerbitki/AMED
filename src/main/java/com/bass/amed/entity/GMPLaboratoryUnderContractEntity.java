package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_laboratory_under_contract", schema = "amed")
public class GMPLaboratoryUnderContractEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "postal_code")
    private String postalCode;
    @Basic
    @Column(name = "contact_name")
    private String contactName;
    @Basic
    @Column(name = "type_of_analysis")
    private String typeOfAnalysis;
    @Basic
    @Column(name = "phone_number")
    private String phoneNumber;
    @Basic
    @Column(name = "fax")
    private String fax;
    @Basic
    @Column(name = "mobile_phone")
    private String mobilePhone;
    @Basic
    @Column(name = "email")
    private String email;
}
