package com.bass.amed.repository;
import com.bass.amed.entity.NmBanksEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<NmBanksEntity, Integer> {
}
