package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_organization", schema = "amed")
public class NmOrganizationEntity
{
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    @Basic
    @Column(name = "code", nullable = true, length = 15)
    private String code;
    @Basic
    @Column(name = "description", nullable = true, length = 100)
    private String description;
    @Basic
    @Column(name = "fiscal_code", nullable = true, length = 20)
    private String fiscalCode;
    @Basic
    @Column(name = "address", nullable = true, length = 100)
    private String address;

}
