package com.medivault.patient.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class PatientProfileDto {
    private UUID id;
    private String fullName;
    private LocalDate dateOfBirth;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private Double height;
    private Double weight;
    private Double bmi;
    private String phone;
    private String alternatePhone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String profileImage;
    private String emergencyContact;
}
