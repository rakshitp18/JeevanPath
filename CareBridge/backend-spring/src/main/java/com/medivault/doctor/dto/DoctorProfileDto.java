package com.medivault.doctor.dto;

import com.medivault.hospital.dto.DepartmentDto;
import com.medivault.hospital.dto.HospitalDto;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfileDto {
    private UUID id;
    private String fullName;
    private String medicalRegistrationNumber;
    private String qualification;
    private String specialization;
    private Integer experience;
    private BigDecimal consultationFee;
    private String biography;
    private List<String> languagesSpoken;
    private String consultationMode;
    private String verificationStatus;
    private String profileImage;
    private HospitalDto hospital;
    private DepartmentDto department;
}
