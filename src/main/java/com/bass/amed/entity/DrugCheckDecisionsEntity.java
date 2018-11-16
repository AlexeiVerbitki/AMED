package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "drug_check_decisions", schema = "amed", catalog = "")
public class DrugCheckDecisionsEntity
{
    private Integer id;
    private String protocolNr;
    private Date protocolDate;
    private Integer registrationRequestId;
    private Date paidDate;
    private Integer paycheckNr;
    private Date paycheckDate;
    private Integer drugCommiteId;
    private Date announcementDate;
    private Integer announcementMethodId;
    private Integer cpcdResponseNr;
    private Date cpcdResponseDate;

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
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
    @Column(name = "protocol_nr")
    public String getProtocolNr()
    {
        return protocolNr;
    }

    public void setProtocolNr(String protocolNr)
    {
        this.protocolNr = protocolNr;
    }

    @Basic
    @Column(name = "protocol_date")
    public Date getProtocolDate()
    {
        return protocolDate;
    }

    public void setProtocolDate(Date protocolDate)
    {
        this.protocolDate = protocolDate;
    }

    @Basic
    @Column(name = "registration_request_id")
    public Integer getRegistrationRequestId()
    {
        return registrationRequestId;
    }

    public void setRegistrationRequestId(Integer registrationRequestId)
    {
        this.registrationRequestId = registrationRequestId;
    }

    @Basic
    @Column(name = "paid_date")
    public Date getPaidDate()
    {
        return paidDate;
    }

    public void setPaidDate(Date paidDate)
    {
        this.paidDate = paidDate;
    }

    @Basic
    @Column(name = "paycheck_nr")
    public Integer getPaycheckNr()
    {
        return paycheckNr;
    }

    public void setPaycheckNr(Integer paycheckNr)
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
    @Column(name = "drug_commite_id")
    public Integer getDrugCommiteId()
    {
        return drugCommiteId;
    }

    public void setDrugCommiteId(Integer drugCommiteId)
    {
        this.drugCommiteId = drugCommiteId;
    }

    @Basic
    @Column(name = "announcement_date")
    public Date getAnnouncementDate()
    {
        return announcementDate;
    }

    public void setAnnouncementDate(Date announcementDate)
    {
        this.announcementDate = announcementDate;
    }

    @Basic
    @Column(name = "announcement_method_id")
    public Integer getAnnouncementMethodId()
    {
        return announcementMethodId;
    }

    public void setAnnouncementMethodId(Integer announcementMethodId)
    {
        this.announcementMethodId = announcementMethodId;
    }

    @Basic
    @Column(name = "cpcd_response_nr")
    public Integer getCpcdResponseNr()
    {
        return cpcdResponseNr;
    }

    public void setCpcdResponseNr(Integer cpcdResponseNr)
    {
        this.cpcdResponseNr = cpcdResponseNr;
    }

    @Basic
    @Column(name = "cpcd_response_date")
    public Date getCpcdResponseDate()
    {
        return cpcdResponseDate;
    }

    public void setCpcdResponseDate(Date cpcdResponseDate)
    {
        this.cpcdResponseDate = cpcdResponseDate;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (protocolNr != null ? protocolNr.hashCode() : 0);
        result = 31 * result + (protocolDate != null ? protocolDate.hashCode() : 0);
        result = 31 * result + (registrationRequestId != null ? registrationRequestId.hashCode() : 0);
        result = 31 * result + (paidDate != null ? paidDate.hashCode() : 0);
        result = 31 * result + (paycheckNr != null ? paycheckNr.hashCode() : 0);
        result = 31 * result + (paycheckDate != null ? paycheckDate.hashCode() : 0);
        result = 31 * result + (drugCommiteId != null ? drugCommiteId.hashCode() : 0);
        result = 31 * result + (announcementDate != null ? announcementDate.hashCode() : 0);
        result = 31 * result + (announcementMethodId != null ? announcementMethodId.hashCode() : 0);
        result = 31 * result + (cpcdResponseNr != null ? cpcdResponseNr.hashCode() : 0);
        result = 31 * result + (cpcdResponseDate != null ? cpcdResponseDate.hashCode() : 0);
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

        DrugCheckDecisionsEntity that = (DrugCheckDecisionsEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (protocolNr != null ? !protocolNr.equals(that.protocolNr) : that.protocolNr != null)
        {
            return false;
        }
        if (protocolDate != null ? !protocolDate.equals(that.protocolDate) : that.protocolDate != null)
        {
            return false;
        }
        if (registrationRequestId != null ? !registrationRequestId.equals(that.registrationRequestId) : that.registrationRequestId != null)
        {
            return false;
        }
        if (paidDate != null ? !paidDate.equals(that.paidDate) : that.paidDate != null)
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
        if (drugCommiteId != null ? !drugCommiteId.equals(that.drugCommiteId) : that.drugCommiteId != null)
        {
            return false;
        }
        if (announcementDate != null ? !announcementDate.equals(that.announcementDate) : that.announcementDate != null)
        {
            return false;
        }
        if (announcementMethodId != null ? !announcementMethodId.equals(that.announcementMethodId) : that.announcementMethodId != null)
        {
            return false;
        }
        if (cpcdResponseNr != null ? !cpcdResponseNr.equals(that.cpcdResponseNr) : that.cpcdResponseNr != null)
        {
            return false;
        }
        return cpcdResponseDate != null ? cpcdResponseDate.equals(that.cpcdResponseDate) : that.cpcdResponseDate == null;
    }
}
