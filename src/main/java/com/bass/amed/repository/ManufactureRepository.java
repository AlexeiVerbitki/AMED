package com.bass.amed.repository;

import com.bass.amed.entity.NmManufacturesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManufactureRepository  extends JpaRepository<NmManufacturesEntity, Integer>
{
    List<NmManufacturesEntity> findByDescriptionStartingWithIgnoreCase(String name);
    List<NmManufacturesEntity> findByIdno(String idno);
}
