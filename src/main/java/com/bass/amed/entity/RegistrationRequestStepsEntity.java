package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "registration_request_steps", schema = "amed", catalog = "")
public class RegistrationRequestStepsEntity
{
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "code", nullable = false, length = 3)
    private String code;
    @Basic
    @Column(name = "description", nullable = false, length = 100)
    private String description;
    @Basic
    @Column(name = "request_type_id", nullable = false)
    private Integer requestTypeId;
    @Basic
    @Column(name = "navigation_url", nullable = true, length = 100)
    private String navigationUrl;
    @Basic
    @Column(name = "available_doc_types", nullable = true, length = 200)
    private String availableDocTypes;
    @Basic
    @Column(name = "output_doc_types", nullable = true, length = 200)
    private String outputDocTypes;

}
