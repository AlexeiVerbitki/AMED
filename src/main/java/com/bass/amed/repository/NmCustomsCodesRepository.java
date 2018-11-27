package com.bass.amed.repository;

import com.bass.amed.entity.NmAtcCodesEntity;
import com.bass.amed.entity.NmCustomsCodesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NmCustomsCodesRepository extends JpaRepository<NmCustomsCodesEntity, Integer> {

	@Query(value = "SELECT * FROM nm_customs_codes m WHERE m.description OR m.code like upper(CONCAT(?1, '%'))", nativeQuery = true)
	List<NmCustomsCodesEntity> findByDescriptionStartingWithIgnoreCase(String description);
}
