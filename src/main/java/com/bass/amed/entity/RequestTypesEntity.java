package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "request_types", schema = "amed", catalog = "")
public class RequestTypesEntity
{
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "description", nullable = false, length = 100)
    private String description;
    @Basic
    @Column(name = "code", nullable = true, length = 5)
    private String code;
    @Basic
    @Column(name = "process_id", nullable = true)
    private Integer processId;

}
