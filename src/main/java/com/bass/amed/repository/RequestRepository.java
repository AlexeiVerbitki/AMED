package com.bass.amed.repository;

import com.bass.amed.entity.RegistrationRequestsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RequestRepository extends JpaRepository<RegistrationRequestsEntity, Integer>
{
    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicaments " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "LEFT JOIN FETCH p.laboratorReferenceStandards " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findMedicamentRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.gmpAuthorizations " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findGMPRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicamentHistory " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "LEFT JOIN FETCH p.variations " +
            "LEFT JOIN FETCH p.laboratorReferenceStandards " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findMedicamentHistoryById(@Param("id") Integer id);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicamentHistory " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.variations " +
            "WHERE p.medicamentPostauthorizationRegisterNr = (:regNumber) and p.currentStep='F'")
    Optional<List<RegistrationRequestsEntity>> findMedicamentHistoryByRegistrationNumber(@Param("regNumber") Integer regNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.clinicalTrails " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findClinicalTrailstRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.importAuthorizationEntity " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findImportAuthRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.price " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findPricesRequestById(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findGDPRequestById(@Param("id") Integer id);



    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.drugCheckDecisions " +
            "LEFT JOIN FETCH p.requestHistories " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.paymentOrders " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findRequestCPCDById(@Param("id") Integer id);

    @Query(value = "SELECT r.* FROM registration_requests r JOIN request_types t ON r.type_id = t.id AND r.license_id = ?1 AND r.end_date IS NOT NULL AND t.code = 'LICM'", nativeQuery = true)
    List<RegistrationRequestsEntity> findAllLicenseModifications(Integer licenseId);

    @Query(value = "SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.clinicalTrails c " +
            "LEFT JOIN FETCH p.documents " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE c.id = :id and p.type='3'  ")
    Optional<RegistrationRequestsEntity> findRegRequestByCtId(@Param("id") Integer ctId);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddIncluded = true and p.ddNumber is null and p.currentStep not in ('C','F') and p.type.id in (1,2,34,35,36)")
    List<RegistrationRequestsEntity> findRequestsForDD();

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p LEFT JOIN FETCH p.variations v WHERE p.ddIncluded = true and p.ddNumber is null and p.currentStep not in ('C'," +
            "'F') " +
            "and p" +
            ".type.id " +
            "in (21)")
    List<RegistrationRequestsEntity> findRequestsForDDM();

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiIncluded = true and p.oiNumber is null and p.currentStep not in ('C','F') and p.type.id in (1,2,34,35,36)")
    List<RegistrationRequestsEntity> findRequestsForOI();

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiIncluded = true and p.oiNumber is null and p.currentStep not in ('C','F') and p.type.id in (21)")
    List<RegistrationRequestsEntity> findRequestsForOIM();

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.ddNumber = :ddNumber WHERE p.id in (:ids)")
    void setDDNumber(@Param("ids") List<Integer> ids, @Param("ddNumber") String ddNumber);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.oiNumber = :oiNumber WHERE p.id in (:ids)")
    void setOINumber(@Param("ids") List<Integer> ids, @Param("oiNumber") String oiNumber);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.labNumber = :labNumber WHERE p.id in (:ids)")
    void setLabNumber(@Param("ids") Set<Integer> ids, @Param("labNumber") String labNumber);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.expired = :expired WHERE p.id = :id")
    void setExpiredRequest(@Param("id") Integer id, @Param("expired") Boolean expired);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.critical = :critical WHERE p.id = :id")
    void setCriticalRequest(@Param("id") Integer id, @Param("critical") Boolean critical);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.ddNumber = :ddNumber")
    List<RegistrationRequestsEntity> findRequestsByDDNumber(@Param("ddNumber") String ddNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.oiNumber = :oiNumber")
    List<RegistrationRequestsEntity> findRequestsByOINumber(@Param("oiNumber") String oiNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.labNumber = :labNumber")
    List<RegistrationRequestsEntity> findRequestsByLabNumber(@Param("labNumber") String labNumber);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicaments " +
            " WHERE p.id in (:ids)")
    List<RegistrationRequestsEntity> findRequestWithMedicamentInfo(@Param("ids") List<Integer> ids);

    @Query("SELECT distinct p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.medicamentHistory " +
            " WHERE p.id in (:ids)")
    List<RegistrationRequestsEntity> findRequestWithMedicamentHistoryInfo(@Param("ids") List<Integer> ids);

    @Query(value = "SELECT * FROM registration_requests rr JOIN request_types rt ON rr.type_id = rt.id AND rr.license_id = ?1 AND rr.current_step = 'F' AND rt.code IN ( 'LICM', 'LICC', 'LICP') ORDER BY rr.id DESC", nativeQuery = true)
    List<RegistrationRequestsEntity> getRequestsForLicense(Integer licenseId);


    @Query(value = "SELECT rr.id FROM registration_requests rr JOIN request_types rt ON rr.type_id = rt.id AND rr.license_id = ?1 AND rr.id = (SELECT max(q.id) FROM registration_requests q WHERE q.id < ?2 AND q.license_id = ?1 AND q.current_step = 'F' AND rt.code IN ('LICEL','LICM', 'LICC', 'LICP'))", nativeQuery = true)
    Optional<Integer> getPreviousLicenseModificationId(Integer licenseId, Integer requestId);

    @Query("SELECT DISTINCT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.expertList e " +
            "LEFT JOIN FETCH p.clinicalTrails ct " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.type.id in (3) " +
            "and p.ddIncluded is null " +
            "and p.ddNumber is null " +
            "and p.currentStep not in ('C','F') " +
            "and p.expertList is not empty ")
    List<RegistrationRequestsEntity> findRequestsForDDCt();

    @Query("SELECT DISTINCT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.expertList e " +
            "LEFT JOIN FETCH p.clinicalTrails ct " +
            "LEFT JOIN FETCH p.registrationRequestMandatedContacts " +
            "WHERE p.type.id in (4) " +
            "and p.ddIncluded is null " +
            "and p.ddNumber is null " +
            "and p.currentStep not in ('C','F') " +
            "and p.expertList is not empty ")
    List<RegistrationRequestsEntity> findRequestsForDDACt();

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.ddNumber = :ddNumber, p.ddIncluded=1 WHERE p.id in (:ids)")
    void setDDCtNumber(@Param("ids") List<Integer> ids, @Param("ddNumber") String ddNumber);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.ddIncluded = :ddIncluded WHERE p.id in (:ids)")
    void setDDIncluded(@Param("ids") List<Integer> ids, @Param("ddIncluded") Boolean ddIncluded);

    @Query("SELECT p FROM RegistrationRequestsEntity p WHERE p.medicamentAnnihilation is not null and p.outputDocumentId is null and p.currentStep = 'A'")
    List<RegistrationRequestsEntity> findRequestsForAnih();

    List<RegistrationRequestsEntity> findAllByOutputDocumentId(Integer outputDocumentId);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.outputDocumentId = :outputDocumentId WHERE p.id in (:ids)")
    void setOutputDocumentId(@Param("ids") List<Integer> ids, @Param("outputDocumentId") Integer outputDocumentId);

//    @Query("SELECT i FROM  RegistrationRequestsEntity i WHERE i.importAuthorizationEntity.id = :authId")
    @Query(value = "SELECT * FROM registration_requests i WHERE i.import_id = ?1", nativeQuery = true)
    List<RegistrationRequestsEntity> findRequestsByImportId(@Param("authId") Integer authId);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.outputDocuments " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> findDocuments(@Param("id") Integer id);

    @Query(value = "SELECT id FROM registration_requests r WHERE R.REQUEST_NUMBER LIKE CONCAT(:REQNR, '%') AND" +
            "(current_step != 'C' AND current_step != 'AF' AND current_step != 'F' AND current_step != 'I')", nativeQuery = true)
    List<Integer> getUnfinishedRequests(@Param("REQNR") String reqNr);

    @Query(value = "SELECT DISTINCT p FROM RegistrationRequestsEntity p \n" +
            "            LEFT JOIN FETCH p.price \n" +
            "            LEFT JOIN FETCH p.requestHistories\n" +
            "            LEFT JOIN FETCH p.documents \n" +
            "            LEFT JOIN FETCH p.registrationRequestMandatedContacts \n" +
            "            WHERE p.requestNumber LIKE CONCAT(:REQNR, '/%')")
    List<RegistrationRequestsEntity> getRequestsByRequestNr(@Param("REQNR") String reqNr);

    @Query(value = "SELECT * FROM registration_requests r\n" +
            "            WHERE r.request_number = :reqNr AND r.current_step = 'I' LIMIT 1", nativeQuery = true)
    Optional<RegistrationRequestsEntity> getBaseReqistrationRequest(@Param("reqNr") String requestNr);

    @Transactional
    void deleteByRequestNumber(String requestNumber);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.documents " +
            "WHERE p.id = (:id)")
    Optional<RegistrationRequestsEntity> getRequestDocuments(@Param("id") Integer id);

    @Query("SELECT p FROM RegistrationRequestsEntity p " +
            "LEFT JOIN FETCH p.laboratorReferenceStandards " +
            "WHERE p.id = (:id)")
    RegistrationRequestsEntity getLaboratorStandards(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE RegistrationRequestsEntity p SET p.labIncluded = :include WHERE p.id= :requestId")
    void laboratorAnalysis(@Param("requestId") Integer requestId, @Param("include") Boolean include);
}

