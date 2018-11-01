package com.bass.amed.dto;

import java.sql.Timestamp;

public class InterruptDetailsDTO
{
    private Integer requestId;
    private Timestamp startDate;
    private String username;
    private String reason;

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public Integer getRequestId()
    {
        return requestId;
    }

    public void setRequestId(Integer requestId)
    {
        this.requestId = requestId;
    }

    public Timestamp getStartDate()
    {
        return startDate;
    }

    public void setStartDate(Timestamp startDate)
    {
        this.startDate = startDate;
    }

    public String getReason()
    {
        return reason;
    }

    public void setReason(String reason)
    {
        this.reason = reason;
    }
}
