package com.bass.amed.repository;

import com.bass.amed.dto.PrevYearAvgPriceDTO;
import com.bass.amed.entity.InvoiceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface PrevYearsPriceAVGInvoiceDetailsRepository extends JpaRepository<PrevYearAvgPriceDTO, Integer>
{
    @Query(value = "SELECT year(i2.invoice_date) year, AVG(i.price) avgPrice\n" +
            "FROM invoice_details i alter join invoices i2 on i.invoices_id = i2.id\n" +
            "WHERE i.medicament_id = ?1\n" +
            "group by year", nativeQuery = true)
    List<PrevYearAvgPriceDTO> getPreviousYearsImportPriceAVG(Integer medicamentId);
}
