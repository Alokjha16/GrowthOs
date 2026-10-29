package com.tcet.growthos.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long businessId;

    private String scenarioName; // e.g. "Prepaid Shift + RTO Reduction"

    // Inputs / Levers
    private Integer targetCodRate; // target COD %
    private Double targetRoas;     // target ROAS
    private Double prepaidIncentiveDiscount; // e.g. 5%

    // Projected Impacts
    private Double baselineMonthlyProfit;
    private Double projectedMonthlyProfit;
    private Double projectedRtoSavings;
    private Double netMonthlyGain;
    private Integer projectedHealthScore;

    @Column(length = 2000)
    private String executiveSummary;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}