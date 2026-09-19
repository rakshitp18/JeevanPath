package com.medivault.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterDoctorRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, and one number")
    private String password;

    @NotBlank(message = "Medical registration number is required")
    private String medicalRegistrationNumber;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotBlank(message = "Specialization is required")
    private String specialization;
}
