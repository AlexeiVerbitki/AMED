package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_manufacture_bank_accounts", schema = "amed", catalog = "")
public class NmManufactureBankAccountsEntity
{
    private Integer id;
    private Integer manufactureId;
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
    @Column(name = "manufacture_id")
    public Integer getManufactureId()
    {
        return manufactureId;
    }

    public void setManufactureId(Integer manufactureId)
    {
        this.manufactureId = manufactureId;
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
        result = 31 * result + (manufactureId != null ? manufactureId.hashCode() : 0);
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

        NmManufactureBankAccountsEntity that = (NmManufactureBankAccountsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (manufactureId != null ? !manufactureId.equals(that.manufactureId) : that.manufactureId != null)
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
