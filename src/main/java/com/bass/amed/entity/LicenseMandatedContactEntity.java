package com.bass.amed.entity;

import sun.plugin.util.UserProfile;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
@Table(name = "license_mandated_contact", schema = "amed", catalog = "")
public class LicenseMandatedContactEntity
{
    private Integer id;
    private String phoneNumber;
    private String email;
    private String requestPersonFirstname;
    private String requestPersonLastname;
    private String requestMandateNr;
    private Date requestMandateDate;
    private String newMandatedFirstname;
    private String newMandatedLastname;
    private String newMandatedNr;
    private Date newMandatedDate;
//    private LicensesEntity licensesEntity;
    private String newPhoneNumber;
    private String newEmail;
    private Integer registrationRequestId;

    @Id
    @Column(name = "id")
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "phone_number")
    public String getPhoneNumber()
    {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber)
    {
        this.phoneNumber = phoneNumber;
    }

    @Basic
    @Column(name = "email")
    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    @Basic
    @Column(name = "request_person_firstname")
    public String getRequestPersonFirstname()
    {
        return requestPersonFirstname;
    }

    public void setRequestPersonFirstname(String requestPersonFirstname)
    {
        this.requestPersonFirstname = requestPersonFirstname;
    }

    @Basic
    @Column(name = "request_person_lastname")
    public String getRequestPersonLastname()
    {
        return requestPersonLastname;
    }

    public void setRequestPersonLastname(String requestPersonLastname)
    {
        this.requestPersonLastname = requestPersonLastname;
    }

    @Basic
    @Column(name = "request_mandate_nr")
    public String getRequestMandateNr()
    {
        return requestMandateNr;
    }

    public void setRequestMandateNr(String requestMandateNr)
    {
        this.requestMandateNr = requestMandateNr;
    }

    @Basic
    @Column(name = "request_mandate_date")
    public Date getRequestMandateDate()
    {
        return requestMandateDate;
    }

    public void setRequestMandateDate(Date requestMandateDate)
    {
        this.requestMandateDate = requestMandateDate;
    }

    @Basic
    @Column(name = "new_mandated_firstname")
    public String getNewMandatedFirstname()
    {
        return newMandatedFirstname;
    }

    public void setNewMandatedFirstname(String newMandatedFirstname)
    {
        this.newMandatedFirstname = newMandatedFirstname;
    }

    @Basic
    @Column(name = "new_mandated_lastname")
    public String getNewMandatedLastname()
    {
        return newMandatedLastname;
    }

    public void setNewMandatedLastname(String newMandatedLastname)
    {
        this.newMandatedLastname = newMandatedLastname;
    }

    @Basic
    @Column(name = "new_mandated_nr")
    public String getNewMandatedNr()
    {
        return newMandatedNr;
    }

//    @OneToOne( mappedBy = "mandatedContact")
//    public LicensesEntity getLicensesEntity()
//    {
//        return licensesEntity;
//    }
//
//    public void setLicensesEntity(LicensesEntity licensesEntity)
//    {
//        this.licensesEntity = licensesEntity;
//    }

    public void setNewMandatedNr(String newMandatedNr)
    {
        this.newMandatedNr = newMandatedNr;
    }

    @Basic
    @Column(name = "new_mandated_date")
    public Date getNewMandatedDate()
    {
        return newMandatedDate;
    }

    public void setNewMandatedDate(Date newMandatedDate)
    {
        this.newMandatedDate = newMandatedDate;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseMandatedContactEntity that = (LicenseMandatedContactEntity) o;
        return id == that.id &&
                Objects.equals(phoneNumber, that.phoneNumber) &&
                Objects.equals(email, that.email) &&
                Objects.equals(requestPersonFirstname, that.requestPersonFirstname) &&
                Objects.equals(requestPersonLastname, that.requestPersonLastname) &&
                Objects.equals(requestMandateNr, that.requestMandateNr) &&
                Objects.equals(requestMandateDate, that.requestMandateDate) &&
                Objects.equals(newMandatedFirstname, that.newMandatedFirstname) &&
                Objects.equals(newMandatedLastname, that.newMandatedLastname) &&
                Objects.equals(newMandatedNr, that.newMandatedNr) &&
                Objects.equals(newMandatedDate, that.newMandatedDate);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, phoneNumber, email, requestPersonFirstname, requestPersonLastname, requestMandateNr, requestMandateDate, newMandatedFirstname, newMandatedLastname, newMandatedNr, newMandatedDate);
    }

    @Basic
    @Column(name = "new_phone_number")
    public String getNewPhoneNumber()
    {
        return newPhoneNumber;
    }

    public void setNewPhoneNumber(String newPhoneNumber)
    {
        this.newPhoneNumber = newPhoneNumber;
    }

    @Basic
    @Column(name = "new_email")
    public String getNewEmail()
    {
        return newEmail;
    }

    public void setNewEmail(String newEmail)
    {
        this.newEmail = newEmail;
    }

    @Basic
    @Column(name = "registration_request_id")
    public Integer getRegistrationRequestId()
    {
        return registrationRequestId;
    }

    public void setRegistrationRequestId(Integer registrationRequestId)
    {
        this.registrationRequestId = registrationRequestId;
    }
}
