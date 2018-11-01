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
    private String navigationUrl;
    private String availableDocTypes;

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
    @Column(name = "description", nullable = false, length = 100)
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
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

    @Basic
    @Column(name = "navigation_url", nullable = true, length = 100)
    public String getNavigationUrl()
    {
        return navigationUrl;
    }

    public void setNavigationUrl(String navigationUrl)
    {
        this.navigationUrl = navigationUrl;
    }

    @Basic
    @Column(name = "available_doc_types", nullable = true, length = 200)
    public String getAvailableDocTypes()
    {
        return availableDocTypes;
    }

    public void setAvailableDocTypes(String availableDocTypes)
    {
        this.availableDocTypes = availableDocTypes;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (!(o instanceof RegistrationRequestStepsEntity))
        {
            return false;
        }

        RegistrationRequestStepsEntity that = (RegistrationRequestStepsEntity) o;

        if (!id.equals(that.id))
        {
            return false;
        }
        if (!code.equals(that.code))
        {
            return false;
        }
        if (!description.equals(that.description))
        {
            return false;
        }
        if (!requestTypeId.equals(that.requestTypeId))
        {
            return false;
        }
        if (!navigationUrl.equals(that.navigationUrl))
        {
            return false;
        }
        return availableDocTypes.equals(that.availableDocTypes);
    }

    @Override
    public int hashCode()
    {
        int result = id.hashCode();
        result = 31 * result + code.hashCode();
        result = 31 * result + description.hashCode();
        result = 31 * result + requestTypeId.hashCode();
        result = 31 * result + navigationUrl.hashCode();
        result = 31 * result + availableDocTypes.hashCode();
        return result;
    }
}
