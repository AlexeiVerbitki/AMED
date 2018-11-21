package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_organization_bank_accounts", schema = "amed", catalog = "")
public class NmOrganizationBankAccountsEntity
{
    private Integer id;
    private Integer organizationId;
    private Integer bankAccountId;

    @Id
    @Column(name = "id", nullable = false)
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "organization_id")
    public Integer getOrganizationId()
    {
        return organizationId;
    }

    public void setOrganizationId(Integer organizationId)
    {
        this.organizationId = organizationId;
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
        result = 31 * result + (organizationId != null ? organizationId.hashCode() : 0);
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

        NmOrganizationBankAccountsEntity that = (NmOrganizationBankAccountsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (organizationId != null ? !organizationId.equals(that.organizationId) : that.organizationId != null)
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
