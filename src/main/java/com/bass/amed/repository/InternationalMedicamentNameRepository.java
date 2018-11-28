package com.bass.amed.repository;

import com.bass.amed.entity.NmInternationalMedicamentNameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InternationalMedicamentNameRepository extends JpaRepository<NmInternationalMedicamentNameEntity, Integer>
{
//	@Query(value = "SELECT * FROM nm_international_medicament_names m WHERE (m.description OR m.code) like upper(CONCAT(?1, '%'))", nativeQuery = true)
	@Query(value = "SELECT * FROM nm_international_medicament_names m WHERE m.description like upper(CONCAT(?1, '%'))", nativeQuery = true)
	List<NmInternationalMedicamentNameEntity> findInternationalMedicamentNameByName(String description);
}
