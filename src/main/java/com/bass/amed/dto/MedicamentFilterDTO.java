package com.bass.amed.dto;

import com.bass.amed.entity.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class MedicamentFilterDTO implements Serializable
{
    private String code;
    private String commercialName;
    private String atcCode;
    private String registerNumber;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date registrationDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date registrationDateTo;
    private NmInternationalMedicamentNameEntity internationalName;
    private NmPharmaceuticalFormTypesEntity pharmaceuticalFormType;
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;
    private NmManufacturesEntity authorizationHolder;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date expirationDateFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date expirationDateTo;
    private NmMedicamentTypeEntity type;
    private NmMedicamentGroupEntity group;
    private Integer prescription;
    private Integer terms;
    private String requestNumber;
    private String division;
    private NmManufacturesEntity manufacture;
    private List<NmActiveSubstancesEntity> activeSubstances;
    private Boolean allSA;
    private Boolean atLeastOneSA;
    private Boolean expiratedMedicaments;

    public MedicamentFilterDTO()
    {

    }

}
