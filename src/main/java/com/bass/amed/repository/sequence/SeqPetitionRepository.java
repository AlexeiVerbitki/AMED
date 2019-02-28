package com.bass.amed.repository.sequence;

import com.bass.amed.entity.sequence.SeqPetitionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeqPetitionRepository extends JpaRepository<SeqPetitionsEntity, Integer>
{
}
