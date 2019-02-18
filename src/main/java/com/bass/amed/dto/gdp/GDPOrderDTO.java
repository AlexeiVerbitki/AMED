package com.bass.amed.dto.gdp;

import lombok.Data;

@Data
public class GDPOrderDTO
{
    private String nr;
    private String date;
    private String genDir;
    private String requestNr;
    private String requestDate;
    private String companyName;
    private String registeredLetterNr;
    private String registeredLetterDate;
    private String expertsLeader;
    private String expertsLeaderFuncion;
    private String expertsLeaderInspectorat;
    private String inspectorsNameFunction;
}
