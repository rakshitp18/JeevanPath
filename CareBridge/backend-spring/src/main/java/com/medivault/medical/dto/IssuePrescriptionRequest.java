package com.medivault.medical.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class IssuePrescriptionRequest {
    private String notes;
    
    @NotEmpty(message = "At least one medicine is required")
    @Valid
    private List<PrescriptionMedicineDto> medicines;
}
