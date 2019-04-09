package com.bass.amed.repository;

import com.bass.amed.entity.NmPharmaceuticalFormTypesEntity;
import com.bass.amed.entity.NmPharmaceuticalFormsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PharmaceuticalFormsRepository  extends JpaRepository<NmPharmaceuticalFormsEntity, Integer>
{
    List<NmPharmaceuticalFormsEntity> findByType(NmPharmaceuticalFormTypesEntity type);

    List<NmPharmaceuticalFormsEntity> findByDescriptionStartingWithIgnoreCase(String partialDescr);

    List<NmPharmaceuticalFormsEntity> findAllByOrderByDescriptionAsc();
}
