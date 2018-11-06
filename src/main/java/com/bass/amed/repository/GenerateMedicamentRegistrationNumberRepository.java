package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentRegistrationNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenerateMedicamentRegistrationNumberRepository extends JpaRepository<MedicamentRegistrationNumberSequence, Integer> {
}
