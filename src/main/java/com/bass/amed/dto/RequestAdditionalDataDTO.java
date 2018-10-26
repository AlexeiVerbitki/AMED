package com.bass.amed.dto;

import java.util.Date;

public class RequestAdditionalDataDTO
{
    private Date requestDate;
    private String nrRequest;
    private String title;
    private String content;

    public Date getRequestDate()
    {
        return requestDate;
    }

    public void setRequestDate(Date requestDate)
    {
        this.requestDate = requestDate;
    }

    public String getNrRequest()
    {
        return nrRequest;
    }

    public void setNrRequest(String nrRequest)
    {
        this.nrRequest = nrRequest;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
    }
}
