package com.bass.amed.repository;

import com.bass.amed.entity.ClinicTrialAmendEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicTrialAmendRepository extends JpaRepository<ClinicTrialAmendEntity, Integer> {

    ClinicTrialAmendEntity findByRegistrationRequestId(Integer registrationRequestId);
}
