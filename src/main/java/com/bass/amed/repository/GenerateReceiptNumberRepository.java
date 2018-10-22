package com.bass.amed.repository;

import com.bass.amed.entity.ReceiptNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenerateReceiptNumberRepository extends JpaRepository<ReceiptNumberSequence, Integer> {
}
