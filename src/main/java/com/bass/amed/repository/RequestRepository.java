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
//            "LEFT JOIN FETCH p.ctPaymentOrdersEntities " +
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

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddIncluded = true and p.ddNumber is null and p.currentStep not in ('C','F') and p.type.id in (1,2)")
    List<RegistrationRequestsEntity> findRequestsForDD();

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddIncluded = true and p.ddNumber is null and p.currentStep not in ('C','F') and p.type.id in (21)")
    List<RegistrationRequestsEntity> findRequestsForDDM();

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiIncluded = true and p.oiNumber is null and p.currentStep not in ('C','F') and p.type.id in (1,2)")
    List<RegistrationRequestsEntity> findRequestsForOI();

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiIncluded = true and p.oiNumber is null and p.currentStep not in ('C','F') and p.type.id in (21)")
    List<RegistrationRequestsEntity> findRequestsForOIM();

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.ddNumber = :ddNumber WHERE p.id in (:ids)")
    void setDDNumber(@Param("ids") List<Integer> ids, @Param("ddNumber") String ddNumber);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.oiNumber = :oiNumber WHERE p.id in (:ids)")
    void setOINumber(@Param("ids") List<Integer> ids, @Param("oiNumber") String oiNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddNumber = :ddNumber")
    List<RegistrationRequestsEntity> findRequestsByDDNumber(@Param("ddNumber") String ddNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiNumber = :oiNumber")
    List<RegistrationRequestsEntity> findRequestsByOINumber(@Param("oiNumber") String oiNumber);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicaments " +
            " WHERE p.id in (:ids)")
    List<RegistrationRequestsEntity> findRequestWithMedicamentInfo(@Param("ids") List<Integer> ids);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicamentHistory " +
            " WHERE p.id in (:ids)")
    List<RegistrationRequestsEntity> findRequestWithMedicamentHistoryInfo(@Param("ids") List<Integer> ids);

 	@Query(value = "SELECT * FROM registration_requests rr join request_types rt on rr.type_id = rt.id and rr.license_id = ?1 and rr.current_step = 'F' and rt.code in ( 'LICM', 'LICC', 'LICP') order by rr.id desc", nativeQuery = true)
    List<RegistrationRequestsEntity> getRequestsForLicense(Integer licenseId);


    @Query(value = "select rr.id from registration_requests rr join request_types rt on rr.type_id = rt.id and rr.license_id = ?1 and rr.id = (select max(q.id) from registration_requests q where q.id < ?2 and q.license_id = ?1 and q.current_step = 'F' and rt.code in ('LICEL','LICM', 'LICC', 'LICP'))", nativeQuery = true)
    Optional<Integer> getPreviousLicenseModificationId(Integer licenseId, Integer requestId);
}
