package com.bass.amed.repository;

import com.bass.amed.entity.DocumentModuleDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DocumentModuleDetailsRepository extends JpaRepository<DocumentModuleDetailsEntity, Integer>
{
    @Query("SELECT p FROM DocumentModuleDetailsEntity p " +
            "LEFT JOIN FETCH p.executors " +
            "INNER JOIN FETCH p.registrationRequestsEntity  r " +
            "LEFT JOIN FETCH p.documentHistoryEntity " +
            "LEFT JOIN FETCH r.requestHistories " +
            "LEFT JOIN FETCH r.documents " +
            "WHERE r.id = :id")
    Optional<DocumentModuleDetailsEntity> findDocumentModuleById(@Param("id") Integer id);

}
