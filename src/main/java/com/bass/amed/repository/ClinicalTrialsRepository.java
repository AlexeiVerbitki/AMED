package com.bass.amed.repository;

import com.bass.amed.entity.ClinicalTrialsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClinicalTrialsRepository extends JpaRepository<ClinicalTrialsEntity, Integer>
{

    @Query(value = "SELECT * FROM clinical_trials m WHERE ((upper(m.code)) like upper(CONCAT(?1, '%')) or (upper(m.EudraCT_nr)) like upper(CONCAT(?2, '%'))) and m.status='F'", nativeQuery = true)
    List<ClinicalTrialsEntity> getClinicalTrailByCodeOrEudra(String code, String eudra);
}
