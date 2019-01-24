package com.bass.amed.repository;

import com.bass.amed.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImportAuthorizationRepository extends JpaRepository<ImportAuthorizationDetailsEntity, Integer> {
	@Query(value = "SELECT * FROM import_authorization_details m WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')))and m.approved = ?2 and m.Import_authorization_id= ?3)",nativeQuery = true)
	List<ImportAuthorizationDetailsEntity> getAuthorizationDetailsByNameOrCode(String name, Boolean approved, String authId);
//	List<ImportAuthorizationDetailsEntity> getAuthorizationDetailsByNameOrCode(Integer name, Boolean approved, Integer authId);
}
