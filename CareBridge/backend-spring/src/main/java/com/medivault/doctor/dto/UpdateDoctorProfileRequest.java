package com.medivault.doctor.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class UpdateDoctorProfileRequest {
    private String fullName;
    private String qualification;
    private String specialization;
    private Integer experience;
    private BigDecimal consultationFee;
    private String biography;
    private List<String> languagesSpoken;
    private String consultationMode;
    private UUID hospitalId;
    private UUID departmentId;
}
