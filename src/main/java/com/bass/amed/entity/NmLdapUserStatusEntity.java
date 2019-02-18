package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "nm_ldap_user_status", schema = "amed")
public class NmLdapUserStatusEntity
{
    @Id
    @Column(name = "id")
    private Integer       id;
    @Basic
    @Column(name = "description")
    private String        description;
    @Basic
    @Column(name = "cod")
    private Integer       cod;
}
