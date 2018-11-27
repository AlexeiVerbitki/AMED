package com.bass.amed.repository;

import com.bass.amed.entity.CtMedicalInstitutionEntity;
import com.bass.amed.entity.NmMedicalInstitutionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalInstitutionsRepository extends JpaRepository<CtMedicalInstitutionEntity/*NmMedicalInstitutionsEntity*/, Integer> {
}
