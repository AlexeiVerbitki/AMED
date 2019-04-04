package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.entity.MedicamentHistoryEntity;
import com.bass.amed.projection.MedicamentNamesListProjection;
import com.bass.amed.projection.MedicamentRegisterNumberProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MedicamentRepository extends JpaRepository<MedicamentEntity, Integer>
{

    @Query(value = "SELECT * FROM medicament m WHERE economic_agent_id = ?1", nativeQuery = true)
    List<MedicamentEntity> getMedicamentsByCompany(int companyId);

    List<MedicamentNamesListProjection> findByNameStartingWithIgnoreCase(String name);

    MedicamentEntity findByCodeAndStatus(String code,String status);
    List<MedicamentEntity> findByCode(String code);

//    Optional<MedicamentEntity> findById(Integer id);

    @Query(value = "SELECT distinct commercial_name commercialName,registration_number as regnr FROM medicament m WHERE registration_number = ?1 and status='F'", nativeQuery =
            true)
    List<MedicamentRegisterNumberProjection> findDistinctByRegistrationNumber(Integer registrationNumber);

    List<MedicamentEntity> findByRegistrationNumber(Integer registrationNumber);

    @Query(value = "SELECT id, commercial_name as name, code FROM medicament m WHERE (upper(m.commercial_name) like upper(CONCAT(?1, '%')) or m.code = ?2 ) and m.status = ?3", nativeQuery = true)
    List<MedicamentNamesListProjection> getMedicamentsByNameAndCode(String name, String code, String status);

    Optional<List<MedicamentEntity>> findAllById(Integer id);

    @Query(value = "SELECT commercial_name FROM medicament m WHERE id = ?1", nativeQuery = true)
    Optional<String> getCommercialNameById(int id);

    @Query(value = "SELECT distinct request_id FROM medicament m WHERE code in (?1)", nativeQuery = true)
    List<Integer> getRequestIdsByMedicamentCodes(List<String> codes);

    @Query(value = "SELECT * FROM medicament m WHERE (upper(m.name) like upper(CONCAT(?1, '%'))or m.code like (CONCAT(?1, '%'))) and m.status = ?2", nativeQuery
            = true)
    List<MedicamentEntity> findAllByName(String name, String status);

    @Modifying
    @Query("UPDATE MedicamentEntity m SET m.approved=:approved WHERE m.id in (:ids)")
    void approveMedicament(@Param("ids")List<Integer> ids,@Param("approved")Boolean approved);

    @Modifying
    @Query("UPDATE MedicamentHistoryEntity m SET m.approved=:approved WHERE m.id = :id")
    void approveMedicamentModify(@Param("id") Integer id,@Param("approved")Boolean approved);

    @Query("SELECT distinct m FROM MedicamentEntity m " +
            "LEFT JOIN FETCH m.manufactures " +
            "WHERE m.approved = true and m.oaNumber is null and m.status = 'P'")
    List<MedicamentEntity> getMedicamentsForOA();

    @Query("SELECT distinct m FROM MedicamentEntity m,RegistrationRequestsEntity  r " +
            "LEFT JOIN FETCH m.manufactures " +
            "WHERE m.requestId = r.id and r.labIncluded = true and r.labNumber is null")
    List<MedicamentEntity> getMedicamentsForLab();

    @Query("SELECT distinct m FROM MedicamentHistoryEntity m " +
            "LEFT JOIN FETCH m.manufacturesHistory " +
            "WHERE m.approved = true and m.omNumber is null and m.status = 'P'")
    List<MedicamentHistoryEntity> getMedicamentsForOM();

    @Query("SELECT p FROM MedicamentEntity p WHERE p.oaNumber = :oaNumber")
    List<MedicamentEntity> findMedicamentsByOANumber(@Param("oaNumber")String oaNumber);

    @Query("SELECT p FROM MedicamentHistoryEntity p WHERE p.omNumber = :omNumber")
    List<MedicamentHistoryEntity> findMedicamentsByOMNumber(@Param("omNumber")String omNumber);

    @Modifying
    @Query("UPDATE MedicamentEntity p SET p.oaNumber = :oaNumber WHERE p.id in (:ids)")
    void setOANumber(@Param("ids")List<Integer> ids, @Param("oaNumber")String oaNumber);

    @Modifying
    @Query("UPDATE MedicamentHistoryEntity p SET p.omNumber = :omNumber WHERE p.id in (:ids)")
    void setOMNumber(@Param("ids")List<Integer> ids, @Param("omNumber")String omNumber);

    @Modifying
    @Query("UPDATE MedicamentEntity p SET p.oaNumber = null,p.registrationNumber = null WHERE p.id in (:ids)")
    void clearOANumber(@Param("ids")List<Integer> ids);

    @Modifying
    @Query("UPDATE MedicamentHistoryEntity p SET p.omNumber = null WHERE p.id in (:ids)")
    void clearOMNumber(@Param("ids")List<Integer> ids);

    @Query("SELECT distinct p.requestId FROM MedicamentEntity p WHERE p.oaNumber = :oaNumber")
    List<Integer> findRequestsIDByOANumber(@Param("oaNumber")String oaNumber);

    @Query("SELECT distinct p.requestId FROM MedicamentHistoryEntity p WHERE p.omNumber = :omNumber")
    List<Integer> findRequestsIDByOMNumber(@Param("omNumber")String omNumber);

    @Modifying
    @Query("UPDATE MedicamentEntity p SET p.registrationNumber = :registrationNumber WHERE p.id = :id")
    void setRegistrationNumber(@Param("id")Integer id, @Param("registrationNumber")Integer registrationNumber);

    @Modifying
    @Query("UPDATE MedicamentEntity p SET p.status = 'E' WHERE p.code = :code and p.status='F'")
    void setStatusExpiredForOldMedicament(@Param("code")String code);

    @Query(value = "SELECT m.* FROM medicament m join nm_prices np on m.id = np.medicament_id WHERE (upper(m.name) LIKE upper(CONCAT(?1, '%')) OR m.code LIKE (CONCAT(?1, '%'))) AND m.status = 'F'", nativeQuery
            = true)
    List<MedicamentEntity> findAllByNameWithPrice(String name, String status);

    @Query(value = "SELECT m.* FROM medicament m WHERE m.status = 'F' and m.request_id is null and m.registration_number is not null and m.registration_number!=0", nativeQuery
            = true)
    List<MedicamentEntity> findByRequestIdIsNull();
}
