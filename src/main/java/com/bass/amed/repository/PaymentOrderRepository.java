package com.bass.amed.repository;

import com.bass.amed.entity.PaymentOrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrdersEntity, Integer>
{
    List<PaymentOrdersEntity> findByregistrationRequestId(Integer registrationRequestId);
}
