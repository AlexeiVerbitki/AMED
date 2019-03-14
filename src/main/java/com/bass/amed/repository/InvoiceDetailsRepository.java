package com.bass.amed.repository;
import com.bass.amed.entity.InvoiceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface InvoiceDetailsRepository extends JpaRepository<InvoiceDetailsEntity, Integer>
{

    @Query(value = "SELECT * from invoice_details t where ((upper(t.name) like upper(CONCAT(?1, '%'))or t.medicament_id like (CONCAT(?1, '%'))) and t.invoices_id = ?2 and t.saved = ?3)",
            nativeQuery = true)
    List<InvoiceDetailsEntity> findInvoicesByAuthorization(String nameOrCodeAmed,String authorizationNumber, Boolean saved);



}
