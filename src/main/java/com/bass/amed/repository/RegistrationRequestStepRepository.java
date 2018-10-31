package com.bass.amed.repository;

import com.bass.amed.entity.RegistrationRequestStepsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRequestStepRepository extends JpaRepository<RegistrationRequestStepsEntity, Integer>
{
    Optional<List<RegistrationRequestStepsEntity>> findByRequestTypeId(Integer id);
}
