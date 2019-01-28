package com.bass.amed.repository;

import com.bass.amed.entity.NmAuditSubcategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuditSubcategoryRepository extends JpaRepository<NmAuditSubcategoryEntity, Integer>
{
    Optional<NmAuditSubcategoryEntity> findByName(String name);
}
