package com.bass.amed.repository;

import com.bass.amed.entity.ScrRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScrRoleRepository extends JpaRepository<ScrRoleEntity, Integer>
{
    Optional<ScrRoleEntity> findById(Integer id);

}
