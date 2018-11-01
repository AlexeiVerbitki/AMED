package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "output_documents", schema = "amed", catalog = "")
public class OutputDocumentsEntity
{
    private Integer id;
    private Timestamp date;
    private String name;
    private String number;
    private String title;
    private String content;
    private NmDocumentTypesEntity docType;
    private boolean responseReceived;

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
    @Column(name = "date")
    public Timestamp getDate()
    {
        return date;
    }

    public void setDate(Timestamp date)
    {
        this.date = date;
    }

    @Basic
    @Column(name = "name")
    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    @Basic
    @Column(name = "number")
    public String getNumber()
    {
        return number;
    }

    public void setNumber(String number)
    {
        this.number = number;
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
    @Column(name = "content")
    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
    }

    @OneToOne( fetch = FetchType.EAGER, cascade = { CascadeType.DETACH} )
    @JoinColumn( name = "type_id" )
    public NmDocumentTypesEntity getDocType()
    {
        return docType;
    }

    public void setDocType(NmDocumentTypesEntity docType)
    {
        this.docType = docType;
    }

//    @Basic
//    @Column(name = "response_received")
//    public boolean isResponseReceived()
//    {
//        return responseReceived;
//    }
//
//    public void setResponseReceived(boolean responseReceived)
//    {
//        this.responseReceived = responseReceived;
//    }

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

        OutputDocumentsEntity that = (OutputDocumentsEntity) o;

        if (responseReceived != that.responseReceived)
        {
            return false;
        }
        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (date != null ? !date.equals(that.date) : that.date != null)
        {
            return false;
        }
        if (name != null ? !name.equals(that.name) : that.name != null)
        {
            return false;
        }
        if (number != null ? !number.equals(that.number) : that.number != null)
        {
            return false;
        }
        if (title != null ? !title.equals(that.title) : that.title != null)
        {
            return false;
        }
        if (content != null ? !content.equals(that.content) : that.content != null)
        {
            return false;
        }
        return docType != null ? docType.equals(that.docType) : that.docType == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (content != null ? content.hashCode() : 0);
        result = 31 * result + (docType != null ? docType.hashCode() : 0);
//        result = 31 * result + (responseReceived ? 1 : 0);
        return result;
    }
}
