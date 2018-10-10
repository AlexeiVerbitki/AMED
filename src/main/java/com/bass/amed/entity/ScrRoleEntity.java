package com.bass.amed.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "scr_role")
public class ScrRoleEntity implements Serializable
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "description")
    private String description;

    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST}, mappedBy = "srcRole")
    private ScrUserEntity scrUserEntity;

    public ScrUserEntity getScrUserEntity()
    {
        return scrUserEntity;
    }

    public void setScrUserEntity(ScrUserEntity scrUserEntity)
    {
        this.scrUserEntity = scrUserEntity;
    }

    @Column(name = "code")
    private String roleCode;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "role_authority",
            joinColumns = {@JoinColumn(name = "role_id")},
            inverseJoinColumns = {@JoinColumn(name = "authority_id")})
    private Set<ScrAuthorityEntity> authorities = new HashSet<>();

    public Set<ScrAuthorityEntity> getAuthorities()
    {
        return authorities;
    }

    public void setAuthorities(Set<ScrAuthorityEntity> authorities)
    {
        this.authorities = authorities;
    }

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getRoleCode()
    {
        return roleCode;
    }

    public void setRoleCode(String roleCode)
    {
        this.roleCode = roleCode;
    }
}
