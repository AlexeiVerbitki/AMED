package com.bass.amed.repository;

import com.bass.amed.entity.GMPAuthorizationsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GMPAuthorizationsRepository extends JpaRepository<GMPAuthorizationsEntity, Integer>
{
    @Query("SELECT p FROM GMPAuthorizationsEntity p " +
            "WHERE p.company.id = (:id) and p.toDate is null")
    Optional<GMPAuthorizationsEntity> findAuthorizationByCompanyId(@Param("id") Integer id);
}