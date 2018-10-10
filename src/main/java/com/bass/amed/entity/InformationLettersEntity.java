package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "information_letters", schema = "amed", catalog = "")
public class InformationLettersEntity
{
    private Integer id;
    private String description;
    private String interruptionReason;
    private Integer letterNr;
    private Date dispatchDate;
    private String title;
    private Integer requestId;

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
    @Column(name = "interruption_reason")
    public String getInterruptionReason()
    {
        return interruptionReason;
    }

    public void setInterruptionReason(String interruptionReason)
    {
        this.interruptionReason = interruptionReason;
    }

    @Basic
    @Column(name = "letter_nr")
    public Integer getLetterNr()
    {
        return letterNr;
    }

    public void setLetterNr(Integer letterNr)
    {
        this.letterNr = letterNr;
    }

    @Basic
    @Column(name = "dispatch_date")
    public Date getDispatchDate()
    {
        return dispatchDate;
    }

    public void setDispatchDate(Date dispatchDate)
    {
        this.dispatchDate = dispatchDate;
    }

    @Basic
    @Column(name = "title")
    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    @Basic
    @Column(name = "request_id")
    public Integer getRequestId()
    {
        return requestId;
    }

    public void setRequestId(Integer requestId)
    {
        this.requestId = requestId;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (interruptionReason != null ? interruptionReason.hashCode() : 0);
        result = 31 * result + (letterNr != null ? letterNr.hashCode() : 0);
        result = 31 * result + (dispatchDate != null ? dispatchDate.hashCode() : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (requestId != null ? requestId.hashCode() : 0);
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

        InformationLettersEntity that = (InformationLettersEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        if (interruptionReason != null ? !interruptionReason.equals(that.interruptionReason) : that.interruptionReason != null)
        {
            return false;
        }
        if (letterNr != null ? !letterNr.equals(that.letterNr) : that.letterNr != null)
        {
            return false;
        }
        if (dispatchDate != null ? !dispatchDate.equals(that.dispatchDate) : that.dispatchDate != null)
        {
            return false;
        }
        if (title != null ? !title.equals(that.title) : that.title != null)
        {
            return false;
        }
        if (requestId != null ? !requestId.equals(that.requestId) : that.requestId != null)
        {
            return false;
        }

        return true;
    }
}
