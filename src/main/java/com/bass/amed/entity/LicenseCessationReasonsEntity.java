package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "license_cessation_reasons", schema = "amed", catalog = "")
public class LicenseCessationReasonsEntity
{
    private int id;
    private String reason;
    private Timestamp dateAnnounceCpcd;
    private Integer methodAnnounceCpcdId;
    private String entryNrCpcd;
    private Timestamp entryDateCpcd;
    private Timestamp dateAnnounceAsp;
    private Integer methodAnnounceAspId;
    private String entryNrAsp;
    private Timestamp entryDateAsp;

    @Id
    @Column(name = "id")
    public int getId()
    {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "reason")
    public String getReason()
    {
        return reason;
    }

    public void setReason(String reason)
    {
        this.reason = reason;
    }

    @Basic
    @Column(name = "date_announce_CPCD")
    public Timestamp getDateAnnounceCpcd()
    {
        return dateAnnounceCpcd;
    }

    public void setDateAnnounceCpcd(Timestamp dateAnnounceCpcd)
    {
        this.dateAnnounceCpcd = dateAnnounceCpcd;
    }

    @Basic
    @Column(name = "method_announce_CPCD_id")
    public Integer getMethodAnnounceCpcdId()
    {
        return methodAnnounceCpcdId;
    }

    public void setMethodAnnounceCpcdId(Integer methodAnnounceCpcdId)
    {
        this.methodAnnounceCpcdId = methodAnnounceCpcdId;
    }

    @Basic
    @Column(name = "entry_nr_CPCD")
    public String getEntryNrCpcd()
    {
        return entryNrCpcd;
    }

    public void setEntryNrCpcd(String entryNrCpcd)
    {
        this.entryNrCpcd = entryNrCpcd;
    }

    @Basic
    @Column(name = "entry_date_CPCD")
    public Timestamp getEntryDateCpcd()
    {
        return entryDateCpcd;
    }

    public void setEntryDateCpcd(Timestamp entryDateCpcd)
    {
        this.entryDateCpcd = entryDateCpcd;
    }

    @Basic
    @Column(name = "date_announce_ASP")
    public Timestamp getDateAnnounceAsp()
    {
        return dateAnnounceAsp;
    }

    public void setDateAnnounceAsp(Timestamp dateAnnounceAsp)
    {
        this.dateAnnounceAsp = dateAnnounceAsp;
    }

    @Basic
    @Column(name = "method_announce_ASP_id")
    public Integer getMethodAnnounceAspId()
    {
        return methodAnnounceAspId;
    }

    public void setMethodAnnounceAspId(Integer methodAnnounceAspId)
    {
        this.methodAnnounceAspId = methodAnnounceAspId;
    }

    @Basic
    @Column(name = "entry_nr_ASP")
    public String getEntryNrAsp()
    {
        return entryNrAsp;
    }

    public void setEntryNrAsp(String entryNrAsp)
    {
        this.entryNrAsp = entryNrAsp;
    }

    @Basic
    @Column(name = "entry_date_ASP")
    public Timestamp getEntryDateAsp()
    {
        return entryDateAsp;
    }

    public void setEntryDateAsp(Timestamp entryDateAsp)
    {
        this.entryDateAsp = entryDateAsp;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LicenseCessationReasonsEntity that = (LicenseCessationReasonsEntity) o;
        return id == that.id &&
                Objects.equals(reason, that.reason) &&
                Objects.equals(dateAnnounceCpcd, that.dateAnnounceCpcd) &&
                Objects.equals(methodAnnounceCpcdId, that.methodAnnounceCpcdId) &&
                Objects.equals(entryNrCpcd, that.entryNrCpcd) &&
                Objects.equals(entryDateCpcd, that.entryDateCpcd) &&
                Objects.equals(dateAnnounceAsp, that.dateAnnounceAsp) &&
                Objects.equals(methodAnnounceAspId, that.methodAnnounceAspId) &&
                Objects.equals(entryNrAsp, that.entryNrAsp) &&
                Objects.equals(entryDateAsp, that.entryDateAsp);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, reason, dateAnnounceCpcd, methodAnnounceCpcdId, entryNrCpcd, entryDateCpcd, dateAnnounceAsp, methodAnnounceAspId, entryNrAsp, entryDateAsp);
    }
}
