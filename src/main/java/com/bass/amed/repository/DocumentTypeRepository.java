package com.bass.amed.repository;

import com.bass.amed.entity.NmDocumentTypesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<NmDocumentTypesEntity, Integer>
{
}
