package com.bass.amed.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ScheduledModuleResponse implements Serializable
{
    private boolean success;
    private String  jobId;
    private String  jobGroup;
    private String  message;
}
