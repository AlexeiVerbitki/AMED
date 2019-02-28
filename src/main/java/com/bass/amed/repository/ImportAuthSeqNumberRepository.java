package com.bass.amed.repository;

import com.bass.amed.entity.DocumentNumberSequence;
import com.bass.amed.entity.ImportAuthCodeSquenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportAuthSeqNumberRepository extends JpaRepository<ImportAuthCodeSquenceEntity, Integer> {
}
