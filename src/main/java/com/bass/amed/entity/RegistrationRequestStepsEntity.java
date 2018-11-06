package com.bass.amed.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "registration_request_steps", schema = "amed", catalog = "")
public class RegistrationRequestStepsEntity {
    private Integer id;
    private String code;
    private String description;
    private Integer requestTypeId;
    private String navigationUrl;
    private String availableDocTypes;
    private String outputDocTypes;

    @Id
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "code", nullable = false, length = 3)
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Basic
    @Column(name = "description", nullable = false, length = 100)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "request_type_id", nullable = false)
    public Integer getRequestTypeId() {
        return requestTypeId;
    }

    public void setRequestTypeId(Integer requestTypeId) {
        this.requestTypeId = requestTypeId;
    }

    @Basic
    @Column(name = "navigation_url", nullable = true, length = 100)
    public String getNavigationUrl() {
        return navigationUrl;
    }

    public void setNavigationUrl(String navigationUrl) {
        this.navigationUrl = navigationUrl;
    }

    @Basic
    @Column(name = "available_doc_types", nullable = true, length = 200)
    public String getAvailableDocTypes() {
        return availableDocTypes;
    }

    public void setAvailableDocTypes(String availableDocTypes) {
        this.availableDocTypes = availableDocTypes;
    }

    @Basic
    @Column(name = "output_doc_types", nullable = true, length = 200)
    public String getOutputDocTypes() { return outputDocTypes; }

    public void setOutputDocTypes(String outputDocTypes) {
        this.outputDocTypes = outputDocTypes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RegistrationRequestStepsEntity that = (RegistrationRequestStepsEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(code, that.code) &&
                Objects.equals(description, that.description) &&
                Objects.equals(requestTypeId, that.requestTypeId) &&
                Objects.equals(navigationUrl, that.navigationUrl) &&
                Objects.equals(availableDocTypes, that.availableDocTypes) &&
                Objects.equals(outputDocTypes, that.outputDocTypes);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, code, description, requestTypeId, navigationUrl, availableDocTypes, outputDocTypes);
    }
}
