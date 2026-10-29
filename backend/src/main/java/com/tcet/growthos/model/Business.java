package com.tcet.growthos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "businesses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Business name is required")
    @Column(nullable = false)
    private String name;

    private String businessType;
    private String industry;
    private String website;

    private Double monthlyRevenue;
    private Double monthlyExpenses;
    private Integer customersPerMonth;
    private Integer repeatCustomerPercentage;

    private Double averageOrderValue;
    private Double customerAcquisitionCost;
    private Double returnOnAdSpend;

    // India D2C specifics
    private Integer codRate; // Cash on delivery %
    private Integer rtoRate; // Return to origin %

    private Integer healthScore;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.healthScore == null) {
            this.healthScore = calculateInitialHealthScore();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public int calculateInitialHealthScore() {
        int score = 70;
        if (codRate != null && codRate > 50) score -= 12;
        if (rtoRate != null && rtoRate > 15) score -= 15;
        if (returnOnAdSpend != null && returnOnAdSpend < 2.0) score -= 10;
        if (repeatCustomerPercentage != null && repeatCustomerPercentage > 25) score += 10;
        return Math.max(20, Math.min(100, score));
    }
}
