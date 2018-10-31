package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "request_types", schema = "amed", catalog = "")
public class RequestTypesEntity
{
    private Integer id;
    private String description;
    private String code;
    private Integer processId;

    @Id
    @Column(name = "id", nullable = false)
    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    @Basic
    @Column(name = "description", nullable = false, length = 100)
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
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

        RequestTypesEntity that = (RequestTypesEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
        {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null)
        {
            return false;
        }

        return true;
    }

    @Basic
    @Column(name = "code", nullable = true, length = 5)
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "process_id", nullable = true)
    public Integer getProcessId()
    {
        return processId;
    }

    public void setProcessId(Integer processId)
    {
        this.processId = processId;
    }
}
