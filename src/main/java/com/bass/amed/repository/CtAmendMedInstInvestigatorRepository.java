package com.bass.amed.repository;

import com.bass.amed.entity.CtAmendMedInstInvestigatorEntity;
import com.bass.amed.entity.CtMedInstInvPK;
import com.bass.amed.entity.CtMedInstInvestigatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface CtAmendMedInstInvestigatorRepository extends JpaRepository<CtAmendMedInstInvestigatorEntity, CtMedInstInvPK> {
    @Query(value = "SELECT * FROM ct_amend_med_inst_investigator m WHERE m.clinical_trail_amend_id=?", nativeQuery = true)
    Set<CtAmendMedInstInvestigatorEntity> findCtMedInstInvestigatorById(Integer clinicalTrailId);

    @Query(value = "SELECT * FROM ct_amend_med_inst_investigator m WHERE m.clinical_trail_amend_id=? and m.medical_institution_id=?", nativeQuery = true)
    Set<CtAmendMedInstInvestigatorEntity> findCtInvestigatorsByCtIdAnAndMedInstId(Integer clinicalTrailId, Integer medicalInstitutionId);
}
