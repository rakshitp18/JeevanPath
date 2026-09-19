package com.medivault.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QRValidationRequest {
    @NotBlank(message = "Validation token is required")
    private String validationToken;
}
