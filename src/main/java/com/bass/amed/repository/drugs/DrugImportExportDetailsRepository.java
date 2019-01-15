package com.bass.amed.repository.drugs;

import com.bass.amed.entity.DrugImportExportDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugImportExportDetailsRepository extends JpaRepository<DrugImportExportDetailsEntity, Integer> {

    List<DrugImportExportDetailsEntity> findALLByAuthorizedDrugSubstancesId(Integer id);

    List<DrugImportExportDetailsEntity> findALLByDrugCheckDecisionsId(Integer id);
}
