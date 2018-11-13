package com.bass.amed.repository;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.projection.GetMinimalCompanyProjection;
import com.bass.amed.projection.LicenseCompanyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EconomicAgentsRepository extends JpaRepository<NmEconomicAgentsEntity, Integer> {

    @Query(value = "SELECT id, name FROM nm_economic_agents", nativeQuery = true)
    List<GetMinimalCompanyProjection> getMinimalDetails();

    // OR

    List<GetMinimalCompanyProjection> findAllOnlyIdAndNamesBy();


    @Query(value = "SELECT id, name, idno, legal_address FROM nm_economic_agents", nativeQuery = true)
    List<LicenseCompanyProjection> getLicenseDetails();

    @Query(value = "SELECT * FROM nm_economic_agents m WHERE (upper(m.name) like upper(CONCAT(?1, '%')) or m.idno = ?2 ) and m.parent_id is null", nativeQuery = true)
    List<NmEconomicAgentsEntity> getCompaniesByNameAndIdno(String name , String idno);
}