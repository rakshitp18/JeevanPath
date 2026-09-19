package com.medivault.medical.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateMedicalRecordRequest {
    @NotNull(message = "Appointment ID is required")
    private UUID appointmentId;

    @NotBlank(message = "Record type is required")
    private String recordType;
    
    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;
    
    private String chiefComplaint;
    private String clinicalNotes;
    private String treatmentPlan;
    private LocalDate followUpDate;
}
