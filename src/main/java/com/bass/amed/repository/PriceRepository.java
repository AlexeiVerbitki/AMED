package com.bass.amed.repository;

import com.bass.amed.entity.PricesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PriceRepository extends JpaRepository<PricesEntity, Integer>
{
    List<PricesEntity> findAllByMedicamentIdAndTypeId(Integer id, Integer typeId);

    PricesEntity findOneById(Integer id);


    @Query(value = "select *\n" +
            "from prices\n" +
            "WHERE medicament_id = ?1\n" +
            "  AND type_id = ?2\n" +
            "  AND revision_date = (select MAX(revision_date) from prices)", nativeQuery = true)
    PricesEntity findLast(Integer id, Integer typeId);
}
