package com.bass.amed.repository;

import com.bass.amed.entity.RegistrationRequestJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RegistrationRequestJobsRepository extends JpaRepository<RegistrationRequestJobEntity, Integer> {
    Optional<RegistrationRequestJobEntity> findByRequestIdAndExpiredMethodAndPauseDateIsNull(Integer requestId, String expiredMethod);

    @Query(value = "SELECT r.* FROM registration_request_jobs r WHERE r.request_id = ?1 AND r.expired_method = ?2 order by id desc limit 1", nativeQuery = true)
    Optional<RegistrationRequestJobEntity> findLastRequestJobsByRequestIdAndMethodExpired(Integer requestId, String expiredMethod);
}
