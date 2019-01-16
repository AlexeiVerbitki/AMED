package com.bass.amed.repository;
import com.bass.amed.entity.InvoiceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface InvoiceDetailsRepository extends JpaRepository<InvoiceDetailsEntity, Integer>
{
    @Query(value = "SELECT * FROM invoice_details m WHERE (m.authorizations_number = ?1)",nativeQuery = true)
    List<InvoiceDetailsEntity> findInvoicesByAuthorization(String authorizationNumber);
}
