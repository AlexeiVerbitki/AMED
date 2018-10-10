package com.bass.amed.repository;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EconomicAgentsRepository extends JpaRepository<NmEconomicAgentsEntity, Integer>
{
}