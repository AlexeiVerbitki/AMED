package com.bass.amed.repository;

import com.bass.amed.entity.NmMedicamentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentTypeRepository extends JpaRepository<NmMedicamentTypeEntity, Integer>
{
}
