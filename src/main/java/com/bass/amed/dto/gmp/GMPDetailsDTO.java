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
    private List<GMPMedDTO> preparateAsepticMedicamenteClinice;
    private List<GMPMedDTO> sterilizateFinal;
    private List<GMPMedDTO> sterilizateFinalMedicamenteClinice;
    private List<GMPMedDTO> certificareaSeriei;
    private List<GMPMedDTO> certificareaSerieiMedicamenteClinice;
    private List<GMPMedDTO> produseNesterile;
    private List<GMPMedDTO> produseNesterileMedicamenteClinice;
    private List<GMPMedDTO> produseNesterileNumaiCertificareaSeriei;
    private List<GMPMedDTO> produseNesterileNumaiCertificareaSerieiMedicamenteClinice;
    private List<GMPMedDTO> medicamenteBiologice;
    private List<GMPMedDTO> medicamenteBiologiceMedicamenteClinice;
    private List<GMPMedDTO> medicamenteBiologiceNumaiCertificareaSeriei;
    private List<GMPMedDTO> medicamenteBiologiceNumaiCertificareaSerieiMedicamenteClinice;
    private List<GMPMedDTO> manufactures;
    private List<GMPMedDTO> manufacturesMedicamenteClinice;
    private List<GMPMedDTO> substanceSterilization;
    private List<GMPMedDTO> substanceSterilizationMedicamenteClinice;
    private List<GMPMedDTO> otherManufactures;
    private List<GMPMedDTO> otherManufacturesMedicamenteClinice;
    private List<GMPMedDTO> ambalarePrimara;
    private List<GMPMedDTO> ambalarePrimaraMedicamenteClinice;
    private List<GMPMedDTO> ambalareSecundara;
    private List<GMPMedDTO> ambalareSecundaraMedicamenteClinice;
    private List<GMPMedDTO> qualityControlTests;
    private List<GMPMedDTO> qualityControlTestsMedicamenteClinice;
    private Date inspectionDate;
    private String aplicationDomainOfLastInspection;
    private String certificateNr;
    private Date orderDate;
    private String licenseSeries;
    private String licenseNr;
    private Date licenseDate;
    private Date autorizationDate;
    private List<GMPMedDTO> qualityControlTestsImport;
    private Boolean preparateAsepticImport;
    private Boolean sterilizateFinalImport;
    private Boolean produseNesterileImport;
    private List<GMPMedDTO> medicamenteBiologiceImport;
    private List<GMPMedDTO> otherImports;
}
