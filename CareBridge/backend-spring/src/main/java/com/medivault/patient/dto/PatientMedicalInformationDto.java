package com.medivault.patient.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientMedicalInformationDto {
    private UUID id;
    private List<String> allergies;
    private List<String> chronicDiseases;
    private List<String> currentConditions;
    private List<String> currentMedications;
    private List<String> pastSurgeries;
    private List<String> disabilities;
    private String organDonorStatus;
    private String smokingStatus;
    private String alcoholConsumption;
    private String vaccinationStatus;
}
