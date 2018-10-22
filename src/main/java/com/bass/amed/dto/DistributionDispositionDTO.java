package com.bass.amed.dto;

import java.util.Date;

public class DistributionDispositionDTO
{
    private Date dispositionDate;
    private String nrDisposition;
    private String path;

    public Date getDispositionDate()
    {
        return dispositionDate;
    }

    public void setDispositionDate(Date dispositionDate)
    {
        this.dispositionDate = dispositionDate;
    }

    public String getNrDisposition()
    {
        return nrDisposition;
    }

    public void setNrDisposition(String nrDisposition)
    {
        this.nrDisposition = nrDisposition;
    }

    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
    }
}
