package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentInstructionsEntity;
import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.projection.GetMinimalCurrencyProjection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicamentInstructionsRepository extends JpaRepository<MedicamentInstructionsEntity, Integer>
{
    List<MedicamentInstructionsEntity> findAllByMedicamentId(Integer medicamentId);
}
