package com.bass.amed.repository;
import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface CurrencyHistoryRepository extends JpaRepository<NmCurrenciesHistoryEntity, Integer> {
    List<NmCurrenciesHistoryEntity> getAllByPeriod(Date today);

    @Query(value = "SELECT t.id,\n" +
            "       t.currency_id                                                           currencyId,\n" +
            "       AVG(t.value)                                                            avgValue,\n" +
            "       DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY), INTERVAL - 2 MONTH) firstDayOfLastMonth,\n" +
            "       LAST_DAY(DATE_ADD(NOW(), INTERVAL - 1 MONTH))                           lastDayOfLastMonth\n" +
            "FROM nm_currencies_history t\n" +
            "       LEFT JOIN nm_currencies c ON t.currency_id = c.id\n" +
            "WHERE (t.period <= LAST_DAY(DATE_ADD(NOW(), INTERVAL - 1 MONTH)) AND\n" +
            "       t.period >= DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY), INTERVAL - 2 MONTH))\n" +
            "GROUP BY t.currency_id;", nativeQuery = true)
    List<GetAVGCurrencyProjection> getPrevMonthAVGCurrencies();
}
