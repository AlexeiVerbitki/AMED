package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_bank_accounts", schema = "amed", catalog = "")
public class NmBankAccountsEntity
{
    private Integer id;
    private String code;
    private String description;
    private String banknumber;
    private Integer bankId;
    private Integer currencyId;
    private String treasuryCode;
    private Integer correspondentBankId;
    private String correspondentInfo;

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
    @Column(name = "code")
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "description")
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @Basic
    @Column(name = "banknumber")
    public String getBanknumber()
    {
        return banknumber;
    }

    public void setBanknumber(String banknumber)
    {
        this.banknumber = banknumber;
    }

    @Basic
    @Column(name = "bank_id")
    public Integer getBankId()
    {
        return bankId;
    }

    public void setBankId(Integer bankId)
    {
        this.bankId = bankId;
    }

    @Basic
    @Column(name = "currency_id")
    public Integer getCurrencyId()
    {
        return currencyId;
    }

    public void setCurrencyId(Integer currencyId)
    {
        this.currencyId = currencyId;
    }

    @Basic
    @Column(name = "treasury_code")
    public String getTreasuryCode()
    {
        return treasuryCode;
    }

    public void setTreasuryCode(String treasuryCode)
    {
        this.treasuryCode = treasuryCode;
    }

    @Basic
    @Column(name = "correspondent_bank_id")
    public Integer getCorrespondentBankId()
    {
        return correspondentBankId;
    }

    public void setCorrespondentBankId(Integer correspondentBankId)
    {
        this.correspondentBankId = correspondentBankId;
    }

    @Basic
    @Column(name = "correspondent_info")
    public String getCorrespondentInfo()
    {
        return correspondentInfo;
    }

    public void setCorrespondentInfo(String correspondentInfo)
    {
        this.correspondentInfo = correspondentInfo;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (banknumber != null ? banknumber.hashCode() : 0);
        result = 31 * result + (bankId != null ? bankId.hashCode() : 0);
        result = 31 * result + (currencyId != null ? currencyId.hashCode() : 0);
        result = 31 * result + (treasuryCode != null ? treasuryCode.hashCode() : 0);
        result = 31 * result + (correspondentBankId != null ? correspondentBankId.hashCode() : 0);
        result = 31 * result + (correspondentInfo != null ? correspondentInfo.hashCode() : 0);
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

        NmBankAccountsEntity that = (NmBankAccountsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (code != null ? !code.equals(that.code) : that.code != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        if (banknumber != null ? !banknumber.equals(that.banknumber) : that.banknumber != null)
        {
            return false;
        }
        if (bankId != null ? !bankId.equals(that.bankId) : that.bankId != null)
        {
            return false;
        }
        if (currencyId != null ? !currencyId.equals(that.currencyId) : that.currencyId != null)
        {
            return false;
        }
        if (treasuryCode != null ? !treasuryCode.equals(that.treasuryCode) : that.treasuryCode != null)
        {
            return false;
        }
        if (correspondentBankId != null ? !correspondentBankId.equals(that.correspondentBankId) : that.correspondentBankId != null)
        {
            return false;
        }
        if (correspondentInfo != null ? !correspondentInfo.equals(that.correspondentInfo) : that.correspondentInfo != null)
        {
            return false;
        }

        return true;
    }
}
