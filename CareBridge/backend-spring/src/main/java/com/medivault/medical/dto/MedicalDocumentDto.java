package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class MedicalDocumentDto {
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private UUID id;
    private UUID patientId;
    private UUID doctorId;
    private UUID appointmentId;
    private UUID medicalRecordId;
    private String documentType;
    private String title;
    private String description;
    private String fileName;
    
    @com.fasterxml.jackson.annotation.JsonProperty("fileUrl")
    private String cloudinaryUrl;
    
    private String publicId;
    private String ocrStatus;
    private ZonedDateTime createdAt;

    public String getOriginalName() {
        return this.title != null ? this.title : this.fileName;
    }
    
    public Long getSize() {
        return 0L; // Mock size to prevent undefined errors in formatBytes
    }
}
