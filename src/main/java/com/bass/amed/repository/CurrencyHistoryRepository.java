package com.bass.amed.repository;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface CurrencyHistoryRepository extends JpaRepository<NmCurrenciesHistoryEntity, Integer> {
    List<NmCurrenciesHistoryEntity> getAllByPeriod(Date today);

    @Query(value = "SELECT t.id, t.currency_id currencyId, AVG(t.value) avgValue FROM nm_currencies_history t LEFT JOIN nm_currencies c ON t.currency_id = c.id WHERE (t.period <= NOW() AND t.period >= DATE_ADD(NOW(), INTERVAL -30 DAY)) GROUP BY t.currency_id", nativeQuery = true)
    List<GetAVGCurrencyProjection> getPrevMonthAVGCurrencies();
}
