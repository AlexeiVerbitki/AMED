package com.bass.amed.dto;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Entity
public class SimilarMedicamentDTO implements Serializable
{

    private Integer id;
    private String name;
    private String code;
    private String internationalName;
    private String country;
    private String manufacture;
    private String dose;
    private String pharmaceuticalForm;
    private String division;
    @Id
    private Integer priceId;
    private BigDecimal mdlValue;
    private BigDecimal price;
    private String currency;
    private Integer pharmaceuticalFormId;
}
