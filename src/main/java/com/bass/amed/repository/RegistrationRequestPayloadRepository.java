package com.bass.amed.repository;

import com.bass.amed.entity.RegistrationRequestPayloadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRequestPayloadRepository extends JpaRepository<RegistrationRequestPayloadEntity, Integer>
{
    Optional<RegistrationRequestPayloadEntity> findByRegistrationRequestId(Integer registrationRequestId);
}
