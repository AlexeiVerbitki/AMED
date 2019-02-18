package com.bass.amed.repository;

import com.bass.amed.entity.ClinicalTrialCodeSequenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CtSeqRegistrationRequestNumberRepository extends JpaRepository<ClinicalTrialCodeSequenceEntity, Integer> {
}
