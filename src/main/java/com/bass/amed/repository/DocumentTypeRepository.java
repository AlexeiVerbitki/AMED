package com.bass.amed.repository;

import com.bass.amed.entity.NmDocumentTypesEntity;
import com.bass.amed.entity.NmLdapUserStatusEntity;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentTypeRepository extends JpaRepository<NmDocumentTypesEntity, Integer>
{
    Optional<NmDocumentTypesEntity> findByCategory(String category);

    @Cacheable("all_doc_types")
    @Override
    List<NmDocumentTypesEntity> findAll();
}
