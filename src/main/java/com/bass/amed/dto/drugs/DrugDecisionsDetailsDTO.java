package com.bass.amed.dto.drugs;

import com.bass.amed.entity.DrugImportExportDetailsEntity;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class DrugDecisionsDetailsDTO  {

    private String requestNumber;
    private Timestamp protocolDate;
    private String resPerson;
    private String companyValue;
    private String street;
    private String locality;
    private String state;
    private Timestamp dataExp;
    private boolean precursor;
    private boolean psihotrop;
    private boolean stupefiant;
    private String authorizationType;
    private String partner;
    private String custom;
    private String localityId;
    private String legalAddress;
    List<DrugImportExportDetailsEntity> details = new ArrayList<>();
    private Integer language; //0- ro, 1- ru, 2 - en
    private boolean usedScoupe; // true - medicina, false- tehnic
    private String  rejectReason;
    private Date    requestDate;
    private String signPerson;

}
