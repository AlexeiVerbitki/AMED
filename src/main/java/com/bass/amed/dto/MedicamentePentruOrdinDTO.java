package com.bass.amed.dto;

import lombok.Data;

@Data
public class MedicamentePentruOrdinDTO
{
    private String name;
    private String pharmaceuticalForm;
    private String concentration;
    private String registrationNumber;
    private String status;
    private String dose;
    private String companyName;
    private String country;
    private Integer rowCounter;
}
