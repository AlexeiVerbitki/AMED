package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentCodeSequenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentCodeSeqRepository extends JpaRepository<MedicamentCodeSequenceEntity, Integer> {
}
