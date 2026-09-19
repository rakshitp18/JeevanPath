package com.medivault.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorRejectRequest {
    @NotBlank(message = "Rejection reason is required")
    private String reason;
    private String remarks;
}
