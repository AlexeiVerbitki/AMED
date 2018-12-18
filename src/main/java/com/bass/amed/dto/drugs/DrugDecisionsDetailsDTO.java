package com.bass.amed.dto.drugs;

import com.bass.amed.entity.MedicamentEntity;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
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
    List<MedicamentEntity> medicaments = new ArrayList<>();

}
