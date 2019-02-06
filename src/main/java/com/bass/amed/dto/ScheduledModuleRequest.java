package com.bass.amed.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;


@Data
public class ScheduledModuleRequest implements Serializable
{
    private String email;
    private String mailBody;
    private LocalDateTime expirationDateTime;
    private String criticalMethodName;
    private String expiredMethodName;
    private Integer requestId;
    private String requestNumber;
    private Integer entityId;
}
