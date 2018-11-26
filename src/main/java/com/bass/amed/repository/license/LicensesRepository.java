package com.bass.amed.repository.license;

import com.bass.amed.entity.LicensesEntity;
import com.bass.amed.projection.LicenseCompanyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface LicensesRepository extends JpaRepository<LicensesEntity, Integer>
{
    @Query(value = "SELECT * FROM licenses where ec_agent_id = ?1 and status='F' and expiration_date > ?2", nativeQuery = true)
    Optional<LicensesEntity> getActiveLicenseByCompanyId(Integer companyId, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date now);


    @Query(value = "SELECT * FROM licenses where id = ?1 and status='F' and expiration_date > ?2", nativeQuery = true)
    Optional<LicensesEntity> getActiveLicenseById(Integer id, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date now);
}
