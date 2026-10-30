package com.tcet.growthos.controller;

import com.tcet.growthos.entity.DiagnosisReport;
import com.tcet.growthos.service.DiagnosisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagnose")
@RequiredArgsConstructor
@Tag(name = "2. 7-Agent Diagnosis Engine", description = "AI & Heuristic Diagnostic Engine analyzing store metrics across 7 agents")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    @Operation(summary = "Execute 7-agent diagnosis on a store by businessId")
    @PostMapping("/{businessId}")
    public ResponseEntity<DiagnosisReport> runDiagnosis(@PathVariable Long businessId) {
        try {
            DiagnosisReport report = diagnosisService.runDiagnosis(businessId);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get the latest diagnosis audit report for a store")
    @GetMapping("/{businessId}/report")
    public ResponseEntity<DiagnosisReport> getLatestReport(@PathVariable Long businessId) {
        return diagnosisService.getLatestReport(businessId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}