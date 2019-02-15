package com.bass.amed.projection;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.SqlResultSetMapping;
import java.io.Serializable;
import java.util.Date;

public class TaskDetailsProjectionDTO implements Serializable {
    private Integer id;
    private String requestNumber;
    private Date startDate;
    private Date endDate;
    private String company;
    private String mandatedContact;
    private String step;
    private String navigationUrl;
    private Boolean expired;
    private Boolean critical;

    public TaskDetailsProjectionDTO(Integer id, String requestNumber, Date startDate, Date endDate, String company, String mandatedContact, String step, String navigationUrl, Boolean expired, Boolean critical) {
        this.id = id;
        this.requestNumber = requestNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.company = company;
        this.mandatedContact = mandatedContact;
        this.step = step;
        this.navigationUrl = navigationUrl;
        this.expired = expired == null ? Boolean.FALSE : expired;
        this.critical = critical == null ? Boolean.FALSE : critical;
    }

    public Integer getId() {
        return id;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public String getCompany() {
        return company;
    }

    public String getMandatedContact() {
        return mandatedContact;
    }

    public String getStep() {
        return step;
    }

    public String getNavigationUrl() {
        return navigationUrl;
    }

    public Boolean getExpired() {
        return expired;
    }

    public Boolean getCritical() {
        return critical;
    }

}
