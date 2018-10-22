package com.bass.amed.repository;

import com.bass.amed.entity.NmCountriesEntity;
import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.projection.GetMinimalCompanyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EconomicAgentsRepository extends JpaRepository<NmEconomicAgentsEntity, Integer> {

    @Query(value = "SELECT id, name FROM nm_economic_agents", nativeQuery = true)
    List<GetMinimalCompanyProjection> getMinimalDetails();

    // OR

    List<GetMinimalCompanyProjection> findAllOnlyIdAndNamesBy();
}