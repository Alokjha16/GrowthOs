package com.tcet.growthos.controller;

import com.tcet.growthos.entity.Business;
import com.tcet.growthos.service.BusinessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
@RequiredArgsConstructor
@Tag(name = "1. Store & Brand Management", description = "CRUD operations for D2C Brands and E-commerce Stores")
public class BusinessController {

    private final BusinessService businessService;

    @Operation(summary = "Get all registered businesses / stores")
    @GetMapping
    public ResponseEntity<List<Business>> getAllBusinesses(
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String keyword) {
        if (industry != null && !industry.isBlank()) {
            return ResponseEntity.ok(businessService.filterByIndustry(industry));
        }
        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(businessService.searchByName(keyword));
        }
        return ResponseEntity.ok(businessService.getAllBusinesses());
    }

    @Operation(summary = "Get a single store by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Business> getBusinessById(@PathVariable Long id) {
        return businessService.getBusinessById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Onboard a new store / brand")
    @PostMapping
    public ResponseEntity<Business> createBusiness(@Valid @RequestBody Business business) {
        Business saved = businessService.createBusiness(business);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Update store metrics & financials")
    @PutMapping("/{id}")
    public ResponseEntity<Business> updateBusiness(
            @PathVariable Long id,
            @Valid @RequestBody Business business) {
        return businessService.updateBusiness(id, business)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Remove a store by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        if (businessService.deleteBusiness(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}