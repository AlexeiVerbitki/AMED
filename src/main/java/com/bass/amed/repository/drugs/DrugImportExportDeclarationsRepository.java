package com.bass.amed.repository.drugs;

import com.bass.amed.entity.DrugImportExportDeclarationsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DrugImportExportDeclarationsRepository extends JpaRepository<DrugImportExportDeclarationsEntity, Integer>
{
    @Query(value = "select died.subst_active_quantity_used " +
            "from drug_import_export_declarations died " +
            "where died.import_export_id = ?1 "
            , nativeQuery = true)
    List<Double> findAllByImportExportDetailId(Integer ieDetailId);
}
