package com.bass.amed.repository;

import com.bass.amed.entity.NmAtcCodesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NmAtcCodesRepository extends JpaRepository<NmAtcCodesEntity, Integer> {

	@Query(value = "SELECT * FROM nm_atc_codes m WHERE (upper(m.code)) like upper(CONCAT(?1, '%')) and LENGTH(code)>=7", nativeQuery = true)
	List<NmAtcCodesEntity> findByCodeStartingWithIgnoreCase(String code);
}
