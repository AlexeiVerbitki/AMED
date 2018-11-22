package com.bass.amed.dto;

import lombok.Data;

import java.util.Date;

@Data
public class RequestAdditionalDataDTO
{
    private Date requestDate;
    private String nrRequest;
    private String title;
    private String content;

}
