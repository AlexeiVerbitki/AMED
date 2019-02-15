package com.bass.amed.repository;

import com.bass.amed.entity.RequestTypesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RequestTypeRepository extends JpaRepository<RequestTypesEntity, Integer> {
    Optional<RequestTypesEntity> findByCode(String code);

    Optional<List<RequestTypesEntity>> findByProcessId(Integer id);

    @Query("SELECT RTE.id from RequestTypesEntity RTE where RTE.processId=(:processId)")
    List<Integer> findIdByProcessId(@Param("processId") Integer processId);

}
