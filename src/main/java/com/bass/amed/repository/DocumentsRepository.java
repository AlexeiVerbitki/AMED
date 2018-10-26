package com.bass.amed.repository;

import com.bass.amed.entity.DocumentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentsRepository  extends JpaRepository<DocumentsEntity, Integer>
{

}
