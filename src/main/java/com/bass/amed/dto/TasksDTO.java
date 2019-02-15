package com.bass.amed.dto;

import com.bass.amed.entity.NmRegisterCatalogCodesEntity;
import com.bass.amed.entity.ProcessNamesEntity;
import com.bass.amed.entity.RegistrationRequestStepsEntity;
import com.bass.amed.entity.RequestTypesEntity;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Data
public class TasksDTO implements Serializable
{
    private String requestCode;
    private String requestNumber;
    private Date startDateFrom;
    private Date startDateTo;
    private Integer comanyId;
    private Integer processId;
    private Integer processTypeId;
    private String stepCode;
    private String subject;
}
