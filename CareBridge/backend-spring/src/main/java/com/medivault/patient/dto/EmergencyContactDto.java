package com.medivault.patient.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContactDto {
    private UUID id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    @Pattern(regexp = "^\\+?[0-9\\-\\s]{10,15}$", message = "Invalid phone number format")
    private String alternateNumber;

    @Email(message = "Invalid email format")
    private String email;

    private String address;

    private Boolean isPrimary;
}
