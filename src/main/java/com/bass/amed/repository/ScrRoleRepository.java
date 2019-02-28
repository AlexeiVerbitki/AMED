package com.bass.amed.repository;

import com.bass.amed.entity.ScrRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface ScrRoleRepository extends JpaRepository<ScrRoleEntity, Integer>
{
    Optional<ScrRoleEntity> findById(Integer id);

    @Query("SELECT r FROM ScrRoleEntity r LEFT JOIN FETCH r.authorities")
    Set<ScrRoleEntity> findAllRolesWithRights();
}
