package com.bass.amed.repository;

import com.bass.amed.entity.NmCustomsCodesEntity;
import com.bass.amed.entity.NmCustomsPointsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NmCustomsPointsRepository extends JpaRepository<NmCustomsPointsEntity, Integer> {
	@Query(value = "SELECT * FROM nm_customs_points m WHERE m.description OR m.code like upper(CONCAT(?1, '%'))", nativeQuery = true)
	List<NmCustomsPointsEntity> findByDescriptionOrCode(String description);

}
