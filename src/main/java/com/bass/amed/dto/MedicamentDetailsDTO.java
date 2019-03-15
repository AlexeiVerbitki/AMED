package com.bass.amed.dto;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "medicament", schema = "amed")
public class MedicamentDetailsDTO
{
    @Id
    private Integer id;
    private String code;
    private String commercialName;
    private String atcCode;
    private String registerNumber;
    private String registrationDate;
    private String division;
    private String volume;
    private String volumeQuantityMeasurement;
    private String expirationDate;
    private String authorizationHolderDescription;

}
