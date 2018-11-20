package com.bass.amed.repository;

import com.bass.amed.entity.NmMedicamentFormsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentFormsRepository extends JpaRepository<NmMedicamentFormsEntity, Integer>
{
}
