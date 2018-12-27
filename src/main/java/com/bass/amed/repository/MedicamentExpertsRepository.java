package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentExpertsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicamentExpertsRepository extends JpaRepository<MedicamentExpertsEntity, Integer>
{
    @Query(value = "SELECT e.* FROM medicament_experts e,medicament m,registration_requests r " +
            " where r.id = ?1 and r.id=m.request_id and m.expert_id=e.id", nativeQuery = true)
    List<MedicamentExpertsEntity> getByRequestId(Integer requestId);
}
