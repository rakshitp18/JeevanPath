package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PrescriptionMedicineDto {
    private UUID id;
    private String medicineName;
    private String genericName;
    private String dosage;
    private String frequency;
    private Integer durationDays;
    private String route;
    private String instructions;
    private Boolean beforeFood;
    private Boolean morning;
    private Boolean afternoon;
    private Boolean evening;
    private Boolean night;
}
