package com.tcet.growthos.controller;

import com.tcet.growthos.model.Simulation;
import com.tcet.growthos.service.SimulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulate")
@RequiredArgsConstructor
@Tag(name = "3. GrowthOS Scenario Simulator", description = "What-if growth scenarios, cash-flow optimizations, and COD/RTO simulations")
public class SimulationController {

    private final SimulationService simulationService;

    @Operation(summary = "Run a financial & operational simulation scenario for a store")
    @PostMapping("/{businessId}")
    public ResponseEntity<Simulation> runSimulation(
            @PathVariable Long businessId,
            @RequestParam(required = false, defaultValue = "40") Integer targetCodRate,
            @RequestParam(required = false, defaultValue = "3.0") Double targetRoas,
            @RequestParam(required = false, defaultValue = "5.0") Double prepaidDiscount) {
        try {
            Simulation simulation = simulationService.runSimulation(businessId, targetCodRate, targetRoas, prepaidDiscount);
            return ResponseEntity.ok(simulation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get simulation history for a store")
    @GetMapping("/{businessId}/history")
    public ResponseEntity<List<Simulation>> getHistory(@PathVariable Long businessId) {
        return ResponseEntity.ok(simulationService.getSimulationsByBusiness(businessId));
    }
}