package com.bass.amed.repository.drugs;

import com.bass.amed.entity.DrugUnitsConversionRatesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DrugUnitsConversionRatesRepository  extends JpaRepository<DrugUnitsConversionRatesEntity, Integer>
{
    Optional<List<DrugUnitsConversionRatesEntity>> findByRefUnitCode(String code);
}
