package com.bass.amed.repository;

import com.bass.amed.entity.PaymentOrderNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderNumberRepository extends JpaRepository<PaymentOrderNumberSequence, Integer> {
}
