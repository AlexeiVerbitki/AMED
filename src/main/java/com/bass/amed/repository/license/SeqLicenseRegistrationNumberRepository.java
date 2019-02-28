package com.bass.amed.repository.license;

import com.bass.amed.entity.sequence.SeqLicenseNumberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeqLicenseRegistrationNumberRepository extends JpaRepository<SeqLicenseNumberEntity, Integer>
{
}
