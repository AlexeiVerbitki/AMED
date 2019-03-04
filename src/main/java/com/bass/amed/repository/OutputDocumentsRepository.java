package com.bass.amed.repository;

import com.bass.amed.entity.OutputDocumentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OutputDocumentsRepository extends JpaRepository<OutputDocumentsEntity, Integer>
{
    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'DD'")
    List<OutputDocumentsEntity> findDD();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'DDM'")
    List<OutputDocumentsEntity> findDDM();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'OI'")
    List<OutputDocumentsEntity> findOI();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'OIM'")
    List<OutputDocumentsEntity> findOIM();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'OA'")
    List<OutputDocumentsEntity> findOA();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'LAB'  and p.path is not null")
    List<OutputDocumentsEntity> findLab();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'OM'")
    List<OutputDocumentsEntity> findOM();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'DDC'")
    List<OutputDocumentsEntity> findDDC();

    @Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'DDA'")
    List<OutputDocumentsEntity> findDDA();
	
	@Query("SELECT p FROM OutputDocumentsEntity p WHERE p.docType.category = 'LN'")
    List<OutputDocumentsEntity> findAnihMed();

    @Modifying
    @Query("UPDATE OutputDocumentsEntity p SET p.jobScheduled = :scheduled WHERE p.id = :id")
    void setJobScheduled(@Param("id") Integer id, @Param("scheduled") Boolean scheduled);
}
