package com.bass.amed.repository.prices;

import com.bass.amed.entity.NmPricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NmPricesRepository extends JpaRepository<NmPricesEntity, Integer>
{
    NmPricesEntity findFirstByMedicamentIdAndStatusOrderByExpirationDateDesc(Integer mId, String status);
    List<NmPricesEntity> findOneByMedicamentId(Integer medId);


    @Query(value = "SELECT np.*\n" +
            "FROM nm_prices np LEFT JOIN prices p ON np.price_request_id = p.id\n" +
            "       LEFT JOIN medicament m ON np.medicament_id = m.id\n" +
            "       LEFT JOIN nm_medicament_type mt ON m.type_id = mt.id\n" +
            "       LEFT JOIN nm_currencies c on p.currency_id = c.id\n" +
            "       LEFT JOIN nm_international_medicament_names imn on m.international_name_id = imn.id\n" +
            "where np.medicament_id IS NOT NULL AND\n" +
            "      imn.id = ?1 AND\n" +
            "      m.type_id = ?2 AND\n" +
            "      m.status = ?3\n"
            , nativeQuery = true)
    List<NmPricesEntity> findAllOriginalMedsSource(Integer internationalNameId, Integer typeId, String status);

    NmPricesEntity findOneById(Integer id);
}
