package com.medivault.auth.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    // Common
    private String fullName;
    private String phone;
    
    // Patient specific
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;

    // Doctor specific
    private String qualification;
    private String specialization;
    private Integer experience;
    private String hospitalName;
    private BigDecimal consultationFee;
    private String biography;
}
