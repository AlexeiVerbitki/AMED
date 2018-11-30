package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.entity.NmMedicamentTypeEntity;
import com.bass.amed.projection.MedicamentNamesListProjection;
import com.bass.amed.projection.MedicamentRegisterNumberProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MedicamentRepository extends JpaRepository<MedicamentEntity, Integer>
{

    @Query(value = "SELECT * FROM medicament m WHERE economic_agent_id = ?1", nativeQuery = true)
    List<MedicamentEntity> getMedicamentsByCompany(int companyId);

    List<MedicamentNamesListProjection> findByNameStartingWithIgnoreCase(String name);

    MedicamentEntity findByCode(String code);

    Optional<MedicamentEntity> findById(Integer id);

    @Query(value = "SELECT distinct name,registration_number as regnr FROM medicament m WHERE registration_number = ?1 and status='F'", nativeQuery = true)
    List<MedicamentRegisterNumberProjection> findDistinctByRegistrationNumber(Integer registrationNumber);

    List<MedicamentEntity> findByRegistrationNumber(Integer registrationNumber);

    @Query(value = "SELECT id, name, code FROM medicament m WHERE (upper(m.name) like upper(CONCAT(?1, '%')) or m.code = ?2 ) and m.status = ?3", nativeQuery = true)
    List<MedicamentNamesListProjection> getMedicamentsByNameAndCode(String name, String code, String status);

    Optional<List<MedicamentEntity>> findAllById(Integer id);
//    @Query(value = "SELECT * FROM medicament m WHERE m.name OR m.code like upper(CONCAT(?1, '%'))", nativeQuery = true)
//    List<MedicamentEntity> findByNameOrCode(String description);

    @Query(value = "SELECT * FROM medicament m WHERE (upper(m.name) like upper(CONCAT(?1, '%'))) and m.status = ?2", nativeQuery = true)
    List<MedicamentEntity> findAllByName(String name, String status);
}
