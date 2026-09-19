package com.medivault.analytics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalLogDto {
    @JsonProperty("_id")
    private UUID id;
    
    private UUID userId;
    private LocalDate date;
    
    private Double weight;
    private Double height;
    private Double bmi;
    
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    
    private Double bloodSugarFasting;
    private Double bloodSugarRandom;
    
    private Integer heartRate;
    private Double oxygenLevel;
    private Double temperature;
    private Double sleepHours;
    private Integer steps;
    
    private String notes;
    
    private Instant createdAt;
    private Instant updatedAt;
}
