package com.bass.amed.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class AuthorizationCertificateDTO
{
    private String medName;
    private String pharmaceuticalPhorm;
    private String dose;
    private String divisions;
    private List<String> activeSubstances;
    private String authorizationHolder;
    private String authorizationHolderCountry;
    private String manufacture;
    private String manufactureCountry;
    private String atcCode;
    private String termsOfValidity;
    private String registrationNumber;
    private Date registrationDate;
    private String orderNumber;
    private Date orderDate;
    private String requestNumber;
    private Date requestDate;
    private String variationTip;
    private Integer requestId;
}
