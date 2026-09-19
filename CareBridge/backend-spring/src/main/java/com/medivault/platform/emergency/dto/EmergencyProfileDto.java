package com.medivault.platform.emergency.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class EmergencyProfileDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private String bloodGroup;
    private String criticalAllergies;
    private String criticalDiseases;
    private String currentMedications;
    private Boolean organDonor;
    private String emergencyNotes;
    private Boolean isEnabled;
    // Missing fields from Patient profile that are safe to expose (e.g. emergency contacts)
    // could be added here in a real implementation.
}
