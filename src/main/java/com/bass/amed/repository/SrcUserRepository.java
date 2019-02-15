package com.bass.amed.repository;

import com.bass.amed.entity.ScrUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;


public interface SrcUserRepository extends JpaRepository<ScrUserEntity, Integer>
{
    Optional<ScrUserEntity> findOneWithAuthoritiesByUsername(String username);

    @Query("SELECT u FROM ScrUserEntity u " +
            "INNER JOIN FETCH u.srcRole r " +
            "LEFT JOIN FETCH u.nmLdapUserStatusEntity " +
            "where u.oldId IS NULL")
    Set<ScrUserEntity> findAllUsersWithRoles();

    //    @Query("SELECT u FROM ScrUserEntity u " +
    //            "INNER JOIN FETCH u.srcRole r " +
    //            "where u.oldId IS NULL AND u.userAccountControl in ()")
    //    List<ScrUserEntity> findAllUsersWithRolesAndAuthorities();
}
