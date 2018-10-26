package com.bass.amed.repository;

import com.bass.amed.entity.PriceExpirationReasonsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceExpirationReasonRepository extends JpaRepository<PriceExpirationReasonsEntity, Integer> {
}
