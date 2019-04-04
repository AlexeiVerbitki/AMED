package com.bass.amed.dto.gdp;

import lombok.Data;

@Data
public class GDPCertificateDTO
{
    private String nr;
    private String date;
    private String genDir;
    private String wholesaleDistributor;
    private String distributionAddress;
    private String inspectingInBase;
    private String licenseSeries;
    private String licenseNr;
    private String licenseStartDate;
    private String licenseEndDate;
    private String autorizatedDistribution;
    private String certificateBasedOnTheInspection;
    private String lastInspectionDate;
    private String dateOfIssueCertificate;
    private String maximYearAfterInspection;
    private String restriction;
}
