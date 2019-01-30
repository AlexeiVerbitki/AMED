package com.bass.amed.repository.drugs;

import com.bass.amed.dto.drugs.OldDrugDecisionDetailsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OldDrugDecisionDetailsRepository extends JpaRepository<OldDrugDecisionDetailsDTO, Integer> {

    @Query(value = "SELECT dcd.id                  id,\n" +
            "       dcd.protocol_nr                protocolNr,\n" +
            "       dcd.protocol_date              protocolDate,\n" +
            "       dcd.drug_substance_types_id    drugSubstanceTypesId,\n" +
            "       dcd.registration_request_id    registrationRequestId,\n" +
            "       dcd.paid_date                  paidDate,\n" +
            "       dcd.paycheck_nr                paycheckNr,\n" +
            "       dcd.paycheck_date              paycheckDate,\n" +
            "       dcd.drug_commite_id            drugCommiteId,\n" +
            "       dcd.announcement_date          announcementDate,\n" +
            "       dcd.announcement_method_id     announcementMethodId,\n" +
            "       dcd.cpcd_response_nr           cpcdResponseNr,\n" +
            "       dcd.cpcd_response_date         cpcdResponseDate\n" +
            "FROM   drug_check_decisions dcd \n" +
            "       LEFT JOIN drug_substance_types dst on dst.id = dcd.drug_substance_types_id\n" +
            "       LEFT JOIN nm_economic_agents nea on nea.drug_check_decisions_id = dcd.id\n" +
            "WHERE " +
            "  (nea.code = ?1)"
            , nativeQuery = true)
    List<OldDrugDecisionDetailsDTO> getDetailsByCompanyCode(String code );

}
