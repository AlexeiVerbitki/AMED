package com.bass.amed.repository;

import com.bass.amed.entity.NmManufacturesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManufactureRepository  extends JpaRepository<NmManufacturesEntity, Integer>
{
}
