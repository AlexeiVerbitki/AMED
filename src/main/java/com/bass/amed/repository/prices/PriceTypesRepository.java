package com.bass.amed.repository.prices;

import com.bass.amed.entity.PriceTypesEntity;
import com.bass.amed.entity.PricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceTypesRepository extends JpaRepository<PriceTypesEntity, Integer>
{
    PriceTypesEntity findOneByDescription(String description);
    List<PriceTypesEntity> findAllByPrice(Integer price);
}
