package com.bass.amed.repository.annihilation;

import com.bass.amed.entity.MedicamentAnnihilationMedsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicamentAnnihilationMedsRepository extends JpaRepository<MedicamentAnnihilationMedsEntity, Integer>
{
    List<MedicamentAnnihilationMedsEntity> findByMedicamentAnnihilationId(Integer medicamentAnnihilationId);
}
