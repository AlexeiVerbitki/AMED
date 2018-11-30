package com.bass.amed.repository;

import com.bass.amed.entity.ReceiptsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceiptRepository extends JpaRepository<ReceiptsEntity, Integer>
{
    List<ReceiptsEntity> findByPaymentOrderNumberIn(List<String> paymentOrderNumbers);
}
