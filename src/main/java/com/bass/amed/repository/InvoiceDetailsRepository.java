package com.bass.amed.repository;
import com.bass.amed.entity.InvoiceDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface InvoiceDetailsRepository extends JpaRepository<InvoiceDetailsEntity, Integer>
{
    List<InvoiceDetailsEntity> findAllByMedicamentIdAndApproveDateAfter(Integer medicamentId, Date firstDate);
}
