package com.bass.amed.projection;

import java.util.Date;


public class TaskDetailsProjectionDTO
{
    private Integer id;
    private String requestNumber;
    private Date startDate;
    private Date endDate;
    private String processName;
    private String requestType;
    private String step;
    private String navigationUrl;
    private String username;
    private String currentStep;
    private Boolean expired;
    private Boolean critical;

    public TaskDetailsProjectionDTO(Integer id, String requestNumber, Date startDate, Date endDate, String currentStep, Boolean expired, Boolean critical, String processName, String requestType, String step, String navigationUrl, String username)
    {
        this.id = id;
        this.requestNumber = requestNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.processName = processName;
        this.requestType = requestType;
        this.step = step;
        this.navigationUrl = navigationUrl;
        this.username = username;
        this.currentStep = currentStep;
        this.expired = expired;
        this.critical = critical;
    }

    public Integer getId()
    {
        return id;
    }

    public String getRequestNumber()
    {
        return requestNumber;
    }

    public Date getStartDate()
    {
        return startDate;
    }

    public Date getEndDate()
    {
        return endDate;
    }

    public String getProcessName()
    {
        return processName;
    }

    public String getRequestType()
    {
        return requestType;
    }

    public Boolean getExpired() { return expired; }

    public Boolean getCritical() { return critical; }

    public String getStep()
    {
        return step;
    }

    public String getNavigationUrl()
    {
        return navigationUrl;
    }

    public String getUsername()
    {
        return username;
    }

    public String getCurrentStep() { return currentStep; }
}
