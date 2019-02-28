package com.bass.amed.repository.drugs;

import com.bass.amed.entity.AuthorizedDrugSubstancesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AuthorizedDrugSubstancesRepository extends JpaRepository<AuthorizedDrugSubstancesEntity, Integer> {

    @Query(value = "SELECT * FROM authorized_drug_substances a WHERE (upper(a.substance_name) like upper(CONCAT(?1, '%')) or a.substance_code = ?2 ) AND a.authorization_type = ?3 AND a.to_date > sysdate()", nativeQuery = true)
    List<AuthorizedDrugSubstancesEntity> getAuthorizedSubstancesByNameOrCode(String name, String code, String authType);
}
