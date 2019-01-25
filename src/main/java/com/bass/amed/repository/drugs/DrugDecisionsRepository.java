package com.bass.amed.repository.drugs;

import com.bass.amed.dto.drugs.DrugDecisionsFilterDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DrugDecisionsRepository extends JpaRepository<DrugDecisionsFilterDTO, Integer> {

    @Query(value = "SELECT dcd.id               id,\n" +
            "       dcd.protocol_nr             protocolNr,\n" +
            "       dcd.protocol_date           protocolDate,\n" +
            "       dcd.drug_substance_types_id drugSubstanceTypesId,\n" +
            "       rr.request_number           requestNumber,\n" +
            "       nea.name                    companyName,\n" +
            "       nea.id                      companyId,\n" +
            "       dst.description             drugSubstanceTypeDescription,\n" +
            "       dst.code                    drugSubstanceTypesCode,\n" +
            "       drd.id                      substanceId,\n" +
            "       drd.substance_name          substanceName\n" +
            "FROM   drug_check_decisions dcd \n" +
            "       LEFT JOIN drug_substance_types dst on dst.id = dcd.drug_substance_types_id\n" +
            "       LEFT JOIN registration_requests rr on rr.id = dcd.registration_request_id\n" +
            "       LEFT JOIN nm_economic_agents nea on nea.id = rr.company_id\n" +
            "       LEFT JOIN drug_import_export_details drd on drd.drug_check_decisions_id = dcd.id\n" +
            "WHERE " +
            "  (dcd.id = ?1)"
            , nativeQuery = true)
    List<DrugDecisionsFilterDTO> getDrugDecisionsById( String id );
}
