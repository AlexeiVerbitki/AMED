package com.bass.amed.repository;

import com.bass.amed.entity.ImportAuthorizationDetailsEntity;
import com.bass.amed.entity.ImportAuthorizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImportAuthRepository extends JpaRepository<ImportAuthorizationEntity, Integer> {
	@Query("SELECT i FROM  ImportAuthorizationEntity i WHERE i.authorizationsNumber = (:authId)")
	Optional<List<ImportAuthorizationEntity>> getAuthorizationByAuth(@Param("authId") String authId);
}
