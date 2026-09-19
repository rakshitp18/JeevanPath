package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class MedicalRecordDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private UUID doctorId;
    private String doctorName;
    private UUID appointmentId;
    private String recordType;
    private LocalDate visitDate;
    private String diagnosis;
    private String chiefComplaint;
    private String clinicalNotes;
    private String treatmentPlan;
    private LocalDate followUpDate;
    private String status;
}
