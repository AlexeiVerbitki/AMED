package com.bass.amed.dto;

import com.bass.amed.entity.ProcessNamesEntity;
import com.bass.amed.entity.RegistrationRequestStepsEntity;
import com.bass.amed.entity.RequestTypesEntity;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Data
public class TasksDTO implements Serializable
{
    private Integer id;
    private String requestNumber;
    private ProcessNamesEntity request;
    private RequestTypesEntity requestType;
    private String assignedPerson;
    private Date startDate;
    private Date endDate;
    private RegistrationRequestStepsEntity step;


}
