package com.bass.amed.dto.medicament.registration;

import com.bass.amed.entity.*;
import lombok.Data;

import java.util.List;

@Data
public class MedicamentDetailsCartelaDTO {

    private String commercialName;
    private String dose;
    private String atcCode;
    private NmPharmaceuticalFormsEntity pharmaceuticalForm;
    private GroupDTO group;
    private GroupDTO prescription;
    private NmInternationalMedicamentNameEntity internationalMedicamentName;
    private Integer termsOfValidity;
    private Boolean originale;
    private Boolean orphan;
    private List<NmMedicamentTypeEntity> medTypesValues;
    private NmManufacturesEntity authorizationHolder;
    private List<DivisionDTO> divisions;
    private List<MedicamentActiveSubstancesEntity> activeSubstancesTable;
    private List<MedicamentAuxiliarySubstancesEntity> auxiliarySubstancesTable;
    private List<MedicamentManufactureEntity> manufacturesTable;
}
