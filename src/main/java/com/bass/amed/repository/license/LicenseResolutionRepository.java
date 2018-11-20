package com.bass.amed.repository.license;

import com.bass.amed.entity.LicenseResolutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LicenseResolutionRepository extends JpaRepository<LicenseResolutionEntity, Integer>
{
}
