package com.bass.amed.repository;

import com.bass.amed.entity.OutputDocumentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OutputDocumentsRepository extends JpaRepository<OutputDocumentsEntity, Integer>
{
    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'DD'")
    List<OutputDocumentsEntity> findDD();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'OI'")
    List<OutputDocumentsEntity> findOI();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'OA'")
    List<OutputDocumentsEntity> findOA();
}
