package com.bass.amed.repository;

import com.bass.amed.entity.MedicamentRegistrationNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface GenerateMedicamentRegistrationNumberRepository extends JpaRepository<MedicamentRegistrationNumberSequence, Integer> {
    @Modifying
    @Query(value = "ALTER TABLE seq_medicament_registration_nr AUTO_INCREMENT = ?1", nativeQuery = true)
    void changeAutoIncrementFormMedicamentRegNr(Integer regNr);

    @Modifying
    @Query(value = "DELETE FROM seq_medicament_registration_nr where id >= ?1", nativeQuery = true)
    void deleteSeq(Integer regNr);
}
