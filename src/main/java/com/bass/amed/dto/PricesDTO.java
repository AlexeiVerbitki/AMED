package com.bass.amed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@Entity
public class PricesDTO implements Serializable
{
    private String medicament;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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
    public PricesDTO()
    {

    }

}
