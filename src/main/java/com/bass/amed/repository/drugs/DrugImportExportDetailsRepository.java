package com.bass.amed.repository.drugs;

import com.bass.amed.entity.AuthorizedDrugSubstancesEntity;
import com.bass.amed.entity.DrugImportExportDetailsEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DrugImportExportDetailsRepository extends JpaRepository<DrugImportExportDetailsEntity, Integer> {

//    List<DrugImportExportDetailsEntity> findAllByAuthorizedDrugSubstance(AuthorizedDrugSubstancesEntity authorizedDrugSubstance);


    @Query("SELECT p FROM DrugImportExportDetailsEntity p " +
            "JOIN FETCH p.authorizedDrugSubstance as a " +
            "WHERE  a.id = (:id)")
    List<DrugImportExportDetailsEntity> findAllByAuthorizedDrugSubstance(@Param("id") Integer id);

    List<DrugImportExportDetailsEntity> findALLByDrugCheckDecisionsId(Integer id);
}
