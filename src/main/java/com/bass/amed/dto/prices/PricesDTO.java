package com.bass.amed.dto.prices;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@Entity
public class PricesDTO implements Serializable {
    public PricesDTO() {
    }

    private String medicament;
    @Id
    private Integer id;
    private String requestNumber;
    private String price;
    private String orderNr;
    private String mdlValue;
    private String currency;
    private String division;
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
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date expirationDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date orderApprovDate;

}
