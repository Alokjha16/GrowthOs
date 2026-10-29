package com.tcet.growthos.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long businessId;

    private Integer healthScore;

    @Column(length = 1000)
    private String topRisk;

    @Column(length = 1000)
    private String biggestOpportunity;

    private Double estimatedMonthlyLeakage;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String agentsAnalysisJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
