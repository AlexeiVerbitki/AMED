package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "medicament_annihilation", schema = "amed", catalog = "")
public class MedicamentAnnihilationEntity
{
    private Integer id;
    private Double quantity;
    private Integer uselessReasonId;
    private Integer annihilationModeId;
    private String paycheckNr;
    private Date paycheckDate;
    private Integer tax;
    private Integer paidTax;
    private Date paymentDate;
    private String note;

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
    @Column(name = "quantity")
    public Double getQuantity()
    {
        return quantity;
    }

    public void setQuantity(Double quantity)
    {
        this.quantity = quantity;
    }

    @Basic
    @Column(name = "useless_reason_id")
    public Integer getUselessReasonId()
    {
        return uselessReasonId;
    }

    public void setUselessReasonId(Integer uselessReasonId)
    {
        this.uselessReasonId = uselessReasonId;
    }

    @Basic
    @Column(name = "annihilation_mode_id")
    public Integer getAnnihilationModeId()
    {
        return annihilationModeId;
    }

    public void setAnnihilationModeId(Integer annihilationModeId)
    {
        this.annihilationModeId = annihilationModeId;
    }

    @Basic
    @Column(name = "paycheck_nr")
    public String getPaycheckNr()
    {
        return paycheckNr;
    }

    public void setPaycheckNr(String paycheckNr)
    {
        this.paycheckNr = paycheckNr;
    }

    @Basic
    @Column(name = "paycheck_date")
    public Date getPaycheckDate()
    {
        return paycheckDate;
    }

    public void setPaycheckDate(Date paycheckDate)
    {
        this.paycheckDate = paycheckDate;
    }

    @Basic
    @Column(name = "tax")
    public Integer getTax()
    {
        return tax;
    }

    public void setTax(Integer tax)
    {
        this.tax = tax;
    }

    @Basic
    @Column(name = "paid_tax")
    public Integer getPaidTax()
    {
        return paidTax;
    }

    public void setPaidTax(Integer paidTax)
    {
        this.paidTax = paidTax;
    }

    @Basic
    @Column(name = "payment_date")
    public Date getPaymentDate()
    {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate)
    {
        this.paymentDate = paymentDate;
    }

    @Basic
    @Column(name = "note")
    public String getNote()
    {
        return note;
    }

    public void setNote(String note)
    {
        this.note = note;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
        result = 31 * result + (uselessReasonId != null ? uselessReasonId.hashCode() : 0);
        result = 31 * result + (annihilationModeId != null ? annihilationModeId.hashCode() : 0);
        result = 31 * result + (paycheckNr != null ? paycheckNr.hashCode() : 0);
        result = 31 * result + (paycheckDate != null ? paycheckDate.hashCode() : 0);
        result = 31 * result + (tax != null ? tax.hashCode() : 0);
        result = 31 * result + (paidTax != null ? paidTax.hashCode() : 0);
        result = 31 * result + (paymentDate != null ? paymentDate.hashCode() : 0);
        result = 31 * result + (note != null ? note.hashCode() : 0);
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

        MedicamentAnnihilationEntity that = (MedicamentAnnihilationEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null)
        {
            return false;
        }
        if (uselessReasonId != null ? !uselessReasonId.equals(that.uselessReasonId) : that.uselessReasonId != null)
        {
            return false;
        }
        if (annihilationModeId != null ? !annihilationModeId.equals(that.annihilationModeId) : that.annihilationModeId != null)
        {
            return false;
        }
        if (paycheckNr != null ? !paycheckNr.equals(that.paycheckNr) : that.paycheckNr != null)
        {
            return false;
        }
        if (paycheckDate != null ? !paycheckDate.equals(that.paycheckDate) : that.paycheckDate != null)
        {
            return false;
        }
        if (tax != null ? !tax.equals(that.tax) : that.tax != null)
        {
            return false;
        }
        if (paidTax != null ? !paidTax.equals(that.paidTax) : that.paidTax != null)
        {
            return false;
        }
        if (paymentDate != null ? !paymentDate.equals(that.paymentDate) : that.paymentDate != null)
        {
            return false;
        }
        if (note != null ? !note.equals(that.note) : that.note != null)
        {
            return false;
        }

        return true;
    }
}
