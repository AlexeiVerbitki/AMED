package com.bass.amed.repository;

import com.bass.amed.entity.RequestTypesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RequestTypeRepository extends JpaRepository<RequestTypesEntity, Integer>
{
    Optional<RequestTypesEntity> findByCode(String code);
}
