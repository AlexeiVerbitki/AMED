package com.bass.amed.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class InterruptDetailsDTO
{
    private Integer requestId;
    private Timestamp startDate;
    private String username;
    private String reason;

}
