package com.bass.amed.dto.gmp;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class GMPDetailsDTO
{
    private String orderNr;
    private String requestNr;
    private Date requestDate;
    private String expertsLeader;
    private String expertsLeaderFunction;
    private String companyName;
    private String companyAddress;
    private Date firstInspectionDate;
    private String inspectorsName;
    private String autorizationNr;
    private String distributionCompanyName;
    private String distributionCompanyAddress;
    private String stagesOfManufacture;
    private Boolean medicamentHumanUse;
    private Boolean medicamentClinicalInvestigation;
    private Boolean medicamentVeterinary;
    private List<GMPLaboratorDTO> laboratories;
    private List<GMPAuthorizedMedicamentDTO> autorizatedMedicamentsForProduction;
    private List<String> qualifiedPersons;
    private List<String> responsiblePersons;
    private List<String> qualityControlPersons;
    private List<GMPMedDTO> preparateAseptic;
    private List<GMPMedDTO> sterilizateFinal;
    private List<GMPMedDTO> certificareaSeriei;
    private List<GMPMedDTO> produseNesterile;
    private List<GMPMedDTO> produseNesterileNumaiCertificareaSeriei;
    private List<GMPMedDTO> medicamenteBiologice;
    private List<GMPMedDTO> medicamenteBiologiceNumaiCertificareaSeriei;
    private List<GMPMedDTO> manufactures;
    private List<GMPMedDTO> substanceSterilization;
    private List<GMPMedDTO> otherManufactures;
    private List<GMPMedDTO> ambalarePrimara;
    private List<GMPMedDTO> ambalareSecundara;
    private List<GMPMedDTO> qualityControlTests;
    private Date inspectionDate;
    private String aplicationDomainOfLastInspection;
}
