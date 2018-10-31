package com.bass.amed.repository;

import com.bass.amed.entity.NmInvestigatorsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestigatorRepository extends JpaRepository<NmInvestigatorsEntity, Integer> {
}
