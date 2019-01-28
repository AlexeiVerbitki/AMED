package com.bass.amed.repository.drugs;

import com.bass.amed.dto.drugs.DrugDecisionsFilterDetailsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface DrugDecisionsFilterRepository extends JpaRepository<DrugDecisionsFilterDetailsDTO, Integer> {

    @Query(value = "SELECT dcd.id               id,\n" +
            "       dcd.protocol_nr             protocolNr,\n" +
            "       dcd.protocol_date           protocolDate,\n" +
            "       dcd.drug_substance_types_id drugSubstanceTypesId,\n" +
            "       rr.request_number           requestNumber,\n" +
            "       nea.name                    companyName,\n" +
            "       nea.id                      companyId,\n" +
            "       dst.description             drugSubstanceTypeDescription,\n" +
            "       dst.code                    drugSubstanceTypesCode\n" +
            "FROM   drug_check_decisions dcd \n" +
            "       LEFT JOIN drug_substance_types dst on dst.id = dcd.drug_substance_types_id\n" +
            "       LEFT JOIN registration_requests rr on rr.id = dcd.registration_request_id\n" +
            "       LEFT JOIN nm_economic_agents nea on nea.id = rr.company_id\n" +
            "WHERE " +
            "  (?1 IS NULL OR dcd.protocol_nr = ?1) AND\n" +
            "  (?2 IS NULL OR dcd.protocol_date = ?2) AND\n" +
            "  (?3 IS NULL OR dcd.drug_substance_types_id = ?3) AND\n" +
            "  (?4 IS NULL OR nea.id = ?4)"
            , nativeQuery = true)
    List<DrugDecisionsFilterDetailsDTO> getDrugDecisionsByFilter(String protocolNr,
                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date protocolDate,
                                                   String drugSubstanceTypesId, String companyId

    );

}
