package com.bass.amed.repository;

import com.bass.amed.entity.NmStatesEntity;
import com.bass.amed.projection.GetStateWithoutLocalities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface NmStatesRepository extends JpaRepository<NmStatesEntity, Integer>
{
    @Query(value = "SELECT id, description FROM nm_states WHERE id = ?1", nativeQuery = true)
    Optional<GetStateWithoutLocalities> getStateWithoutLocalities(Integer id);
}
