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


//    @Query(value = "SELECT * \n" +
//            "       FROM import_authorization_details m\n" +
//            "         LEFT JOIN medicament med on med.id = m.medicament_id\n" +
//            "       WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')) OR\n" +
//            "               med.code like upper(CONCAT(?1, '%'))) and m.approved = ?2 and\n" +
//            "               m.Import_authorization_id like upper(CONCAT(?3, '%')))", nativeQuery = true)
    @Query(value = "SELECT * FROM import_authorization_details m WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')))and m.approved = ?2 and m.Import_authorization_id like upper(CONCAT(?3, '%')))", nativeQuery = true)
    List<ImportAuthorizationDetailsEntity> getAuthorizationDetailsByNameOrCode(String name, Boolean approved, String authId);

    @Query(value = "SELECT * FROM amed.registration_requests m WHERE (m.import_id IS NOT NULL )", nativeQuery = true)
        //    @Query(value = "SELECT * FROM amed.registration_requests m WHERE ((m.code_amed like upper(CONCAT(?1, '%')) or m.name like upper(CONCAT(?1, '%')))and m.approved = ?2 and m" +
    List<RegistrationRequestsEntity> getAuthorizationRegistrationRequest(String name, Boolean approved, String authId);


}
