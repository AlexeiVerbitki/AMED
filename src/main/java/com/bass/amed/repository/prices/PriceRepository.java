package com.bass.amed.repository.prices;

import com.bass.amed.entity.PricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PriceRepository extends JpaRepository<PricesEntity, Integer>
{
    List<PricesEntity> findAllByMedicamentIdAndTypeId(Integer id, Integer typeId);

    PricesEntity findOneById(Integer id);

    @Query("SELECT p FROM PricesEntity p WHERE p.medicament.id in (:ids) AND p.type.id = :typeId")
    List<PricesEntity> getAlreadyProposed(@Param("ids")List<Integer> ids, @Param("typeId")Integer typeId);

    @Query(value = "select * from prices WHERE medicament_id = ?1 AND type_id = ?2 LIMIT 1", nativeQuery = true)
    PricesEntity findOneByMedicamentIdAndType(Integer medId, Integer typeId);

    @Query(value = "select *\n" +
            "from prices\n" +
            "WHERE medicament_id = ?1\n" +
            "  AND type_id = ?2\n" +
            "  AND revision_date = (select MAX(revision_date) from prices)", nativeQuery = true)
    PricesEntity findLast(Integer id, Integer typeId);
}
