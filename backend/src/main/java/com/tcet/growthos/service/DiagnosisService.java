package com.tcet.growthos.service;

import com.tcet.growthos.entity.Business;
import com.tcet.growthos.entity.DiagnosisReport;
import com.tcet.growthos.repository.BusinessRepository;
import com.tcet.growthos.repository.DiagnosisReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiagnosisService {

    private final BusinessRepository businessRepository;
    private final DiagnosisReportRepository diagnosisReportRepository;

    public DiagnosisReport runDiagnosis(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new IllegalArgumentException("Business not found with ID: " + businessId));

        int codRate = business.getCodRate() != null ? business.getCodRate() : 50;
        int rtoRate = business.getRtoRate() != null ? business.getRtoRate() : 15;
        double revenue = business.getMonthlyRevenue() != null ? business.getMonthlyRevenue() : 1000000.0;
        double roas = business.getReturnOnAdSpend() != null ? business.getReturnOnAdSpend() : 2.5;
        int repeatPct = business.getRepeatCustomerPercentage() != null ? business.getRepeatCustomerPercentage() : 20;

        // Diagnostic Leakage Calculation
        double rtoLoss = (revenue * (codRate / 100.0) * (rtoRate / 100.0)) * 0.35; // Forward & reverse courier + packaging loss
        double adBleed = roas < 2.5 ? (revenue * 0.15) : 0.0;
        double totalLeakage = Math.round((rtoLoss + adBleed) * 100.0) / 100.0;

        int healthScore = business.calculateInitialHealthScore();
        business.setHealthScore(healthScore);
        businessRepository.save(business);

        String topRisk = String.format("COD at %d%% combined with %d%% RTO is bleeding approximately ₹%.0f per month in dead logistics costs.",
                codRate, rtoRate, rtoLoss);
        String topOpportunity = String.format("Incentivize UPI prepayment (5%% discount/instant cashback) to reduce COD share to under 40%% and recapture ₹%.0f/month.",
                rtoLoss * 0.6);

        String agentsJson = String.format("{"
                + "\"financeAgent\": {\"score\": %d, \"status\": \"OPTIMIZED\", \"finding\": \"Cash cycle stressed by %d%% COD settlement lag\"},"
                + "\"marketingAgent\": {\"score\": %d, \"status\": \"WARNING\", \"finding\": \"ROAS at %.2fx; Meta ad blend over-dependent on cold audiences\"},"
                + "\"operationsAgent\": {\"score\": %d, \"status\": \"CRITICAL\", \"finding\": \"RTO at %d%% above India D2C benchmark of 14%%\"},"
                + "\"unitEconomicsAgent\": {\"score\": %d, \"status\": \"WARNING\", \"finding\": \"Contribution margin 2 is compressed by reverse shipping penalties\"},"
                + "\"retentionAgent\": {\"score\": %d, \"status\": \"NEUTRAL\", \"finding\": \"Repeat rate at %d%% indicates adequate product-market fit\"}"
                + "}",
                healthScore - 5, codRate,
                (int)(roas * 25), roas,
                100 - (rtoRate * 3), rtoRate,
                healthScore + 2,
                repeatPct * 3, repeatPct
        );

        DiagnosisReport report = DiagnosisReport.builder()
                .businessId(businessId)
                .healthScore(healthScore)
                .topRisk(topRisk)
                .biggestOpportunity(topOpportunity)
                .estimatedMonthlyLeakage(totalLeakage)
                .agentsAnalysisJson(agentsJson)
                .build();

        return diagnosisReportRepository.save(report);
    }

    public Optional<DiagnosisReport> getLatestReport(Long businessId) {
        return diagnosisReportRepository.findFirstByBusinessIdOrderByCreatedAtDesc(businessId);
    }
}
