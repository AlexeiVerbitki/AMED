package com.bass.amed.repository;

import com.bass.amed.entity.PricesEntity;
import com.bass.amed.entity.RegistrationRequestsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceRepository extends JpaRepository<PricesEntity, Integer>
{
}