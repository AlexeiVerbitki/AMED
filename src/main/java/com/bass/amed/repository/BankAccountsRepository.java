package com.bass.amed.repository;
import com.bass.amed.entity.NmBankAccountsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountsRepository extends JpaRepository<NmBankAccountsEntity, Integer> {
}
