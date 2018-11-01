package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "nm_document_types", schema = "amed", catalog = "")
public class NmDocumentTypesEntity
{
    private Integer id;
    private String description;
    private String category;
    private boolean needDocNr;


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
    @Column(name = "category")
    public String getCategory()
    {
        return category;
    }

    public void setCategory(String category)
    {
        this.category = category;
    }

    @Basic
    @Column(name = "need_doc_nr")
    public boolean isNeedDocNr()
    {
        return needDocNr;
    }

    public void setNeedDocNr(boolean needDocNr)
    {
        this.needDocNr = needDocNr;
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

        NmDocumentTypesEntity that = (NmDocumentTypesEntity) o;

        if (needDocNr != that.needDocNr)
        {
            return false;
        }
        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }
        return category != null ? category.equals(that.category) : that.category == null;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (category != null ? category.hashCode() : 0);
        result = 31 * result + (needDocNr ? 1 : 0);
        return result;
    }
}
