package com.bass.amed.repository;

import com.bass.amed.entity.CtMedInstInvPK;
import com.bass.amed.entity.CtMedInstInvestigatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface CtMedINstInvestigatorRepository extends JpaRepository<CtMedInstInvestigatorEntity, CtMedInstInvPK> {

    @Query(value = "SELECT * FROM ct_med_inst_investigator m WHERE m.clinical_trail_id=?", nativeQuery = true)
    Set<CtMedInstInvestigatorEntity> findCtMedInstInvestigatorById(Integer clinicalTrailId);

    @Query(value = "SELECT * FROM ct_med_inst_investigator m WHERE m.clinical_trail_id=? and m.medical_institution_id=?", nativeQuery = true)
    Set<CtMedInstInvestigatorEntity> findCtInvestigatorsByCtIdAnAndMedInstId(Integer clinicalTrailId, Integer medicalInstitutionId);
}
