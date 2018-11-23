package com.bass.amed.repository;

import com.bass.amed.entity.NmCustomsCodesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NmCustomsCodesRepository extends JpaRepository<NmCustomsCodesEntity, Integer> {
    List<NmCustomsCodesEntity> findAll();
}
