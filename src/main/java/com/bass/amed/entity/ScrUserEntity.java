package com.bass.amed.entity;

import lombok.Data;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

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
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH})
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
    private Boolean                departmentChief;
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "user_account_control")
    private NmLdapUserStatusEntity nmLdapUserStatusEntity;

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }

        if (!(o instanceof ScrUserEntity))
        {
            return false;
        }

        ScrUserEntity that = (ScrUserEntity) o;

        return new EqualsBuilder()
                .append(username, that.username)
                .isEquals();
    }

    @Override
    public int hashCode()
    {
        return new HashCodeBuilder(17, 37)
                .append(username)
                .toHashCode();
    }
}
