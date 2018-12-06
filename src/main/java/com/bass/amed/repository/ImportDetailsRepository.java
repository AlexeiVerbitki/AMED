package com.bass.amed.repository;

import com.bass.amed.entity.ImportMedNotRegisteredEntity;
import com.bass.amed.entity.NmInternationalMedicamentNameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImportDetailsRepository extends JpaRepository<ImportMedNotRegisteredEntity, Integer> {
//	@Query(value = "SELECT id FROM import_authorization m WHERE m.id = (SELECT max(id) from import_authorization)", nativeQuery =
//			true)
//	String findMaxImportAuthorizationNumber();
}

//	from Person where person.id = (select max(id) from Person)