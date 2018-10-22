package com.bass.amed.repository;

import com.bass.amed.entity.DocumentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface DocumentsRepository  extends JpaRepository<DocumentsEntity, Integer>
{
}
