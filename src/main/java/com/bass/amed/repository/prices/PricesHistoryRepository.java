package com.bass.amed.repository.prices;
import com.bass.amed.entity.PricesHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PricesHistoryRepository extends JpaRepository<PricesHistoryEntity, Integer>
{
    List<PricesHistoryEntity> findAllByMedicamentId(Integer MedId);
}
