package com.bass.amed.dto;

import lombok.Data;

import java.util.Date;

@Data
public class RequestAdditionalDataDTO
{
    private Date requestDate;
    private String nrRequest;
    private String title;
    private String content;
    private String nrDoc;
    private String responsiblePerson;
    private String companyName;
    private String country;
    private String address;
    private String phoneNumber;
    private String email;
    private String message;
    private String function;
    private String signerName;
}
