package com.bass.amed.repository.annihilation;

import com.bass.amed.entity.MedicamentAnnihilationInsitutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicamentAnnihilationInstitutionRepository extends JpaRepository<MedicamentAnnihilationInsitutionEntity, Integer>
{
    List<MedicamentAnnihilationInsitutionEntity> findAllByMedicamentAnnihilationId(Integer medicamentAnnihilationId);
}
