package com.bass.amed.repository;

import com.bass.amed.entity.PricesEntity;
import com.bass.amed.entity.ReferencePricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferencePriceRepository extends JpaRepository<ReferencePricesEntity, Integer>
{
}
