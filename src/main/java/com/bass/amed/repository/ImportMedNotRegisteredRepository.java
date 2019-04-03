package com.bass.amed.repository;

import com.bass.amed.entity.CtMedicamentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportMedNotRegisteredRepository extends JpaRepository<CtMedicamentEntity, Integer> {
}
