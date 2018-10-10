package com.bass.amed.repository;

import com.bass.amed.entity.DocumentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.print.Doc;
import java.util.Set;

public interface DocumentsRepository  extends JpaRepository<DocumentsEntity, Integer>
{
    @Query(value = "SELECT * FROM documents d WHERE d.license_id = ?1", nativeQuery = true)
    Set<DocumentsEntity> findByLicenseId(int licenseId);
}
