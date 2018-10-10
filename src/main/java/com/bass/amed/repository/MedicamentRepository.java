package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicamentRepository extends JpaRepository<MedicamentEntity, Integer>
{
    @Query(value = "SELECT * FROM medicament m WHERE economic_agent_id = ?1", nativeQuery = true)
    List<MedicamentEntity> getMedicamentsByCompany(int companyId);
}
