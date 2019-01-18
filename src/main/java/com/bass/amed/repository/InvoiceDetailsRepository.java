package com.bass.amed.repository;
import com.bass.amed.entity.InvoiceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface InvoiceDetailsRepository extends JpaRepository<InvoiceDetailsEntity, Integer>
{

//    @Query(value = "SELECT * FROM import_authorization_details m WHERE (m.code_amed like upper(CONCAT(?1, '%'))and m.approved = ?2 and m.Import_authorization_id= ?3)",nativeQuery = true)
    @Query(value = "SELECT * FROM invoice_details m WHERE (m.authorizations_number = ?1 and m.invoices_id = ?2)",nativeQuery = true)
    List<InvoiceDetailsEntity> findInvoicesByAuthorization(String authorizationNumber, Integer authorizationDetailsId);



}
