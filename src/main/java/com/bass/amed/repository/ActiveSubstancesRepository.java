package com.bass.amed.repository;

import com.bass.amed.entity.NmActiveSubstancesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActiveSubstancesRepository extends JpaRepository<NmActiveSubstancesEntity, Integer>
{
}
