package com.bass.amed.repository;

import com.bass.amed.dto.PrevYearAvgPriceDTO;
import com.bass.amed.entity.InvoiceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface PrevYearsPriceAVGInvoiceDetailsRepository extends JpaRepository<PrevYearAvgPriceDTO, Integer>
{
    @Query(value = "SELECT year(i.approve_date) year, AVG(i.priceMdl) avgPrice FROM invoice_details i WHERE i.medicament_id = ?1 group by year", nativeQuery = true)
    List<PrevYearAvgPriceDTO> getPreviousYearsImportPriceAVG(Integer medicamentId);
}
