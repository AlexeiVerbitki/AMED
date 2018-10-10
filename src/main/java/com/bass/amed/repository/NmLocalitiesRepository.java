package com.bass.amed.repository;

import com.bass.amed.entity.NmLocalitiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface NmLocalitiesRepository extends JpaRepository<NmLocalitiesEntity, Integer>
{
    Set<NmLocalitiesEntity> findByStateId(int stateId);
}
