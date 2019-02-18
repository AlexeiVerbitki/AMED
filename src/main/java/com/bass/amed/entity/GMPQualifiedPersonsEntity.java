package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "gmp_qualified_persons", schema = "amed")
public class GMPQualifiedPersonsEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "last_name")
    private String lastName;
    @Basic
    @Column(name = "first_name")
    private String firstName;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "postal_code")
    private String postalCode;
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
    @Basic
    @Column(name = "statut")
    private String statut;
    @Basic
    @Column(name = "consultant_details")
    private String consultantDetails;
    @Basic
    @Column(name = "qualifications")
    private String qualifications;
    @Basic
    @Column(name = "experience")
    private String experience;
    @Basic
    @Column(name = "professional_associations")
    private String professionalAssociations;
    @Basic
    @Column(name = "name_function_subordinates")
    private String nameFunctionSubordinates;
    @Basic
    @Column(name = "scope_responsability")
    private String scopeResponsability;
    @Basic
    @Column(name = "function")
    private String function;
    @Basic
    @Column(name = "category")
    private String category;
}
