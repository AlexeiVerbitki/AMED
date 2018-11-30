package com.bass.amed.repository;

import com.bass.amed.entity.SysParamsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SysParamsRepository extends JpaRepository<SysParamsEntity, Integer>
{
    Optional<SysParamsEntity> findByCode(String code);
}
