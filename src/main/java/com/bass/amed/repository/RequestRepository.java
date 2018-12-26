package com.bass.amed.repository;

import com.bass.amed.entity.RegistrationRequestsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RequestRepository extends JpaRepository<RegistrationRequestsEntity, Integer>
{
    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicaments " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findMedicamentRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicamentHistory " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findMedicamentHistoryById(@Param("id") Integer id);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicamentHistory " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.documents " +
            "WHERE p.medicamentPostauthorizationRegisterNr = (:regNumber) and p.currentStep='F'")
    Optional<List<RegistrationRequestsEntity>> findMedicamentHistoryByRegistrationNumber(@Param("regNumber") Integer regNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.clinicalTrails " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findClinicalTrailstRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.importAuthorizationEntity " +
//            "LEFT JOIN FETCH p.importAuthorizationEntityDetails " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
// 
//            "LEFT JOIN FETCH p.paymentOrders " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findImportAuthRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.price " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findPricesRequestById(@Param("id") Integer id);

    @Query(value = "SELECT r.* FROM registration_requests r JOIN request_types t ON r.type_id = t.id AND r.license_id = ?1 AND r.end_date IS NOT NULL AND t.code = 'LICM'", nativeQuery = true)
    List<RegistrationRequestsEntity> findAllLicenseModifications(Integer licenseId);

    @Query(value = "SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.clinicalTrails c " +
            "LEFT JOIN FETCH p.documents " +
            "WHERE c.id = :id and p.type='3'  ")
    Optional<RegistrationRequestsEntity> findRegRequestByCtId(@Param("id") Integer ctId);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddIncluded = true and p.ddNumber is null and p.currentStep not in ('C','F')")
    List<RegistrationRequestsEntity> findRequestsForDD();

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiIncluded = true and p.oiNumber is null and p.currentStep not in ('C','F')")
    List<RegistrationRequestsEntity> findRequestsForOI();

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.ddNumber = :ddNumber WHERE p.id in (:ids)")
    void setDDNumber(@Param("ids")List<Integer> ids, @Param("ddNumber")String ddNumber);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.oiNumber = :oiNumber WHERE p.id in (:ids)")
    void setOINumber(@Param("ids")List<Integer> ids, @Param("oiNumber")String oiNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddNumber = :ddNumber")
    List<RegistrationRequestsEntity> findRequestsByDDNumber( @Param("ddNumber")String ddNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiNumber = :oiNumber")
    List<RegistrationRequestsEntity> findRequestsByOINumber( @Param("oiNumber")String oiNumber);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicaments " +
            " WHERE p.id in (:ids)")
    List<RegistrationRequestsEntity> findRequestWithMedicamentInfo(@Param("ids")List<Integer> ids);

}
