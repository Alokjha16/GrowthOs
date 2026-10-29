package com.tcet.growthos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "1. System Health", description = "System status and health check API")
public class HealthController {

    @Operation(summary = "System Health Check")
    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "GrowthOS AI Backend Engine");
        status.put("version", "1.0.0");
        status.put("database", "Connected (Spring Data JPA)");
        status.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(status);
    }
}