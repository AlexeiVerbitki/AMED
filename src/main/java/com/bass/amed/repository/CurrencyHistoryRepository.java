package com.bass.amed.repository;

import com.bass.amed.entity.NmCurrenciesHistoryEntity;
import com.bass.amed.projection.GetAVGCurrencyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface CurrencyHistoryRepository extends JpaRepository<NmCurrenciesHistoryEntity, Integer> {

    @Query(value = "SELECT * FROM nm_currencies_history where period = ?1", nativeQuery = true)
    List<NmCurrenciesHistoryEntity> findAllByPeriod( @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date now);

    @Query(value = "SELECT t.id,\n" +
            "       t.currency_id                                                           currencyId,\n" +
            "       DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY), INTERVAL - 2 MONTH) firstDayOfLastMonth,\n" +
            "       LAST_DAY(DATE_ADD(NOW(), INTERVAL - 1 MONTH))                           lastDayOfLastMonth,\n" +
            "       AVG(CASE\n" +
            "               WHEN t.multiplicity > 0 THEN t.value / t.multiplicity\n" +
            "               ELSE t.value\n" +
            "           END)                                                                avgValue\n" +
            "FROM nm_currencies_history t\n" +
            "            LEFT JOIN nm_currencies c ON t.currency_id = c.id\n" +
            "WHERE (t.period <= LAST_DAY(DATE_ADD(NOW(), INTERVAL - 1 MONTH)) AND\n" +
            "       t.period >= DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY), INTERVAL - 2 MONTH))\n" +
            "GROUP BY t.currency_id", nativeQuery = true)
    List<GetAVGCurrencyProjection> getPrevMonthAVGCurrencies();


    @Query(value = "SELECT MAX(period) FROM nm_currencies_history", nativeQuery = true)
    Date findLastInsertedCurrencyDate();
}
