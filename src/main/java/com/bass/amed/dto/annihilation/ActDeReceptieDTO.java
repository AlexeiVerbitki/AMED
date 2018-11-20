package com.bass.amed.dto.annihilation;

import java.util.Date;

public class ActDeReceptieDTO
{
    private String nr;
    private String date;
    private String amedRepresentant;
    private String companyName;
    private String representatntName;
    private String expert;

    public String getNr()
    {
        return nr;
    }

    public void setNr(String nr)
    {
        this.nr = nr;
    }

    public String getDate()
    {
        return date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public String getAmedRepresentant()
    {
        return amedRepresentant;
    }

    public void setAmedRepresentant(String amedRepresentant)
    {
        this.amedRepresentant = amedRepresentant;
    }

    public String getCompanyName()
    {
        return companyName;
    }

    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
    }

    public String getRepresentatntName()
    {
        return representatntName;
    }

    public void setRepresentatntName(String representatntName)
    {
        this.representatntName = representatntName;
    }

    public String getExpert()
    {
        return expert;
    }

    public void setExpert(String expert)
    {
        this.expert = expert;
    }
}
