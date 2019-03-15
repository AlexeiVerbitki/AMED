package com.bass.amed.repository;

import com.bass.amed.entity.NmMedicalInstitutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalInstitutionsRepository extends JpaRepository<NmMedicalInstitutionEntity/*NmMedicalInstitutionsEntity*/, Integer> {
}
