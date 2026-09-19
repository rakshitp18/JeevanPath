package com.medivault.patient.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdatePatientProfileRequest {
    private String fullName;
    
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    private String gender;
    
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group")
    private String bloodGroup;
    
    private Double height;
    private Double weight;
    
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{10,15}$", message = "Invalid phone number format")
    private String phone;
    
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{10,15}$", message = "Invalid phone number format")
    private String alternatePhone;
    
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String emergencyContact;
}
