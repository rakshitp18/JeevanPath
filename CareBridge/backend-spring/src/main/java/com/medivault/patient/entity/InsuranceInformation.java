package com.medivault.patient.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "insurance_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsuranceInformation extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(nullable = false)
    private String provider;

    @Column(name = "policy_number", nullable = false, length = 100)
    private String policyNumber;

    @Column(name = "policy_holder", nullable = false)
    private String policyHolder;

    @Column(name = "coverage_type", length = 100)
    private String coverageType;

    @Column(name = "coverage_amount", precision = 12, scale = 2)
    private BigDecimal coverageAmount;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "policy_status", length = 50)
    private String policyStatus;

    @Column(name = "emergency_coverage", nullable = false)
    @Builder.Default
    private Boolean emergencyCoverage = false;
}
