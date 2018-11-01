package com.bass.amed.dto;

import com.bass.amed.entity.ProcessNamesEntity;
import com.bass.amed.entity.RegistrationRequestStepsEntity;
import com.bass.amed.entity.RequestTypesEntity;

import java.io.Serializable;
import java.util.Date;

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

    public Integer getId()
    {
        return id;
    }


    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getRequestNumber()
    {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber)
    {
        this.requestNumber = requestNumber;
    }

    public ProcessNamesEntity getRequest()
    {
        return request;
    }

    public void setRequest(ProcessNamesEntity request)
    {
        this.request = request;
    }

    public RequestTypesEntity getRequestType()
    {
        return requestType;
    }

    public void setRequestType(RequestTypesEntity requestType)
    {
        this.requestType = requestType;
    }

    public String getAssignedPerson()
    {
        return assignedPerson;
    }

    public void setAssignedPerson(String assignedPerson)
    {
        this.assignedPerson = assignedPerson;
    }

    public RegistrationRequestStepsEntity getStep()
    {
        return step;
    }

    public void setStep(RegistrationRequestStepsEntity step)
    {
        this.step = step;
    }

    public Date getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Date startDate)
    {
        this.startDate = startDate;
    }

    public Date getEndDate()
    {
        return endDate;
    }

    public void setEndDate(Date endDate)
    {
        this.endDate = endDate;
    }
}
