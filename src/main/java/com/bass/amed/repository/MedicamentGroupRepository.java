package com.bass.amed.repository;

import com.bass.amed.entity.NmMedicamentGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentGroupRepository extends JpaRepository<NmMedicamentGroupEntity, Integer>
{
    NmMedicamentGroupEntity findByCode(String code);
}
