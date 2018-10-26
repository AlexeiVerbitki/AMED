package com.bass.amed.dto;

import java.sql.Timestamp;

public class DocumentDTO
{
    private Timestamp date;
    private String name;
    private String path;
    private String email;
    private String docType;
    private Integer requestId;
    private Timestamp mainPageStartDate;
    private String username;

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public Timestamp getDate()
    {
        return date;
    }

    public void setDate(Timestamp date)
    {
        this.date = date;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getDocType()
    {
        return docType;
    }

    public void setDocType(String docType)
    {
        this.docType = docType;
    }

    public Integer getRequestId()
    {
        return requestId;
    }

    public void setRequestId(Integer requestId)
    {
        this.requestId = requestId;
    }

    public Timestamp getMainPageStartDate()
    {
        return mainPageStartDate;
    }

    public void setMainPageStartDate(Timestamp mainPageStartDate)
    {
        this.mainPageStartDate = mainPageStartDate;
    }

}
