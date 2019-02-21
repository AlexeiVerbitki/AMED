package com.bass.amed.repository;

import com.bass.amed.dto.ImportAuthorizationDTO;
import com.bass.amed.entity.ImportAuthorizationDetailsEntity;
import com.bass.amed.entity.ImportAuthorizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface ImportAuthorizationRepository2 extends JpaRepository<ImportAuthorizationEntity, Integer>
{
    @Query(value = "SELECT *\n" +
            "FROM import_authorization nmp\n" +
            "WHERE\n" +
            "(?1 IS NULL/* OR ?1=''*/ OR nmp.authorization_number = ?1) AND\n" +
            "(?2 IS NULL/* OR ?2=''*/ OR nmp.applicant = ?2) AND\n" +
            "(?3 IS NULL/* OR ?3=''*/ OR nmp.expiration_date = ?3) AND\n" +
            "(?4 IS NULL/* OR ?4=''*/ OR nmp.summ = ?4) AND\n" +
            "(?5 IS NULL/* OR ?5=''*/ OR nmp.currency = ?5)"
            , nativeQuery = true)
    List<ImportAuthorizationEntity> getAuthorizationByFilter(String authorizationNumber,
                                                          String applicant,
//                                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date expirationDate,
                                                          String expirationDate,
                                                          String summ,
                                                          String currency);
}
