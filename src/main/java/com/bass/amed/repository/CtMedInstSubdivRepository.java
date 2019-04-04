package com.bass.amed.repository;

import com.bass.amed.entity.NmMedInstSubdivisionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CtMedInstSubdivRepository extends JpaRepository<NmMedInstSubdivisionsEntity, Integer> {

    @Query(value = "SELECT * FROM nm_med_inst_subdivisions m WHERE m.med_inst_id=?", nativeQuery = true)
    List<NmMedInstSubdivisionsEntity> findSubdivisionsByMedicalInstitutionId(Integer MedIstId);
}
