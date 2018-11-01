package com.bass.amed.repository;

import com.bass.amed.entity.PriceTypesEntity;
import com.bass.amed.entity.PricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceTypesRepository extends JpaRepository<PriceTypesEntity, Integer>
{
}
