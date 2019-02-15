package com.bass.amed.repository.prices;

import com.bass.amed.dto.prices.CatalogPriceDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PricesEvaluationRepository extends JpaRepository<CatalogPriceDTO, Integer>
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
            "       null                   folderNr,\n" +
            "       null                   priceMdlNew,\n" +
            "       null                   priceRequestType,\n" +
            "       p.price                priceNew,\n" +
            "       null                   priceMdlDifferencePercents,\n" +
            "       null                   company,\n" +
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
            "       p.medicament_id NOT IN (SELECT medicament_id FROM prices pr WHERE pr.medicament_id = p.medicament_id AND pr.type_id IN (1,9,11)) AND\n" +
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
            "       null                   folderNr,\n" +
            "       null                   priceMdlNew,\n" +
            "       null                   priceRequestType,\n" +
            "       p.price                priceNew,\n" +
            "       null                   priceMdlDifferencePercents,\n" +
            "       null                   company,\n" +
            "       p.order_approv_date    priceApprovDate\n" +
            "FROM nm_prices p\n" +
            "       LEFT JOIN medicament m ON p.medicament_id = m.id\n" +
            "       LEFT JOIN nm_pharmaceutical_forms npf ON m.pharmaceutical_form_id = npf.id\n" +
            "       LEFT JOIN nm_countries nc ON m.country_id = nc.id\n" +
            "       LEFT JOIN medicament_manufactures mm ON mm.medicament_id = m.id\n" +
            "       LEFT JOIN nm_manufactures nmm ON mm.manufacture_id = nmm.id\n" +
            "       LEFT JOIN nm_international_medicament_names nmint ON m.international_name_id = nmint.id\n" +
            "       LEFT JOIN nm_currencies ncur on p.currency_id = ncur.id\n" +
            "WHERE mm.producator_produs_finit = 1  AND\n" +
            "  p.order_approv_date < DATE_ADD(LAST_DAY(NOW()), INTERVAL - 1 MONTH) AND\n" +
            "  p.expiration_date > LAST_DAY(NOW()) AND\n" +
            "  m.expiration_date > LAST_DAY(NOW()) AND\n" +
            "  m.originale = 0 AND\n" +
            "  p.status = 'V' AND\n" +
            "  p.medicament_id NOT IN (SELECT medicament_id FROM prices pr WHERE pr.medicament_id = p.medicament_id AND pr.type_id IN (1,9,11))\n" +
            "  AND nmint.id = ?1", nativeQuery = true)
    List<CatalogPriceDTO> getGenericsPricesForRevaluationByDCI(Integer internationalNameId);


    @Query(value = "SELECT p.id                   id,\n" +
            "       nmp.order_nr           orderNr,\n" +
            "       nmp.status             status,\n" +
            "       m.code                 medicamentCode,\n" +
            "       m.id                   medicamentId,\n" +
            "       p.folder_nr            folderNr,\n" +
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
            "       nmp.price              price,\n" +
            "       ncur.short_description currency,\n" +
            "       ncur.id                currencyId,\n" +
            "       nmp.price_mdl          priceMdl,\n" +
            "       p.mdl_value            priceMdlNew,\n" +
            "       p.type_id              priceRequestType,\n" +
            "       p.value                priceNew,\n" +
            "       null                   priceMdlDifferencePercents,\n" +
            "       null                   company,\n" +
            "       nmp.order_approv_date  priceApprovDate\n" +
            "FROM prices p\n" +
            "       LEFT JOIN nm_prices nmp ON nmp.price_request_id = p.id\n" +
            "       LEFT JOIN medicament m ON p.medicament_id = m.id\n" +
            "       LEFT JOIN nm_pharmaceutical_forms npf ON m.pharmaceutical_form_id = npf.id\n" +
            "       LEFT JOIN nm_countries nc ON m.country_id = nc.id\n" +
            "       LEFT JOIN medicament_manufactures mm ON mm.medicament_id = m.id\n" +
            "       LEFT JOIN nm_manufactures nmm ON mm.manufacture_id = nmm.id\n" +
            "       LEFT JOIN nm_international_medicament_names nmint ON m.international_name_id = nmint.id\n" +
            "       LEFT JOIN nm_currencies ncur on p.currency_id = ncur.id\n" +
            "WHERE p.type_id IN (2, 9, 11)\n" +
            "GROUP BY medicamentId", nativeQuery = true)
    List<CatalogPriceDTO> getPricesForApproval();

    @Query(value = "SELECT p.id                   id,\n" +
            "       null                   orderNr,\n" +
            "       null                   status,\n" +
            "       m.code                 medicamentCode,\n" +
            "       m.id                   medicamentId,\n" +
            "       m.commercial_name      commercialName,\n" +
            "       npf.description        pharmaceuticalForm,\n" +
            "       p.folder_nr            folderNr,\n" +
            "       m.dose                 dose,\n" +
            "       m.volume               volume,\n" +
            "       m.division             division,\n" +
            "       nc.description         country,\n" +
            "       null                   manufacture,\n" +
            "       m.registration_number  registrationNumber,\n" +
            "       m.registration_date    registrationDate,\n" +
            "       m.atc_code             atcCode,\n" +
            "       nmint.description      internationalName,\n" +
            "       m.terms_of_validity    termsOfValidity,\n" +
            "       m.barcode              barCode,\n" +
            "       null                   price,\n" +
            "       ncur.short_description currency,\n" +
            "       ncur.id                currencyId,\n" +
            "       null                   priceMdl,\n" +
            "       p.mdl_value            priceMdlNew,\n" +
            "       p.type_id              priceRequestType,\n" +
            "       p.value                priceNew,\n" +
            "       null                   priceMdlDifferencePercents,\n" +
            "       nmm.description        company,\n" +
            "       null                   priceApprovDate\n" +
            "FROM prices p\n" +
            "       LEFT JOIN registration_requests rr ON p.id = rr.price_id\n" +
            "       LEFT JOIN medicament m ON p.medicament_id = m.id\n" +
            "       LEFT JOIN nm_pharmaceutical_forms npf ON m.pharmaceutical_form_id = npf.id\n" +
            "       LEFT JOIN nm_manufactures nmm ON m.authorization_holder_id = nmm.id\n" +
            "       LEFT JOIN nm_countries nc ON nmm.country_id = nc.id\n" +
            "       LEFT JOIN nm_international_medicament_names nmint ON m.international_name_id = nmint.id\n" +
            "       LEFT JOIN nm_currencies ncur on p.currency_id = ncur.id\n" +
            "WHERE p.type_id = 2\n" +
            "GROUP BY p.id;", nativeQuery = true)
    List<CatalogPriceDTO> getPriceForAnexa1();

    @Modifying
    @Query("UPDATE NmPricesEntity p SET p.status = :status, p.revisionDate = current_date WHERE p.id in (:ids)")
    void changeCNPricesStatus(@Param("ids") List<Integer> ids, @Param("status") String status);
}
