package com.bass.amed.repository;

import com.bass.amed.entity.NmImportActivitiesEntity;
import com.bass.amed.entity.NmImportSources;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NmImportSourcesRepository extends JpaRepository<NmImportSources, Integer>
{
}
