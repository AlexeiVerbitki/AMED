package com.bass.amed.repository;

import com.bass.amed.entity.NmCountriesEntity;
import com.bass.amed.projection.GetCountriesMinimalProjection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NmCountriesRepository extends JpaRepository<NmCountriesEntity, Integer> {
    List<GetCountriesMinimalProjection> findAllOnlyIdAndAndDescriptionBy();
}
