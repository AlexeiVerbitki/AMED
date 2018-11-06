package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "receipts", schema = "amed", catalog = "")
public class ReceiptsEntity {
    private Integer id;
    private String receiptNumber;
    private Timestamp date;
    private ServiceChargesEntity serviceCharge;
    private Double amount;
    private Boolean sP;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "receipt_number")
    public String getReceiptNumber()
    {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber)
    {
        this.receiptNumber = receiptNumber;
    }

    @Basic
    @Column(name = "date")
    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "service_charge_id" )
    public ServiceChargesEntity getServiceCharge()
    {
        return serviceCharge;
    }

    public void setServiceCharge(ServiceChargesEntity serviceCharge)
    {
        this.serviceCharge = serviceCharge;
    }

    @Basic
    @Column(name = "amount")
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    @Basic
    @Column(name = "supplementary_payment")
    public Boolean getsP()
    {
        return sP;
    }

    public void setsP(Boolean sP)
    {
        this.sP = sP;
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

        ReceiptsEntity that = (ReceiptsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (receiptNumber != null ? !receiptNumber.equals(that.receiptNumber) : that.receiptNumber != null)
        {
            return false;
        }
        if (date != null ? !date.equals(that.date) : that.date != null)
        {
            return false;
        }
        if (serviceCharge != null ? !serviceCharge.equals(that.serviceCharge) : that.serviceCharge != null)
        {
            return false;
        }
        if (amount != null ? !amount.equals(that.amount) : that.amount != null)
        {
            return false;
        }
        return sP != null ? sP.equals(that.sP) : that.sP == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (receiptNumber != null ? receiptNumber.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (serviceCharge != null ? serviceCharge.hashCode() : 0);
        result = 31 * result + (amount != null ? amount.hashCode() : 0);
        result = 31 * result + (sP != null ? sP.hashCode() : 0);
        return result;
    }
}
