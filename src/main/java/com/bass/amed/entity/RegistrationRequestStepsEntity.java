package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "registration_request_steps", schema = "amed", catalog = "")
public class RegistrationRequestStepsEntity
{
    private Integer id;
    private String code;
    private String description;
    private Integer requestTypeId;

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
    @Column(name = "code", nullable = false, length = 3)
    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    @Basic
    @Column(name = "description", nullable = false, length = 25)
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
        result = 31 * result + (code != null ? code.hashCode() : 0);
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

        RegistrationRequestStepsEntity that = (RegistrationRequestStepsEntity) o;

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

        return true;
    }

    @Basic
    @Column(name = "request_type_id", nullable = false)
    public Integer getRequestTypeId()
    {
        return requestTypeId;
    }

    public void setRequestTypeId(Integer requestTypeId)
    {
        this.requestTypeId = requestTypeId;
    }
}
