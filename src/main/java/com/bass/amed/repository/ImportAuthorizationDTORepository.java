package com.bass.amed.repository;

import com.bass.amed.dto.ImportAuthorizationDTO;
import com.bass.amed.entity.ImportAuthorizationDetailsEntity;
import com.bass.amed.entity.ImportAuthorizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface ImportAuthorizationDTORepository extends JpaRepository<ImportAuthorizationDTO, Integer>
{
    @Query(value = "SELECT " +
            "     ia.id                     id,\n" +
            "     ia.authorization_number   authorizationsNumber,\n " +
            "     ia.applicant              applicant,\n " +
            "     ia.expiration_date        expirationDate,\n " +
            "     ia.summ                   summ,\n " +
            "     ia.currency               currency\n " +
//            "     rr.id                     requestId\n " +
            "FROM import_authorization ia\n " +
//            "     LEFT JOIN registration_requests rr on rr.import_id = ia.id \n " +
            "     WHERE\n" +
            "     (?1 IS NULL OR ia.authorization_number = ?1) AND\n" +
            "     (?2 IS NULL OR ia.applicant = ?2) AND\n" +
            "     (?3 IS NULL OR ia.expiration_date = ?3) AND\n" +
            "     (?4 IS NULL OR ia.summ = ?4) AND\n" +
            "     (?5 IS NULL OR ia.currency = ?5)"
            , nativeQuery = true)
    List<ImportAuthorizationDTO> getAuthorizationByFilter(String authorizationNumber,
                                                          String applicant,
                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String expirationDate,
                                                          String summ,
                                                          String currency);
}
