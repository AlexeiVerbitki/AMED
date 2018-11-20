package com.bass.amed.dto;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
public class PricesDTO implements Serializable {
    public PricesDTO() {

    }

    public PricesDTO(Integer id, String requestNumber, String medicamentType, String priceType, String medicamentCode, String step, String assignedPerson, Date startDate, Date endDate) {
        this();
        this.id = id;
        this.requestNumber = requestNumber;
        this.medicamentType = medicamentType;
        this.priceType = priceType;
        this.medicamentCode = medicamentCode;
        this.currentStep = step;
        this.assignedPerson = assignedPerson;
        this.startDate = startDate;
        this.endDate = endDate;
    }


    private String medicament;
    private Integer id;
    private String requestNumber;
    private String medicamentType;
    private String priceType;
    private String medicamentCode;
    private String currentStep;
    private String assignedPerson;
    private String folderNr;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date startDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date endDate;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }

    public String getMedicament() {
        return medicament;
    }

    public void setMedicament(String medicament) {
        this.medicament = medicament;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public void setCurrentStep(String step) {
        this.currentStep = step;
    }

    public String getMedicamentType() {
        return medicamentType;
    }

    public void setMedicamentType(String medicamentType) {
        this.medicamentType = medicamentType;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber) {
        this.requestNumber = requestNumber;
    }

    public String getMedicamentCode() {
        return medicamentCode;
    }

    public void setMedicamentCode(String medicamentCode) {
        this.medicamentCode = medicamentCode;
    }

    public String getCurrentStep() {
        return currentStep;
    }

    public String getAssignedPerson() {
        return assignedPerson;
    }

    public void setAssignedPerson(String assignedPerson) {
        this.assignedPerson = assignedPerson;
    }

    public String getFolderNr() {
        return folderNr;
    }

    public void setFolderNr(String folderNr) {
        this.folderNr = folderNr;
    }

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
