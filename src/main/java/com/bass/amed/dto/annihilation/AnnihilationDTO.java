package com.bass.amed.dto.annihilation;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class AnnihilationDTO implements Serializable
{
    private String idno;
    private Date fromDate;
    private Date toDate;
}
