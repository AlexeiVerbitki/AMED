package com.bass.amed.repository;

import com.bass.amed.entity.NmAuditCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuditCategoryRepository extends JpaRepository<NmAuditCategoryEntity, Integer>
{
    Optional<NmAuditCategoryEntity> findByName(String name);
}
