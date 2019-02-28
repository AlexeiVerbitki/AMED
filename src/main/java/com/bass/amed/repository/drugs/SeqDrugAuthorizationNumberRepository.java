package com.bass.amed.repository.drugs;

import com.bass.amed.entity.sequence.SeqDrugAuthorizationNumberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeqDrugAuthorizationNumberRepository extends JpaRepository<SeqDrugAuthorizationNumberEntity, Integer>
{
}
