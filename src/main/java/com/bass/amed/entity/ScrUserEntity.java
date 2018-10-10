package com.bass.amed.entity;

import javax.persistence.*;

@Entity
@Table(name = "scr_user")
public class ScrUserEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "fullname")
    private String fullname;
    @Column(name = "username")
    private String username;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private ScrRoleEntity srcRole;

    public ScrRoleEntity getSrcRole()
    {
        return srcRole;
    }

    public void setSrcRole(ScrRoleEntity srcRole)
    {
        this.srcRole = srcRole;
    }

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getFullname()
    {
        return fullname;
    }

    public void setFullname(String fullname)
    {
        this.fullname = fullname;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }
}
