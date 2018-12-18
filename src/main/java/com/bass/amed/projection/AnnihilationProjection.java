package com.bass.amed.projection;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class AnnihilationProjection implements Serializable
{
    private Integer annihilationId;
    private String ecAgentLongName;
    private String medicamentName;
    private Double quantity;
    private String uselessReason;
    private String seria;
    private String destructionMethod;
    private Date endDate;

}
