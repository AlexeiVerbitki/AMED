package com.bass.amed.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "scr_user", schema = "amed")
public class ScrUserEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer                id;
    @Basic
    @Column(name = "fullname")
    private String                 fullname;
    @Basic
    @Column(name = "username")
    private String                 username;
    @Basic
    @Column(name = "phone_number")
    private String                 phoneNumber;
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "scr_user_role", joinColumns = {@JoinColumn(name = "user_id")}, inverseJoinColumns = {@JoinColumn(name = "role_id")})
    private Set<ScrRoleEntity>     srcRole = new HashSet<>();
    @Basic
    @Column(name = "old_id")
    private String                 oldId;
    @Basic
    @Column(name = "email")
    private String                 email;
    @Basic
    @Column(name = "firstName")
    private String                 firstName;
    @Basic
    @Column(name = "lastName")
    private String                 lastName;
    @Basic
    @Column(name = "user_group")
    private String                 userGroup;
    @Basic
    @Column(name = "department_chief")
    private Byte                   departmentChief;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "user_account_control")
    private NmLdapUserStatusEntity nmLdapUserStatusEntity;
}
