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
    @Query(value = "SELECT DISTINCT\n" +
            "  ia.id                   id,\n" +
            "  ia.authorization_number authorizationsNumber,\n" +
            "  ea.name                 importer,\n" +
            "  ia.expiration_date      expirationDate,\n" +
            "  ia.summ                 summ,\n" +
            "  c.short_description     currency,\n" +
            "  iad.name                medicament,\n" +
            "  ia.med_type             medType,\n" +
            "  ia.authorized           status\n" +
            "#             rr.id                     requestId\n" +
            "FROM import_authorization ia\n" +
            "  LEFT JOIN amed.nm_economic_agents ea on ia.importer_id = ea.id\n" +
            "  LEFT JOIN amed.nm_currencies c on ia.currency = c.id\n" +
            "  LEFT JOIN amed.import_authorization_details iad on iad.Import_authorization_id = ia.id\n" +
            "WHERE\n" +
            "  (?1 IS NULL OR ia.authorization_number = ?1) AND\n" +
            "  (?2 IS NULL OR ia.importer_id = ?2) AND\n" +
            "  (?3 IS NULL OR ia.expiration_date = ?3) AND\n" +
            "  (?4 IS NULL OR ia.summ = ?4) AND\n" +
            "  (?5 IS NULL OR ia.currency = ?5) AND\n" +
            "  (?6 IS NULL OR iad.name = ?6 OR iad.code_amed = ?6 OR iad.medicament_id = ?6) AND\n" +
            "  (?7 IS NULL OR ia.med_type= ?7) AND\n" +
            "  (?8 IS NULL OR ia.authorized = ?8)"
            , nativeQuery = true)
    List<ImportAuthorizationDTO> getAuthorizationByFilter(String authorizationNumber,
                                                          String importer,
                                                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date expirationDate,
                                                          String summ,
                                                          String currency,
                                                          String medicament,
                                                          String medType,
                                                          String status);
}
