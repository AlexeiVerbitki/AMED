package com.bass.amed.repository.drugs;

import com.bass.amed.entity.DrugCheckDecisionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DrugCheckDecisionRepository extends JpaRepository<DrugCheckDecisionsEntity, Integer>
{
    @Query(value = "select * from drug_check_decisions where nm_ec_agent_id = ?1 order by id desc limit 1", nativeQuery = true)
    Optional<DrugCheckDecisionsEntity> searchLastEntryForAuthAct(Integer filialId);
}
