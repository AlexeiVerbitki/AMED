package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_economic_agent_bank_accounts", schema = "amed", catalog = "")
public class NmEconomicAgentBankAccountsEntity
{
    private Integer id;
    private Integer economicAgentId;
    private Integer bankAccountId;

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
    @Column(name = "bank_account_id")
    public Integer getBankAccountId()
    {
        return bankAccountId;
    }

    public void setBankAccountId(Integer bankAccountId)
    {
        this.bankAccountId = bankAccountId;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (economicAgentId != null ? economicAgentId.hashCode() : 0);
        result = 31 * result + (bankAccountId != null ? bankAccountId.hashCode() : 0);
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

        NmEconomicAgentBankAccountsEntity that = (NmEconomicAgentBankAccountsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (economicAgentId != null ? !economicAgentId.equals(that.economicAgentId) : that.economicAgentId != null)
        {
            return false;
        }
        if (bankAccountId != null ? !bankAccountId.equals(that.bankAccountId) : that.bankAccountId != null)
        {
            return false;
        }

        return true;
    }
}
