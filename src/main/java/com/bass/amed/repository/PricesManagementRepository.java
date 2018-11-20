package com.bass.amed.repository;

import com.bass.amed.dto.PricesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface PricesManagementRepository extends JpaRepository<PricesDTO, Integer>
{

    @Query(value = "SELECT rr.id               id,\n" +
            "       m.code              medicamentCode,\n" +
            "       rr.request_number   requestNumber,\n" +
            "       m.name              medicament,\n" +
            "       mt.description      medicamentType,\n" +
            "       p.value             price,\n" +
            "       c.short_description currency,\n" +
            "       rr.assigned_user    assignedPerson,\n" +
            "       rr.start_date       startDate,\n" +
            "       rr.end_date         endDate,\n" +
            "       rr.current_step     currentStep,\n" +
            "       pt.description      priceType,\n" +
            "       p.folder_nr         folderNr\n" +
            "FROM registration_requests rr\n" +
            "       LEFT JOIN prices p on rr.price_id = p.id\n" +
            "       LEFT JOIN medicament m ON p.medicament_id = m.id\n" +
            "       LEFT JOIN nm_medicament_type mt ON m.type_id = mt.id\n" +
            "       LEFT JOIN nm_price_types pt on p.type_id = pt.id\n" +
            "       LEFT JOIN nm_currencies c on p.currency_id = c.id\n" +
            "       LEFT JOIN request_types rt on rr.type_id = rt.id\n" +
            "WHERE rt.process_id = 5  AND\n" +
            "  (?1 IS NULL OR rr.request_number = ?1) AND\n" +
            "  (?2 IS NULL OR m.code = ?2) AND\n" +
            "  (?3 IS NULL OR mt.description = ?3) AND\n" +
            "  (?4 IS NULL OR rr.current_step = ?4) AND\n" +
            "  (?5 IS NULL OR pt.description = ?5) AND\n" +
            "  (?6 IS NULL OR rr.assigned_user = ?6) AND\n" +
            "  (?7 IS NULL OR rr.start_date >= ?7) AND\n" +
            "  (?8 IS NULL OR rr.end_date <= ?8) AND\n" +
            "  (?9 IS NULL OR p.folder_nr = ?9)"
            , nativeQuery = true)
    List<PricesDTO> getPricesByFilter(String requestNumber,
                                      String medCode,
                                      String medType,
                                      String step,
                                      String priceType,
                                      String user,
                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
                                      String folderNr
    );


}
