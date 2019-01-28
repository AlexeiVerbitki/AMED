package com.bass.amed.projection;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class AuditProjection implements Serializable
{
    private String field;
    private String oldValue;
    private String newValue;
    private String action;
    private String user;
    private Date   datetime;
    private String category;
    private String subcategory;

    public AuditProjection(String field, String oldValue, String newValue, String action, String user, Date datetime, String category, String subcategory)
    {
        this.field = field;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.action = action;
        this.user = user;
        this.datetime = datetime;
        this.category = category;
        this.subcategory = subcategory;
    }

    public AuditProjection()
    {
    }
}
