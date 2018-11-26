package com.bass.amed.repository;

import com.bass.amed.entity.NmCurrenciesEntity;
import com.bass.amed.projection.GetMinimalCurrencyProjection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CurrencyRepository extends JpaRepository<NmCurrenciesEntity, Integer>
{
    List<GetMinimalCurrencyProjection> findAllOnlyIdAndAndShortDescriptionBy();
}
