package com.bass.amed.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
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

    @Column(name = "code")
    private String roleCode;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH})
    @JoinTable(name = "scr_role_authority",
            joinColumns = {@JoinColumn(name = "role_id")},
            inverseJoinColumns = {@JoinColumn(name = "authority_id")})
    private Set<ScrAuthorityEntity> authorities = new HashSet<>();

    public ScrRoleEntity(String description, String roleCode)
    {
        this.description = description;
        this.roleCode = roleCode;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }

        if (!(o instanceof ScrRoleEntity))
        {
            return false;
        }

        ScrRoleEntity that = (ScrRoleEntity) o;

        return new EqualsBuilder()
                .append(roleCode, that.roleCode)
                .isEquals();
    }

    @Override
    public int hashCode()
    {
        return new HashCodeBuilder(17, 37)
                .append(roleCode)
                .toHashCode();
    }
}
