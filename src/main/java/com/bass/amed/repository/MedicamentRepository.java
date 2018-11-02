package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.projection.MedicamentDetailsForPraceRegProjection;
import com.bass.amed.projection.MedicamentNamesListProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicamentRepository extends JpaRepository<MedicamentEntity, Integer> {

    @Query(value = "SELECT * FROM medicament m WHERE economic_agent_id = ?1", nativeQuery = true)
    List<MedicamentEntity> getMedicamentsByCompany(int companyId);
//
//    List<MedicamentEntity> findByEconomic(int companyId);

    List<MedicamentNamesListProjection> findByNameStartingWithIgnoreCase(String name);
    List<MedicamentDetailsForPraceRegProjection> findAllByCompany(NmEconomicAgentsEntity company);


    @Query(value = "SELECT id, name, code FROM medicament m WHERE (upper(m.name) like upper(CONCAT(?1, '%')) or m.code = ?2 ) and m.status = ?3", nativeQuery = true)
    List<MedicamentNamesListProjection> getMedicamentsByNameAndCode(String name , String code, String status);
  //  List<MedicamentEntity> findAllByCompanyId(int companyId);
}
