package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_economic_agent_contact_info", schema = "amed", catalog = "")
public class NmEconomicAgentContactInfoEntity
{
    private Integer id;
    private Integer economicAgentId;
    private String phonenumbers;

    @Id
    @Column(name = "id")
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "economic_agent_id")
    public Integer getEconomicAgentId()
    {
        return economicAgentId;
    }

    public void setEconomicAgentId(Integer economicAgentId)
    {
        this.economicAgentId = economicAgentId;
    }

    @Basic
    @Column(name = "phonenumbers")
    public String getPhonenumbers()
    {
        return phonenumbers;
    }

    public void setPhonenumbers(String phonenumbers)
    {
        this.phonenumbers = phonenumbers;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (economicAgentId != null ? economicAgentId.hashCode() : 0);
        result = 31 * result + (phonenumbers != null ? phonenumbers.hashCode() : 0);
        return result;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (o == null || getClass() != o.getClass())
        {
            return false;
        }

        NmEconomicAgentContactInfoEntity that = (NmEconomicAgentContactInfoEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (economicAgentId != null ? !economicAgentId.equals(that.economicAgentId) : that.economicAgentId != null)
        {
            return false;
        }
        if (phonenumbers != null ? !phonenumbers.equals(that.phonenumbers) : that.phonenumbers != null)
        {
            return false;
        }

        return true;
    }
}
