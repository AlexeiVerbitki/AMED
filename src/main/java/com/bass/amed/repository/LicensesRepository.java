package com.bass.amed.repository;

import com.bass.amed.entity.LicensesEntity;
import com.bass.amed.projection.LicenseCompanyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LicensesRepository extends JpaRepository<LicensesEntity, Integer>
{
    @Query(value = "SELECT * FROM licenses where ec_agent_id = ?1", nativeQuery = true)
    Optional<LicensesEntity> getLicenseByCompanyId(Integer companyId);
}
