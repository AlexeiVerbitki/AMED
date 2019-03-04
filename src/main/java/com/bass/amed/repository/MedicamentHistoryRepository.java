package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicamentHistoryRepository extends JpaRepository<MedicamentHistoryEntity, Integer>
{
    @Query("SELECT distinct m FROM MedicamentHistoryEntity m,RegistrationRequestsEntity  r " +
            "LEFT JOIN FETCH m.manufacturesHistory " +
            "WHERE m.requestId = r.id and r.labIncluded = true and r.labNumber is null")
    List<MedicamentHistoryEntity> getMedicamentsForLab();
}
