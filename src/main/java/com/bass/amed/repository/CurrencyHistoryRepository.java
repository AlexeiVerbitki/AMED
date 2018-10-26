package com.bass.amed.repository;

import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface CurrencyHistoryRepository extends JpaRepository<NmCurrenciesHistoryEntity, Integer> {
    List<NmCurrenciesHistoryEntity> getAllByPeriod(Date today);
}
