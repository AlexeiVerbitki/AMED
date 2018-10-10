package com.bass.amed.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "documents", schema = "amed", catalog = "")
public class DocumentsEntity
{
    private Integer id;
    private Timestamp date;
    private String name;
    private String path;
    private String format;
    private Integer docTypeId;

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
    @Column(name = "path")
    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
    }

    @Basic
    @Column(name = "doc_type_id")
    public Integer getDocTypeId()
    {
        return docTypeId;
    }

    public void setDocTypeId(Integer docTypeId)
    {
        this.docTypeId = docTypeId;
    }

    @Basic
    @Column(name = "format")
    public String getFormat()
    {
        return format;
    }

    public void setFormat(String format)
    {
        this.format = format;
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

        DocumentsEntity that = (DocumentsEntity) o;

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
        if (path != null ? !path.equals(that.path) : that.path != null)
        {
            return false;
        }
        if (format != null ? !format.equals(that.format) : that.format != null)
        {
            return false;
        }
        return docTypeId != null ? docTypeId.equals(that.docTypeId) : that.docTypeId == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (path != null ? path.hashCode() : 0);
        result = 31 * result + (format != null ? format.hashCode() : 0);
        result = 31 * result + (docTypeId != null ? docTypeId.hashCode() : 0);
        return result;
    }
}
