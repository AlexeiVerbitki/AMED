package com.bass.amed.repository;

import com.bass.amed.entity.NmLdapUserStatusEntity;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NmLdapUserStatusRepository extends JpaRepository<NmLdapUserStatusEntity, Integer>
{
    @Cacheable("nm_ldap_user_status")
    @Override
    List<NmLdapUserStatusEntity> findAll();
}
