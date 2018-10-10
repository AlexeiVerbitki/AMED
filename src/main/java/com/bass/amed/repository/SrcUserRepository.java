package com.bass.amed.repository;

import com.bass.amed.entity.ScrUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface SrcUserRepository extends JpaRepository<ScrUserEntity, Integer>
{
    Optional<ScrUserEntity> findOneWithAuthoritiesByUsername(String username);
}
