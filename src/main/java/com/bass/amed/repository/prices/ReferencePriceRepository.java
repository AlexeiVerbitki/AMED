package com.bass.amed.repository.prices;

import com.bass.amed.entity.ReferencePricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface ReferencePriceRepository extends JpaRepository<ReferencePricesEntity, Integer>
{
    Set<ReferencePricesEntity> findAllByPriceId(Integer priceId);
}
