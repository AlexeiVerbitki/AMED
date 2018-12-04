package com.bass.amed.repository;

import com.bass.amed.entity.ServiceChargesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceChargesRepository extends JpaRepository<ServiceChargesEntity, Integer>
{
    Optional<ServiceChargesEntity> findByCategory(String category);
}
