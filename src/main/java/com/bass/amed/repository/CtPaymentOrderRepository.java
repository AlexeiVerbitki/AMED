package com.bass.amed.repository;

import com.bass.amed.entity.CtPaymentOrdersEntity;
import com.bass.amed.entity.PaymentOrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CtPaymentOrderRepository extends JpaRepository<CtPaymentOrdersEntity, Integer> {

    List<CtPaymentOrdersEntity> findByregistrationRequestId(Integer registrationRequestId);
}
