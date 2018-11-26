package com.bass.amed.repository;

import com.bass.amed.entity.RegistrationRequestStepsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RegistrationRequestStepRepository extends JpaRepository<RegistrationRequestStepsEntity, Integer>
{
    Optional<List<RegistrationRequestStepsEntity>> findByRequestTypeId(Integer id);
    Optional<RegistrationRequestStepsEntity> findOneByRequestTypeIdAndCode(Integer id,String code);


    @Query(value = "select s.* from registration_request_steps s join request_types t on s.request_type_id = t.id and  t.code = ?1 and s.code = ?2", nativeQuery = true)
    Optional<RegistrationRequestStepsEntity> findByRequestCodeAndStep(String requestCode,String step);
}
