package com.bass.amed.repository.prices;

import com.bass.amed.dto.prices.CatalogPriceDTO;
import com.bass.amed.entity.LicenseDetailsEntity;
import com.bass.amed.entity.NmPricesEntity;
import com.bass.amed.exception.CustomException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public interface PricesRevaluationRepository extends JpaRepository<CatalogPriceDTO, Integer>
{

    @Query(value = "SELECT p.id                   id,\n" +
            "       p.order_nr             orderNr,\n" +
            "       p.status               status,\n" +
            "       m.code                 medicamentCode,\n" +
            "       m.commercial_name      commercialName,\n" +
            "       m.id                   medicamentId,\n" +
            "       npf.description        pharmaceuticalForm,\n" +
            "       m.dose                 dose,\n" +
            "       m.volume               volume,\n" +
            "       m.division             division,\n" +
            "       nc.description         country,\n" +
            "       nmm.description        manufacture,\n" +
            "       m.registration_number  registrationNumber,\n" +
            "       m.registration_date    registrationDate,\n" +
            "       m.atc_code             atcCode,\n" +
            "       nmint.description      internationalName,\n" +
            "       m.terms_of_validity    termsOfValidity,\n" +
            "       m.barcode              barCode,\n" +
            "       p.price                price,\n" +
            "       ncur.short_description currency,\n" +
            "       ncur.id                currencyId,\n" +
            "       p.price_mdl            priceMdl,\n" +
            "       null                   priceMdlNew,\n" +
            "       null                   priceMdlDifferencePercents,\n" +
            "       p.order_approv_date    priceApprovDate\n" +
            "FROM\n" +
            "     nm_prices p\n" +
            "            LEFT JOIN medicament m ON p.medicament_id = m.id\n" +
            "            LEFT JOIN nm_pharmaceutical_forms npf ON m.pharmaceutical_form_id = npf.id\n" +
            "            LEFT JOIN nm_countries nc ON m.country_id = nc.id\n" +
            "            LEFT JOIN medicament_manufactures mm ON mm.medicament_id = m.id\n" +
            "            LEFT JOIN nm_manufactures nmm ON mm.manufacture_id = nmm.id\n" +
            "            LEFT JOIN nm_international_medicament_names nmint ON m.international_name_id = nmint.id\n" +
            "            LEFT JOIN nm_currencies ncur on p.currency_id = ncur.id\n" +
            "WHERE mm.producator_produs_finit = 1  AND\n" +
            "       p.order_approv_date < DATE_ADD(LAST_DAY(NOW()), INTERVAL - 1 MONTH)  AND\n" +
            "       p.expiration_date > DATE_ADD(LAST_DAY(NOW()), INTERVAL 60 DAY)  AND\n" +
            "       p.status = 'V' AND\n" +
            "       m.expiration_date > LAST_DAY(NOW())"
            , nativeQuery = true)
    List<CatalogPriceDTO> getTodayRevisionPrices();


    @Query(value = "SELECT p.id                   id,\n" +
            "       p.order_nr             orderNr,\n" +
            "       p.status               status,\n" +
            "       m.code                 medicamentCode,\n" +
            "       m.id                   medicamentId,\n" +
            "       m.commercial_name      commercialName,\n" +
            "       npf.description        pharmaceuticalForm,\n" +
            "       m.dose                 dose,\n" +
            "       m.volume               volume,\n" +
            "       m.division             division,\n" +
            "       nc.description         country,\n" +
            "       nmm.description        manufacture,\n" +
            "       m.registration_number  registrationNumber,\n" +
            "       m.registration_date    registrationDate,\n" +
            "       m.atc_code             atcCode,\n" +
            "       nmint.description      internationalName,\n" +
            "       m.terms_of_validity    termsOfValidity,\n" +
            "       m.barcode              barCode,\n" +
            "       p.price                price,\n" +
            "       ncur.short_description currency,\n" +
            "       ncur.id                currencyId,\n" +
            "       p.price_mdl            priceMdl,\n" +
            "       null                   priceMdlNew,\n" +
            "       null                   priceMdlDifferencePercents,\n" +
            "       p.order_approv_date    priceApprovDate\n" +
            "FROM\n" +
            "     nm_prices p\n" +
            "       LEFT JOIN medicament m ON p.medicament_id = m.id\n" +
            "       LEFT JOIN nm_pharmaceutical_forms npf ON m.pharmaceutical_form_id = npf.id\n" +
            "       LEFT JOIN nm_countries nc ON m.country_id = nc.id\n" +
            "       LEFT JOIN medicament_manufactures mm ON mm.medicament_id = m.id\n" +
            "       LEFT JOIN nm_manufactures nmm ON mm.manufacture_id = nmm.id\n" +
            "       LEFT JOIN nm_international_medicament_names nmint ON m.international_name_id = nmint.id\n" +
            "       LEFT JOIN nm_currencies ncur on p.currency_id = ncur.id\n" +
            "WHERE mm.producator_produs_finit = 1  AND\n" +
            "  p.order_approv_date < DATE_ADD(LAST_DAY(NOW()), INTERVAL - 1 MONTH) AND\n" +
            "  p.expiration_date > LAST_DAY(NOW())  AND\n" +
            "  m.expiration_date > LAST_DAY(NOW()) AND\n" +
            "  m.type_id != 2 AND\n" +
            "  p.status = 'V' AND\n" +
            "  nmint.id = ?1", nativeQuery = true)
    List<CatalogPriceDTO> getGenericsPricesForRevaluationByDCI(Integer internationalNameId);

    @Modifying
    @Query("UPDATE NmPricesEntity p SET p.status = :status, p.revisionDate = current_date WHERE p.id in (:ids)")
    void changeCNPricesStatus(@Param("ids")List<Integer> ids, @Param("status")String status);
}
