package com.bass.amed.repository;

import com.bass.amed.dto.ImportAuthorizationDTO;
import com.bass.amed.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ImportAuthorizationRepository extends JpaRepository<ImportAuthorizationDetailsEntity, Integer>
{
    @Query(value = "SELECT * FROM import_authorization_details m WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')))and m.approved = ?2 and m.Import_authorization_id like upper(CONCAT(?3, '%')))", nativeQuery = true)
    List<ImportAuthorizationDetailsEntity> getAuthorizationDetailsByNameOrCode(String name, Boolean approved, String authId);


    @Query(value = "SELECT *\n" +
            "FROM import_authorization nmp\n" +
            "WHERE\n" +
            "(?1 IS NULL OR nmp.authorization_number = ?1) AND\n" +
            "(?2 IS NULL OR nmp.applicant = ?2) AND\n" +
            "(?3 IS NULL OR nmp.expiration_date = ?3) AND\n" +
            "(?4 IS NULL OR nmp.summ = ?4) AND\n" +
            "(?5 IS NULL OR nmp.currency = ?5)"
            , nativeQuery = true)
    List<ImportAuthorizationDTO> getAuthorizationByFilter(String authorizationNumber,
                                                          String applicant,
                                                          String expirationDate,
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
