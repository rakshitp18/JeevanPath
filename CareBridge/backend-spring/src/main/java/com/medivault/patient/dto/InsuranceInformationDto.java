package com.medivault.patient.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceInformationDto {
    private UUID id;

    @NotBlank(message = "Provider is required")
    private String provider;

    @NotBlank(message = "Policy number is required")
    private String policyNumber;

    @NotBlank(message = "Policy holder is required")
    private String policyHolder;

    private String coverageType;

    private BigDecimal coverageAmount;

    @PastOrPresent(message = "Issue date must be in the past or present")
    private LocalDate issueDate;

    @FutureOrPresent(message = "Expiry date must be in the future or present")
    private LocalDate expiryDate;

    private String policyStatus;

    private Boolean emergencyCoverage;
}
