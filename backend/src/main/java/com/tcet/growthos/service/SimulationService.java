package com.tcet.growthos.service;

import com.tcet.growthos.model.Business;
import com.tcet.growthos.model.Simulation;
import com.tcet.growthos.repository.BusinessRepository;
import com.tcet.growthos.repository.SimulationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final BusinessRepository businessRepository;
    private final SimulationRepository simulationRepository;

    public Simulation runSimulation(Long businessId, Integer targetCodRate, Double targetRoas, Double prepaidDiscount) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new IllegalArgumentException("Business not found with ID: " + businessId));

        double revenue = business.getMonthlyRevenue() != null ? business.getMonthlyRevenue() : 1500000.0;
        double expenses = business.getMonthlyExpenses() != null ? business.getMonthlyExpenses() : 1100000.0;
        double currentProfit = revenue - expenses;

        int currentCod = business.getCodRate() != null ? business.getCodRate() : 60;
        int currentRto = business.getRtoRate() != null ? business.getRtoRate() : 20;

        int newCod = targetCodRate != null ? targetCodRate : Math.max(30, currentCod - 20);
        double discount = prepaidDiscount != null ? prepaidDiscount : 5.0;

        // Current RTO cost
        double currentRtoBleed = revenue * (currentCod / 100.0) * (currentRto / 100.0) * 0.35;
        // Projected RTO cost with reduced COD
        double projectedRtoBleed = revenue * (newCod / 100.0) * (Math.max(10, currentRto - 8) / 100.0) * 0.35;
        double rtoSavings = Math.max(0, currentRtoBleed - projectedRtoBleed);

        // Cost of offering prepaid discount
        double prepaidVolume = revenue * ((100 - newCod) / 100.0);
        double incentiveCost = prepaidVolume * (discount / 100.0);

        double netGain = Math.round((rtoSavings - incentiveCost + (revenue * 0.04)) * 100.0) / 100.0;
        double newProfit = currentProfit + netGain;

        int projectedHealth = Math.min(95, business.calculateInitialHealthScore() + 18);

        String summary = String.format(
                "Shifting COD from %d%% down to %d%% with a %.1f%% UPI prepayment incentive yields ₹%.0f in logistics & reverse freight savings. Net monthly bottom-line expansion: ₹%.0f.",
                currentCod, newCod, discount, rtoSavings, netGain
        );

        Simulation simulation = Simulation.builder()
                .businessId(businessId)
                .scenarioName("Prepaid Conversion & RTO Suppression")
                .targetCodRate(newCod)
                .targetRoas(targetRoas != null ? targetRoas : 3.0)
                .prepaidIncentiveDiscount(discount)
                .baselineMonthlyProfit(currentProfit)
                .projectedMonthlyProfit(newProfit)
                .projectedRtoSavings(rtoSavings)
                .netMonthlyGain(netGain)
                .projectedHealthScore(projectedHealth)
                .executiveSummary(summary)
                .build();

        return simulationRepository.save(simulation);
    }

    public List<Simulation> getSimulationsByBusiness(Long businessId) {
        return simulationRepository.findByBusinessIdOrderByCreatedAtDesc(businessId);
    }
}