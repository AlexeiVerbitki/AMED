package com.bass.amed.repository;

import com.bass.amed.entity.NmTypesOfEconomicAgentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NMEconomicAgentTypeRepository extends JpaRepository<NmTypesOfEconomicAgentsEntity, Integer>
{
}
