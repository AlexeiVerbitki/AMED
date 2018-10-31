package com.bass.amed.repository;

import com.bass.amed.entity.ImportAuthorizationEntity;
import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.projection.MedicamentNamesListProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImportRepository extends JpaRepository<ImportAuthorizationEntity, Integer> {

    @Query(value = "SELECT * FROM import_authorization m WHERE application_registration_number = ?1", nativeQuery = true)
    List<ImportAuthorizationEntity> getImportByRegistrationNumber(String registrationNumber);

    @Query(value = "SELECT * FROM import_authorization m WHERE authorization_number = ?1", nativeQuery = true)
    List<ImportAuthorizationEntity> getImportByAuthoriztionNumber(String authorizationNUmber);

    @Query(value = "SELECT * FROM import_authorization m WHERE id = ?1", nativeQuery = true)
    List<ImportAuthorizationEntity> getImportById(int id);


//    List<MedicamentEntity> findByEconomic(int companyId);
//    List<MedicamentNamesListProjection> findByNameStartingWithIgnoreCase(String name);
//    List<MedicamentEntity> findAllByCompanyId(int companyId);
}
