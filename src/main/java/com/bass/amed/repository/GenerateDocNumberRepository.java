package com.bass.amed.repository;

import com.bass.amed.entity.DocumentNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenerateDocNumberRepository extends JpaRepository<DocumentNumberSequence, Integer>
{
}
