package com.bass.amed.repository;

import com.bass.amed.entity.NmEmployeesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<NmEmployeesEntity, Integer>
{
}
