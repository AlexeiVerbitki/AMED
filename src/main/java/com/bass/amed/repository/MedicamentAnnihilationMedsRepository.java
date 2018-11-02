package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentAnnihilationIdentity;
import com.bass.amed.entity.MedicamentAnnihilationMedsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentAnnihilationMedsRepository extends JpaRepository<MedicamentAnnihilationMedsEntity, MedicamentAnnihilationIdentity>
{
}
