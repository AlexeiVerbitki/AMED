package com.bass.amed.dto.medicament.registration;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class MedicamentHistoryDTO {
    private String requestType;
    private String requestNumber;
    private Integer registrationNumber;
    private Timestamp date;
    private String motiv;
    private String certificat;
    private String ordinDeAutorizare;
    private String ordinDeIntrerupere;
}
