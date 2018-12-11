package com.bass.amed.projection;

import java.io.Serializable;
import java.util.Date;

public class LicenseProjection implements Serializable
{
    private Integer licenseId;
    private String nr;
    private String serialNr;
    private Date releaseDate;
    private Date expirationDate;
    private String status;
    private String idno;


    public LicenseProjection(Integer licenseId, String nr, String serialNr, Date releaseDate, Date expirationDate, String status, String idno)
    {
        this.licenseId = licenseId;
        this.nr = nr;
        this.serialNr = serialNr;
        this.releaseDate = releaseDate;
        this.expirationDate = expirationDate;
        this.status = status;
        this.idno = idno;
    }

    public Integer getLicenseId()
    {
        return licenseId;
    }

    public String getNr()
    {
        return nr;
    }

    public String getSerialNr()
    {
        return serialNr;
    }

    public Date getReleaseDate()
    {
        return releaseDate;
    }

    public Date getExpirationDate()
    {
        return expirationDate;
    }

    public String getStatus()
    {
        return status;
    }

    public String getIdno()
    {
        return idno;
    }
}
