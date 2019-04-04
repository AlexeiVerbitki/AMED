package com.bass.amed.repository;

import com.bass.amed.entity.NmReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NmReportRepository extends JpaRepository<NmReport, Integer>
{
    List<NmReport> findNmReportsByReportType_Id(Integer reportId);
}
