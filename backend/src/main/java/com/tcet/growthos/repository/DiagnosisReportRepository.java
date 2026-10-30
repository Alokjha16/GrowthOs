package com.tcet.growthos.repository;

import com.tcet.growthos.entity.DiagnosisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiagnosisReportRepository extends JpaRepository<DiagnosisReport, Long> {
    List<DiagnosisReport> findByBusinessIdOrderByCreatedAtDesc(Long businessId);
    Optional<DiagnosisReport> findFirstByBusinessIdOrderByCreatedAtDesc(Long businessId);
}
