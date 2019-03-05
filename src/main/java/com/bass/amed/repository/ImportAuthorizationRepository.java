package com.bass.amed.repository;

import com.bass.amed.dto.ImportAuthorizationDTO;
import com.bass.amed.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface ImportAuthorizationRepository extends JpaRepository<ImportAuthorizationDetailsEntity, Integer>
{
    @Query(value = "SELECT * FROM import_authorization_details m WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')))and m.approved = ?2 and m.Import_authorization_id like upper(CONCAT(?3, '%')))", nativeQuery = true)
    List<ImportAuthorizationDetailsEntity> getAuthorizationDetailsByNameOrCode(String name, Boolean approved, String authId);

//    @Query(value = "SELECT * FROM amed.registration_requests m WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')))and m.approved = ?2 and m" +
    @Query(value = "SELECT * FROM amed.registration_requests m WHERE (m.import_id IS NOT NULL )", nativeQuery = true)
    List<RegistrationRequestsEntity> getAuthorizationRegistrationRequest(String name, Boolean approved, String authId);


    @Query(value = "SELECT " +
    "     ia.id                     id,\n" +
    "     ia.authorization_number   authorizationsNumber,\n " +
    "     ia.applicant              applicant,\n " +
    "     ia.expiration_date        expirationDate,\n " +
    "     ia.summ                   summ,\n " +
    "     ia.currency               currency,\n " +
    "     rr.id                     requestId\n " +
    "FROM import_authorization ia\n " +
    "     LEFT JOIN registration_requests rr on rr.import_id = ia.id \n " +
    "     WHERE\n" +
    "     (?1 IS NULL OR ia.authorization_number = ?1) AND\n" +
    "     (?2 IS NULL OR ia.applicant = ?2) AND\n" +
    "     (?3 IS NULL OR ia.expiration_date = ?3) AND\n" +
    "     (?4 IS NULL OR ia.summ = ?4) AND\n" +
    "     (?5 IS NULL OR ia.currency = ?5)"
            , nativeQuery = true)
    List<ImportAuthorizationDTO> getAuthorizationByFilter(String authorizationNumber,
                                                          String applicant,
                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date expirationDate,
                                                          String summ,
                                                          String currency);
    //List<PricesDTO> getPricesByFilter(String requestNumber,
    //								  String medCode,
    //								  String orderNr,
    //								  String step,
    //								  String priceType,
    //								  String user,
    //								  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date orderApprovDate,
    //								  String folderNr,
    //								  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date expirationDate

}
