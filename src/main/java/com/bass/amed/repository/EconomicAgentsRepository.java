package com.bass.amed.repository;

import com.bass.amed.entity.NmEconomicAgentsEntity;
import com.bass.amed.projection.GetMinimalCompanyProjection;
import com.bass.amed.projection.LicenseCompanyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EconomicAgentsRepository extends JpaRepository<NmEconomicAgentsEntity, Integer> {

    @Query(value = "SELECT id, name FROM nm_economic_agents", nativeQuery = true)
    List<GetMinimalCompanyProjection> getMinimalDetails();

    // OR

    List<GetMinimalCompanyProjection> findAllOnlyIdAndNamesBy();


//    @Query(value = "SELECT id, name, idno, legal_address FROM nm_economic_agents group by idno", nativeQuery = true)
//    List<LicenseCompanyProjection> getLicenseDetails();

    @Query(value = "SELECT * FROM nm_economic_agents m WHERE (upper(m.name) like upper(CONCAT(?1, '%')) or m.idno = ?2 ) and m.parent_id is null", nativeQuery = true)
    List<NmEconomicAgentsEntity> getCompaniesByNameAndIdno(String name , String idno);



    @Query(value = "SELECT * FROM nm_economic_agents m WHERE (upper(m.name) like upper(CONCAT(?1, '%')) or m.idno = ?2 ) group by idno", nativeQuery = true)
    List<LicenseCompanyProjection> getLicenseDetails(String name , String idno);

    Optional<NmEconomicAgentsEntity> findFirstByIdnoEqualsAndLicenseIdIsNotNull(String idno);

    List<NmEconomicAgentsEntity> findAllByIdnoEndsWithAndLicenseIdIsNull(String idno);

    Optional<NmEconomicAgentsEntity> findFirstByIdnoEquals(String idno);

    List<NmEconomicAgentsEntity> findAllByIdno(String idno);


    @Query(value = "select b.* from  (select idno,min(code) as code from nm_economic_agents group by idno) a  inner join nm_economic_agents b using (idno,code) order by b.code desc", nativeQuery = true)
    List<NmEconomicAgentsEntity> loadAllAgentsGroupByIdno();


    @Query(value = "SELECT * FROM nm_economic_agents m WHERE m.idno = ?1 order by code asc LIMIT 1", nativeQuery = true)
    Optional<NmEconomicAgentsEntity> getParentForIdno(String idno);


    @Query(value = "select * from nm_economic_agents where idno = ?1 and code not in (select  min(e.code) as code from nm_economic_agents e where idno = ?1) order by code", nativeQuery = true)
    List<NmEconomicAgentsEntity> loadFilialsForIdno(String idno);
	
	@Query(value = "SELECT * FROM nm_economic_agents m WHERE (upper(m.name) like upper(CONCAT(?1, '%')) or m.code = ?2 ) and m.idno = ?3", nativeQuery = true)
    List<NmEconomicAgentsEntity> getCompaniesByNameCodeAndIdno(String name, String code, String idno);

}